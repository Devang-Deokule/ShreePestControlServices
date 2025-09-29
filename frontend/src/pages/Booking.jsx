import { useState } from "react";
import axios from "axios";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    serviceAddress: "",
    serviceType: "",
    urgency: "Normal (3-5 days)",
    date: "",
    time: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/bookings", formData);
      alert("Booking submitted successfully!");
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        serviceAddress: "",
        serviceType: "",
        urgency: "Normal (3-5 days)",
        date: "",
        time: "",
        description: ""
      });
    } catch (err) {
      alert("Error submitting booking: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow-md max-w-lg mx-auto">
      <input type="text" name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="tel" name="phoneNumber" placeholder="Phone Number *" value={formData.phoneNumber} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="text" name="serviceAddress" placeholder="Service Address *" value={formData.serviceAddress} onChange={handleChange} className="w-full border p-2 rounded" required />

      <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full border p-2 rounded" required>
        <option value="">Select Service Type *</option>
        <option value="Cockroach Pest Control">Cockroach Pest Control</option>
        <option value="Woodborers Control">Woodborers Control</option>
        <option value="Bed Bugs Treatment">Bed Bugs Treatment</option>
        <option value="Rodent Control">Rodent Control</option>
        <option value="Termite Pest Control">Termite Pest Control</option>
        <option value="Pre-construction Termite Treatment">Pre-construction Termite Treatment</option>
        <option value="Post-construction Anti-termite Treatment">Post-construction Anti-termite Treatment</option>
      </select>

      <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full border p-2 rounded">
        <option>Normal (3-5 days)</option>
        <option>Urgent (1-2 days)</option>
        <option>Emergency (Same Day)</option>
      </select>

      <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full border p-2 rounded" required />
      <textarea name="description" placeholder="Problem Description..." value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" />

      <button type="submit" className="w-full bg-teal-600 text-white p-3 rounded-lg">Book Service</button>
    </form>
  );
}
