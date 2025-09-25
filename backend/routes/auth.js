import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    ],
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "http://localhost:3000/login", // If login fails
    session: true 
  }),
  async (req, res) => {
    try {
      // Save/update user in DB
      if (req.user && req.user.id) {
        await User.findOneAndUpdate(
          { googleId: req.user.id },
          { 
            name: req.user.displayName,
            email: req.user.emails[0].value,
            accessToken: req.user.accessToken
          },
          { upsert: true, new: true }
        );
      }
      // ✅ Redirect directly to Dashboard
      res.redirect("http://localhost:3000/u/dashboard");
    } catch (error) {
      console.error("Error in callback:", error);
      res.redirect("http://localhost:3000/login");
    }
  }
);

// Get logged-in user info
router.get("/user", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  
  const userData = {
    _id: req.user._id,
    googleId: req.user.id || req.user.googleId,
    name: req.user.displayName || req.user.name,
    email: req.user.emails?.[0]?.value,
    accessToken: req.user.accessToken,
    photo: req.user.photos?.[0]?.value
  };
  
  console.log("🔑 User data sent to frontend:", userData);
  res.json(userData);
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out" });
  });
});

export default router;
