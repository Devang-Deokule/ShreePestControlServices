import { useState } from "react";
import axios from "axios";
import { Bug, Calendar, Clock, MapPin, Phone, User, Mail } from "lucide-react"; // pest-theme icons

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
    <div className="main">
      <header className="site-header">
        <h1>
          <Bug className="inline-block mr-2 text-[var(--aqua)]" /> Shree Pest
          Control – Book Service
        </h1>
      </header>

      <div className="card">
        <form onSubmit={handleSubmit} className="form-grid">
          {/* Full Name */}
          <div className="field wide">
            <label><User size={16} className="inline-block mr-1 text-[var(--aqua)]"/> Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          {/* Phone */}
          <div className="field">
            <label><Phone size={16} className="inline-block mr-1 text-[var(--aqua)]"/> Phone *</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="field">
            <label><Mail size={16} className="inline-block mr-1 text-[var(--aqua)]"/> Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          {/* Address */}
          <div className="field wide">
            <label><MapPin size={16} className="inline-block mr-1 text-[var(--aqua)]"/> Service Address *</label>
            <input type="text" name="serviceAddress" value={formData.serviceAddress} onChange={handleChange} required />
          </div>

          {/* Service Type */}
          <div className="field wide">
            <label>Service Type *</label>
            <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
              <option value="">-- Select Service --</option>
              <option value="Cockroach Pest Control">Cockroach Pest Control</option>
              <option value="Woodborers Control">Woodborers Control</option>
              <option value="Bed Bugs Treatment">Bed Bugs Treatment</option>
              <option value="Rodent Control">Rodent Control</option>
              <option value="Termite Pest Control">Termite Pest Control</option>
              <option value="Pre-construction Termite Treatment">Pre-construction Termite Treatment</option>
              <option value="Post-construction Anti-termite Treatment">Post-construction Anti-termite Treatment</option>
            </select>
          </div>

          {/* Urgency */}
          <div className="field">
            <label>Urgency</label>
            <select name="urgency" value={formData.urgency} onChange={handleChange}>
              <option>Normal (3-5 days)</option>
              <option>Urgent (1-2 days)</option>
              <option>Emergency (Same Day)</option>
            </select>
          </div>

          {/* Date */}
          <div className="field">
            <label><Calendar size={16} className="inline-block mr-1 text-[var(--aqua)]"/> Preferred Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          {/* Time */}
          <div className="field">
            <label><Clock size={16} className="inline-block mr-1 text-[var(--aqua)]"/> Preferred Time *</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          </div>

          {/* Description */}
          <div className="field wide">
            <label>Problem Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Eg: Cockroaches in kitchen, termites in wood..." />
          </div>

          {/* Button */}
          <div className="field wide">
            <button type="submit" className="primary">
              <Bug className="inline-block mr-2" /> Book Pest Control Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
