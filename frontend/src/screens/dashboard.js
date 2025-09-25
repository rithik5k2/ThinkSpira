import React, { useEffect, useState } from "react";
import Calendar from "../components/calender"; // adjust path if needed
import "./dashboard.css"; // optional styling

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:5000/auth/user", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
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

      {/* Right side → User Info */}
      <div className="dashboard-right">
        <h2>👤 User Details</h2>
        {user ? (
          <div className="user-card">
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
          </div>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
