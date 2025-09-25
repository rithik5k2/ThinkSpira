import express from "express";
import { google } from "googleapis";

const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/auth/google/callback";

// GET assignments
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  console.log("=== 🚀 STARTING ASSIGNMENTS FETCH ===");
  console.log("🔑 User:", req.user.displayName);
  console.log("📧 Email:", req.user.emails?.[0]?.value);

  try {
    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    auth.setCredentials({ access_token: req.user.accessToken });

    const classroom = google.classroom({ version: "v1", auth });

    // 1. Test authentication first
    console.log("🔐 Testing Google authentication...");
    const oauth2 = google.oauth2({ version: "v2", auth });
    const profile = await oauth2.userinfo.get();
    console.log("✅ Authenticated as:", profile.data.email);

    // 2. Fetch all courses
    console.log("📚 Fetching courses...");
    const coursesRes = await classroom.courses.list();
    const courses = coursesRes.data.courses || [];

    console.log(`✅ Found ${courses.length} courses:`);
    courses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.name} (${course.courseState})`);
    });

    if (courses.length === 0) {
      console.log("ℹ️ No courses found for this user");
      return res.status(200).json([]);
    }

    // 3. Fetch coursework
    console.log("📝 Fetching coursework...");
    const assignmentsPromises = courses.map(async (course) => {
      try {
        console.log(`   🔍 Checking: ${course.name}`);
        const worksRes = await classroom.courses.courseWork.list({
          courseId: course.id,
        });

        const works = worksRes.data.courseWork || [];
        console.log(`   ✅ Found ${works.length} assignments in ${course.name}`);

        return works.map((w) => ({
          course: course.name,
          title: w.title,
          dueDate: w.dueDate,
          dueTime: w.dueTime,
        }));
      } catch (error) {
        console.error(`   ❌ Error in ${course.name}:`, error.message);
        return [];
      }
    });

    const assignmentsArrays = await Promise.all(assignmentsPromises);
    const allAssignments = assignmentsArrays.flat();

    console.log(`🎯 TOTAL ASSIGNMENTS: ${allAssignments.length}`);
    allAssignments.forEach((assignment, index) => {
      console.log(`   ${index + 1}. ${assignment.course}: ${assignment.title}`);
    });

    console.log("=== ✅ ASSIGNMENTS FETCH COMPLETE ===");
    res.status(200).json(allAssignments);
  } catch (err) {
    console.error("❌ ERROR fetching assignments:", {
      message: err.message,
      code: err.code,
      response: err.response?.data,
    });

    res.status(500).json({
      message: "Error fetching assignments",
      error: err.message,
    });
  }
});

export default router;
