import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Calendar from "./components/calender";
import Home from "./screens/home";
import Newsfeed from "./screens/newsfeed";

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

  // 👉 Navigation Component
  const Navigation = () => (
    <nav style={{ 
      display: "flex", 
      gap: "20px", 
      marginBottom: "20px",
      padding: "10px",
      backgroundColor: "#f0f0f0",
      borderRadius: "5px"
    }}>
      <a href="/" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Home</a>
      <a href="/calendar" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Calendar</a>
      <a href="/newsfeed" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Newsfeed</a>
    </nav>
  );

  // 👉 User Info Component
  const UserInfo = () => (
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
  );

  // 👉 Login Component
  const LoginPage = () => (
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

  // 👉 Loading Component
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  // 👉 Main App with Routing
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        {!user ? (
          <LoginPage />
        ) : (
          <>
            <UserInfo />
            <Navigation />
            
            <Routes>
              {/* Home Route */}
              <Route path="/" element={<Home user={user} />} />
              
              {/* Calendar Route */}
              <Route path="/calendar" element={<Calendar user={user} />} />
              
              {/* Newsfeed Route */}
              <Route path="/newsfeed" element={<Newsfeed user={user} />} />
              
              {/* Default redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;