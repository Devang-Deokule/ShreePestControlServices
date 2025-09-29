import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
    fullName: String,
    phoneNumber: String,
    email: String,
    serviceAddress: String,
    serviceType: String,
    urgency: String,
    date: String,
    time: String,
    description: String
});

const Booking = mongoose.model("Booking", bookingSchema);

// API Route
app.post("/api/bookings", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: "Booking saved successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
