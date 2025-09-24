import React, { useState, useEffect } from "react";
import Calendar from "./components/calender";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👉 Login with Google
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  // 👉 Fetch logged-in user info
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:5000/auth/user", { 
          credentials: "include" 
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log("👤 User data from backend:", userData);
          setUser(userData);
        }
      } catch (error) {
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // 👉 Logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        credentials: "include"
      });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Google Classroom + Events Calendar</h1>
        <p>Login to view your assignments and events</p>
        <button 
          onClick={loginWithGoogle}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "5px"
      }}>
        <div>
          <h2>Welcome, {user.name} 🎉</h2>
          <p>Email: {user.email}</p>
          <p>User ID: {user.googleId || user._id}</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
      <Calendar user={user} />
    </div>
  );
}

export default App;