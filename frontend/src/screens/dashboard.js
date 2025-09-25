import React, { useEffect, useState } from "react";
import Calendar from "../components/calender"; // adjust path if needed
import "./dashboard.css"; // optional styling

function Dashboard() {
  const [user, setUser] = useState(null);
  const [streakCompleted, setStreakCompleted] = useState(false); // ✅ state for streak

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:5000/auth/user", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);

          // ✅ Save user info in localStorage for Chatbot & Events API
          localStorage.setItem("googleId", data.googleId || data._id);
          localStorage.setItem("userName", data.name || "");
          localStorage.setItem("userEmail", data.email || "");
        } else {
          console.log("⚠️ Not logged in");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Left side → Calendar */}
      <div className="dashboard-left">
        <h2>📅 My Calendar</h2>
        <Calendar user={user} />
      </div>

      {/* Right side → User Info + Certificates + Streak */}
      <div className="dashboard-right">
        {/* User Info Card */}
        <div className="user-card">
          <h2>👤 User Details</h2>
          {user ? (
            <>
              {user.photo && (
                <img
                  src={user.photo}
                  alt="User avatar"
                  className="user-avatar"
                />
              )}
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.googleId || user._id}</p>

              {/* ✅ More details if available */}
              {user.locale && <p><strong>🌍 Locale:</strong> {user.locale}</p>}
              {user.verified && (
                <p><strong>✅ Verified:</strong> {user.verified ? "Yes" : "No"}</p>
              )}
              {user.createdAt && (
                <p><strong>📆 Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              )}
              {user.lastLogin && (
                <p><strong>⏱ Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
              )}
            </>
          ) : (
            <p>No user data available.</p>
          )}
        </div>

        {/* Certificates Card */}
        <div className="certificates-card">
          <h2>🎓 Certificates</h2>
          {user && user.certificates && user.certificates.length > 0 ? (
            <ul>
              {user.certificates.map((cert, idx) => (
                <li key={idx}>
                  <strong>{cert.title}</strong> — {cert.issuer} <br />
                  <small>Issued: {new Date(cert.date).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No certificates available.</p>
          )}
        </div>

        {/* Daily Streak Card */}
        <div className="streak-card">
          <h2>🔥 Daily Streak</h2>
          <div
            className={`streak-circle ${streakCompleted ? "completed" : ""}`}
            onClick={() => setStreakCompleted(!streakCompleted)}
          >
            {streakCompleted ? "✔" : "✖"}
          </div>
          <p>{streakCompleted ? "Completed today!" : "Not completed yet"}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
