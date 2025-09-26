// App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Layout from "./components/Layout";
import "./App.css";
import Home from "./Home";
import Login from "./components/Login/Login";
import Register from "./components/Register";
import NewsFeed from "./screens/newsfeed";
import AuthProvider from "./ProtectedRoutes/AuthContext";
import Dashboard from "./screens/dashboard";
import About from "./screens/about";
import LayOut2 from "./components/LayOut2";
import Chatbot from "./components/ChatBot/Chatbot";
import Calendar from "./components/calender"; // fixed casing
import AlumniSpace from "./components/AlumniSpace";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/auth/user`, {
          credentials: "include",
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

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await fetch(`${apiUrl}/auth/logout`, {
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const Navigation = () => (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "5px",
      }}
    >
      <Link
        to="/gc"
        style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}
      >
        Home
      </Link>
      <Link
        to="/gc/calendar"
        style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}
      >
        Calendar
      </Link>
      <Link
        to="/gc/newsfeed"
        style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}
      >
        Newsfeed
      </Link>
    </nav>
  );

  const UserInfo = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <div>
        <h2>Welcome, {user?.name || "User"} 🎉</h2>
        <p>Email: {user?.email || "N/A"}</p>
        <p>User ID: {user?.googleId || user?._id || "N/A"}</p>
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: "8px 16px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Authenticated User Dashboard */}
          <Route path="/u/" element={<LayOut2 />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="newsfeed" element={<NewsFeed />} />
            <Route path="about" element={<About />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="alumini" element={<AlumniSpace />} />
          </Route>

          {/* Google Classroom Flow */}
          <Route
            path="/gc/*"
            element={
              !user ? (
                <Login />
              ) : (
                <div style={{ padding: "20px" }}>
                  <UserInfo />
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="calendar" element={<Calendar user={user} />} />
                    <Route path="newsfeed" element={<NewsFeed user={user} />} />
                    <Route path="*" element={<Navigate to="/gc" replace />} />
                  </Routes>
                </div>
              )
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
