const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbStore = require('../data/dbStore');
const User = require('../models/User');

const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'natural_organic_eco_super_secret_jwt_key_2026_modern',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (dbStore.isMongoose) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone: phone || '',
        address: address || {},
        role: role === 'admin' ? 'admin' : 'user',
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id, user.email, user.role),
      });
    } else {
      const userExists = dbStore.memoryData.users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      if (userExists) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        _id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'user',
        phone: phone || '',
        address: address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
        },
        createdAt: new Date().toISOString(),
      };

      dbStore.memoryData.users.push(newUser);
      dbStore.save();

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        token: generateToken(newUser._id, newUser.email, newUser.role),
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (dbStore.isMongoose) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          token: generateToken(user._id, user.email, user.role),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      const user = dbStore.memoryData.users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (user && bcrypt.compareSync(password, user.password)) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          token: generateToken(user._id, user.email, user.role),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (dbStore.isMongoose) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = name || user.name;
        user.phone = phone !== undefined ? phone : user.phone;
        if (address) {
          user.address = { ...user.address, ...address };
        }
        const updated = await user.save();
        return res.json({
          _id: updated._id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          phone: updated.phone,
          address: updated.address,
        });
      }
      return res.status(404).json({ message: 'User not found' });
    } else {
      const userIdx = dbStore.memoryData.users.findIndex((u) => u._id === req.user._id);
      if (userIdx !== -1) {
        const u = dbStore.memoryData.users[userIdx];
        u.name = name || u.name;
        u.phone = phone !== undefined ? phone : u.phone;
        if (address) {
          u.address = { ...u.address, ...address };
        }
        dbStore.save();
        const { password, ...safeUser } = u;
        return res.json(safeUser);
      }
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
