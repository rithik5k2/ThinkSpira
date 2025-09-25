import React from "react";

function Home({ user }) {
  return (
    <div>
      <h1>🏠 Home Dashboard</h1>
      <div style={{ 
        padding: "20px", 
        backgroundColor: "#e8f4fd", 
        borderRadius: "8px",
        marginTop: "20px"
      }}>
        <h2>Welcome back, {user.name}!</h2>
        <p>This is your personal dashboard where you can:</p>
        <ul>
          <li>View your upcoming assignments</li>
          <li>Check your calendar events</li>
          <li>See recent news and updates</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;