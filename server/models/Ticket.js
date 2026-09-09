const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email']
  },
  issueType: {
    type: String,
    enum: ['login', 'registration', 'other'],
    required: [true, 'Please select an issue type']
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
