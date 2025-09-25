import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import connectDB from "./dbms.js";
import assignmentRoutes from "./routes/assignment.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import newsRoutes from "./routes/news.js"; // ✅ ADDED
import configurePassport from "./config/passport.js";
import chatRouter from "./routes/chat.js"
dotenv.config();

connectDB();

const app = express();

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
app.use("/api/news", newsRoutes); // ✅ ADDED
app.use("/api/chat",chatRouter);
// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));