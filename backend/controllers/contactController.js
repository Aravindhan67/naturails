const dbStore = require('../data/dbStore');
const Contact = require('../models/Contact');

// @desc    Submit contact message
// @route   POST /api/contact
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    if (dbStore.isMongoose) {
      const contact = await Contact.create({
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
      });
      return res.status(201).json({ message: 'Message sent successfully', contact });
    } else {
      const newContact = {
        _id: `cnt_${Date.now()}`,
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      dbStore.memoryData.contacts.unshift(newContact);
      dbStore.save();
      return res.status(201).json({ message: 'Message sent successfully', contact: newContact });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error submitting contact form' });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
const getContacts = async (req, res) => {
  try {
    if (dbStore.isMongoose) {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      return res.json(contacts);
    } else {
      const contacts = [...dbStore.memoryData.contacts];
      contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(contacts);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact messages' });
  }
};

module.exports = {
  submitContact,
  getContacts,
};
