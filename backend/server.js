import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// =======================
// Booking Schema
// =======================
const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    serviceType: { type: String, required: true },
    urgency: { type: String, default: "Normal (3-5 days)" },
    date: { type: String },
    time: { type: String },
    instructions: { type: String },
    status: { type: String, default: "Pending" }
});

const Booking = mongoose.model("Booking", bookingSchema);

// =======================
// Routes
// =======================

// ✅ Save Booking (maps frontend fields → backend schema)
app.post("/api/bookings", async (req, res) => {
    try {
        const {
            fullName,
            phoneNumber,
            email,
            serviceAddress,
            serviceType,
            urgency,
            date,
            time,
            description
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
            instructions: description
        });

        await newBooking.save();
        res.status(201).json({ message: "✅ Booking saved successfully!" });
    } catch (err) {
        console.error("❌ Error saving booking:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all bookings (for admin)
app.get("/api/admin/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: 1, time: 1 });
        res.json(bookings);
    } catch (err) {
        console.error("❌ Error fetching bookings:", err.message);
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
                ...(time && { time })
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(updatedBooking);
    } catch (err) {
        console.error("❌ Error updating booking:", err.message);
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
        console.error("❌ Error fetching stats:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
