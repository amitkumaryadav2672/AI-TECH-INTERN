const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },
  requirement: {
    type: String,
    required: true,
    trim: true,
  },
  aiCategory: {
    type: String,
    default: 'General Inquiry',
  },
  aiSentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
    default: 'Neutral',
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
  },
  emailOpened: {
    type: Boolean,
    default: false,
  },
  openCount: {
    type: Number,
    default: 0,
  },
  firstOpenedAt: {
    type: Date,
  },
  lastOpenedAt: {
    type: Date,
  },
  linkClicked: {
    type: Boolean,
    default: false,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  firstClickedAt: {
    type: Date,
  },
  previewUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lead', LeadSchema);
