import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 🟢 Get user by Google ID
router.get("/google/:googleId", async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.params.googleId }).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get a user's events by Google ID
router.get("/google/:googleId/events", async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.params.googleId }).select("events");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.events || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Add a new event to user by Google ID
router.post("/google/:googleId/events", async (req, res) => {
  try {
    const { title, date } = req.body;
    const user = await User.findOne({ googleId: req.params.googleId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newEvent = { title, date };
    user.events.push(newEvent);
    await user.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//// DELETE event by googleId + title + date
router.delete("/google/:googleId/events", async (req, res) => {
  try {
    const { googleId } = req.params;
    const { title, date } = req.body;

    if (!googleId || !title || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("🟠 Delete request received:", { googleId, title, date });

    const user = await User.findOne({ googleId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out event matching both title and date
    user.events = user.events.filter(
      (event) =>
        !(event.title === title && new Date(event.date).toISOString() === new Date(date).toISOString())
    );

    await user.save();

    res.json({ success: true, events: user.events });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;
