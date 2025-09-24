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

// 🟢 Get user by MongoDB ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
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

// 🟢 Get a user's events by MongoDB ID
router.get("/:id/events", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("events");
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

// 🟢 Add a new event to user by MongoDB ID
router.post("/:id/events", async (req, res) => {
  try {
    const { title, date } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newEvent = { title, date };
    user.events.push(newEvent);
    await user.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;