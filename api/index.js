// Vercel serverless function entry point
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import connectDB from "../backend/dbms.js";
import assignmentRoutes from "../backend/routes/assignment.js";
import authRoutes from "../backend/routes/auth.js";
import userRoutes from "../backend/routes/user.js";
import newsRoutes from "../backend/routes/news.js";
import configurePassport from "../backend/config/passport.js";
import chatRouter from "../backend/routes/chat.js";

dotenv.config();

const app = express();

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration for Vercel
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Session configuration for Vercel
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Passport configuration
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/assignments", assignmentRoutes);
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/chat", chatRouter);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Connect to database
connectDB();

export default app;
