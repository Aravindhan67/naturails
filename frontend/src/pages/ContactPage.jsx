import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { api } from '../api/api';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.submitContact(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
          We Are Here To Assist
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-botanical-900">
          Connect with Our Herbal Apothecary
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Have questions regarding ingredient suitability, order fulfillment, or wholesale partnerships? 
          Our botanists and care team are delighted to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-6">
            <h3 className="font-serif text-xl font-bold text-botanical-900 pb-3 border-b border-earth-100">
              Apothecary Headquarters
            </h3>

            <div className="space-y-5 text-xs text-stone-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-botanical-50 text-botanical-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-botanical-900 text-sm">Sanctuary Address</h4>
                  <p className="mt-0.5 leading-relaxed">
                    Naturalis Botanicals, 12 Nilgiri Forest Way, Coonoor, Tamil Nadu, 643101, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-botanical-50 text-botanical-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-botanical-900 text-sm">Customer Care</h4>
                  <p className="mt-0.5">care@naturalis-botanicals.com</p>
                  <p className="text-stone-400">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-botanical-50 text-botanical-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-botanical-900 text-sm">Direct Phone</h4>
                  <p className="mt-0.5">+91 98765 43210</p>
                  <p className="text-stone-400">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-botanical-50 text-botanical-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-botanical-900 text-sm">Harvest & Lab Hours</h4>
                  <p className="mt-0.5">Saturday - Thursday: 8:00 AM - 5:00 PM</p>
                  <p className="text-stone-400">Closed on lunar botanical holidays</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-earth-200 p-6 sm:p-10 shadow-soft space-y-6">
          <h3 className="font-serif text-xl font-bold text-botanical-900 pb-3 border-b border-earth-100">
            Send an Inquiry
          </h3>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-2xl text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="block font-bold">Message Received Into Database!</strong>
                <span>Our herbalists will review your inquiry and follow up shortly.</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Elena Vance"
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="elena@example.com"
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
              >
                <option value="General Inquiry">General Botanical Inquiry</option>
                <option value="Order Tracking">Order & Delivery Assistance</option>
                <option value="Product Recommendation">Product & Skin Consultation</option>
                <option value="Wholesale">Wholesale & Eco-Gifting</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="How may our herbal team assist your ritual today?..."
                className="w-full text-xs p-4 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 active:scale-95 text-white px-8 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-card disabled:bg-stone-300"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
