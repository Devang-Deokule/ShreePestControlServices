const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Booking = require("./models/Booking"); // <-- import your schema

dotenv.config();
const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookingdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// =======================
// Routes
// =======================

// ✅ Save Booking (map frontend fields → schema fields)
app.post("/api/bookings", async (req, res) => {
  try {
    console.log("Incoming booking:", req.body);

    const {
      fullName,
      phoneNumber,
      email,
      serviceAddress,
      serviceType,
      urgency,
      date,
      time,
      description,
    } = req.body;

    const newBooking = new Booking({
      name: fullName,
      phone: phoneNumber,
      email,
      address: serviceAddress,
      serviceType,
      urgency,
      date,
      time,
      instructions: description,
    });

    await newBooking.save();
    res.status(201).json({ message: "✅ Booking saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all bookings (for admin)
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update booking (status, date, time)
app.put("/api/admin/bookings/:id", async (req, res) => {
  try {
    const { status, date, time } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(date && { date }),
        ...(time && { time }),
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (err) {
    console.error("❌ Error updating booking:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get stats (Pending, Completed, Rescheduled)
app.get("/api/admin/stats", async (req, res) => {
  try {
    const pending = await Booking.countDocuments({ status: "Pending" });
    const completed = await Booking.countDocuments({ status: "Completed" });
    const rescheduled = await Booking.countDocuments({ status: "Rescheduled" });

    res.json({ pending, completed, rescheduled });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
