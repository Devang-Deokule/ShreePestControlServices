
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  serviceType: { type: String, required: true },
  urgency: { type: String, default: 'Normal (3-5 days)' },
  date: { type: String },   // or type: Date if you want proper Date object
  time: { type: String },
  instructions: { type: String },
  status: { type: String, default: "Pending" }
}, { timestamps: true }); // ✅ adds createdAt & updatedAt automatically

module.exports = mongoose.model('Booking', bookingSchema);

