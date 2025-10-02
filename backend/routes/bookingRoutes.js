// backend/routes/bookingRoutes.js
import express from "express";
import Booking from "../models/Booking.js";
import { verifiedEmails, transporter } from "../server.js"; // ✅ Reuse from server.js

const router = express.Router();

// --- Serviceable pincodes (can also use env var) ---
const SERVICEABLE_PINCODES = (
  process.env.SERVICEABLE_PINCODES || "560001,560002,560003,400001,400002"
)
  .split(",")
  .map((s) => s.trim());

// --- Helpers ---
function sanitizeString(s) {
  return typeof s === "string" ? s.trim() : s;
}
function isPastDateTime(dateStr, timeStr) {
  if (!dateStr) return false;
  const now = new Date();
  const parts = dateStr.split("-");
  if (parts.length !== 3) return false;
  const [y, m, d] = parts.map((p) => parseInt(p, 10));
  let dt;
  if (timeStr) {
    const [hh, mm] = timeStr.split(":").map((p) => parseInt(p, 10));
    dt = new Date(y, m - 1, d, hh || 0, mm || 0, 0);
  } else {
    dt = new Date(y, m - 1, d);
  }
  return dt < now;
}

// --- Pincode check API ---
router.get("/pincode/check/:pincode", (req, res) => {
  const { pincode } = req.params;
  const ok = SERVICEABLE_PINCODES.includes(pincode.trim());
  return res.json({ success: true, serviceable: ok });
});

// --- Create Booking (OTP required) ---
router.post("/bookings", async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      serviceAddress,
      pincode,
      serviceType,
      urgency,
      date,
      time,
      description,
    } = req.body;

    // Required fields
    if (!fullName || !phoneNumber || !email || !serviceAddress || !pincode || !serviceType) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Enforce OTP verification
    if (!verifiedEmails.has(email)) {
      return res
        .status(403)
        .json({ success: false, message: "OTP not verified for this email" });
    }

    // Check pincode
    if (!SERVICEABLE_PINCODES.includes(pincode.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Service not available in this pincode" });
    }

    // Prevent past date/time bookings
    if (isPastDateTime(date, time)) {
      return res
        .status(400)
        .json({ success: false, message: "Date/time is in the past" });
    }

    const newBooking = new Booking({
      name: sanitizeString(fullName),
      phone: sanitizeString(phoneNumber),
      email: sanitizeString(email),
      address: sanitizeString(serviceAddress),
      pincode: sanitizeString(pincode),
      serviceType: sanitizeString(serviceType),
      urgency: sanitizeString(urgency) || "Normal (3-5 days)",
      date: sanitizeString(date) || "",
      time: sanitizeString(time) || "",
      instructions: sanitizeString(description) || "",
      status: "Pending",
      verified: true,
    });

    const savedBooking = await newBooking.save();
    verifiedEmails.delete(email); // OTP cannot be reused

    // Respond immediately
    res.status(201).json({ success: true, booking: savedBooking });

    // Fire-and-forget emails
    (async () => {
      try {
        // --- Customer confirmation mail ---
        await transporter.sendMail({
          from: `"Shree Pest Control" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "✅ Booking Confirmation – Shree Pest Control",
          html: `
            <h2>Dear ${sanitizeString(fullName)},</h2>
            <p>Thank you for choosing <b>Shree Pest Control Services</b>.</p>
            <p>Your booking has been received with the following details:</p>
            <ul>
              <li><b>Service:</b> ${sanitizeString(serviceType)}</li>
              <li><b>Date:</b> ${date || "Not specified"}</li>
              <li><b>Time:</b> ${time || "Not specified"}</li>
              <li><b>Urgency:</b> ${urgency}</li>
              <li><b>Address:</b> ${serviceAddress}, ${pincode}</li>
            </ul>
            <p>We will contact you shortly to confirm the details.</p>
            <p style="margin-top:16px">– Shree Pest Control Team</p>
          `,
        });

        // --- Admin notification mail ---
        if (process.env.ADMIN_EMAIL) {
          await transporter.sendMail({
            from: `"Shree Pest Control Website" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "📩 New Booking Received – Shree Pest Control",
            html: `
              <h3>New Booking Received</h3>
              <p><b>Name:</b> ${fullName}</p>
              <p><b>Phone:</b> ${phoneNumber}</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Service:</b> ${serviceType}</p>
              <p><b>Date:</b> ${date || "Not specified"}</p>
              <p><b>Time:</b> ${time || "Not specified"}</p>
              <p><b>Urgency:</b> ${urgency}</p>
              <p><b>Address:</b> ${serviceAddress}, ${pincode}</p>
              <p><b>Instructions:</b> ${description || "None"}</p>
            `,
          });
        }
      } catch (e) {
        console.error("❌ Error sending email:", e.message);
      }
    })();
  } catch (err) {
    console.error("❌ Error saving booking:", err.message);
    res.status(500).json({ success: false, message: "Booking failed, please try again" });
  }
});

// --- Admin: get all bookings ---
router.get("/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Admin: update booking ---
router.put("/admin/bookings/:id", async (req, res) => {
  try {
    const { status, date, time } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(date && { date }), ...(time && { time }) },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Admin: stats ---
router.get("/admin/stats", async (req, res) => {
  try {
    const pending = await Booking.countDocuments({ status: "Pending" });
    const completed = await Booking.countDocuments({ status: "Completed" });
    const total = await Booking.countDocuments();
    res.json({ success: true, stats: { pending, completed, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
