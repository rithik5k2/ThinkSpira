import mongoose from "mongoose";

// Event sub-schema
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [3, "Event title must be at least 3 characters long"],
      maxlength: [100, "Event title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    allDay: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// User schema with embedded events
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    accessToken: {
      type: String,
    },
    events: [eventSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);