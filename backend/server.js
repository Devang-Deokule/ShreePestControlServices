// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookingRoutes from "./routes/bookingRoutes.js";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// =======================
// OTP Store (in-memory)
// =======================
const otpStore = {}; // { email: { otp, expires } }
export const verifiedEmails = new Set(); // track verified emails

// =======================
// Nodemailer Transport (single account for all mails)
// =======================
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. devangdeokule26@gmail.com
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// Log credentials (safe check)
console.log("📧 Email Config:", {
  user: process.env.EMAIL_USER || "❌ MISSING",
  pass: process.env.EMAIL_PASS ? "✔️ Exists" : "❌ Missing",
});

// =======================
// Send OTP
// =======================
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

  try {
    await transporter.sendMail({
      from: `"Shree Pest Control" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code – Shree Pest Control",
      html: `
        <h2>Welcome to Shree Pest Control Services</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color:#00c2cb">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("❌ OTP send error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to send OTP. Try again." });
  }
});

// =======================
// Verify OTP
// =======================
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) {
    return res
      .status(400)
      .json({ success: false, message: "No OTP found. Please request again." });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res
      .status(400)
      .json({ success: false, message: "OTP expired. Please request again." });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }

  // ✅ Success
  delete otpStore[email];
  verifiedEmails.add(email);

  res.json({ success: true, message: "OTP verified successfully" });
});

// =======================
// Routes
// =======================
app.use("/api", bookingRoutes);

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
