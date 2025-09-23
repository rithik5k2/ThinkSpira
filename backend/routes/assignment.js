const express = require("express");
const { google } = require("googleapis");

const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/auth/google/callback";

// GET assignments
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    auth.setCredentials({ access_token: req.user.accessToken });

    const classroom = google.classroom({ version: "v1", auth });

    // Fetch all courses
    const coursesRes = await classroom.courses.list();
    const courses = coursesRes.data.courses || [];

    // Fetch all coursework
    const assignmentsPromises = courses.map(async (course) => {
      const worksRes = await classroom.courses.courseWork.list({
        courseId: course.id,
      });

      const works = worksRes.data.courseWork || [];
      return works.map((w) => ({
        course: course.name,
        title: w.title,
        dueDate: w.dueDate,
        dueTime: w.dueTime,
      }));
    });

    const assignmentsArrays = await Promise.all(assignmentsPromises);
    const allAssignments = assignmentsArrays.flat();

    res.status(200).json(allAssignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assignments" });
  }
});

module.exports = router;
