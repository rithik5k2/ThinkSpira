// src/components/Login/Login.jsx
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import "./Login.css"; // ✅ Exam-style CSS

const Login = () => {
  const [activeTab, setActiveTab] = useState("terminal");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const terminalRef = useRef(null);
  const googleAuthRef = useRef(null);
  const animationRef = useRef(null);

  // ✅ Real Google login redirect
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  // Fake terminal login simulation
  const handleLogin = async (e) => {
    e.preventDefault();
    if (activeTab === "terminal") {
      if (!username || !password) {
        setMessage("Please enter both username and password");
        return;
      }
      setIsLoading(true);
      await simulateTerminalLogin();
      setIsLoading(false);
    }
  };

  const simulateTerminalLogin = () => {
    return new Promise((resolve) => {
      const messages = [
        "> Initializing login sequence...",
        "> Verifying credentials...",
        "> Establishing secure connection...",
        "> Access granted! Welcome back.",
      ];
      let currentMessage = 0;
      const interval = setInterval(() => {
        setMessage(messages[currentMessage]);
        currentMessage++;
        if (currentMessage >= messages.length) {
          clearInterval(interval);
          setTimeout(() => {
            setMessage("Login successful! Redirecting...");
            resolve();
          }, 1000);
        }
      }, 800);
    });
  };

  // 🎨 Three.js background effect for Terminal tab
  useEffect(() => {
    if (activeTab === "terminal" && terminalRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        terminalRef.current.clientWidth / terminalRef.current.clientHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(
        terminalRef.current.clientWidth,
        terminalRef.current.clientHeight
      );
      renderer.setClearColor(0x000000, 0);
      terminalRef.current.innerHTML = "";
      terminalRef.current.appendChild(renderer.domElement);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = terminalRef.current.clientWidth;
      canvas.height = terminalRef.current.clientHeight;

      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.3,
      });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      camera.position.z = 5;

      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        texture.needsUpdate = true;
        renderer.render(scene, camera);
      };

      animate();
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        renderer.dispose();
      };
    }
  }, [activeTab]);

  return (
    <div className="exam-login-container">
      <div className="exam-paper">
        {/* Header */}
        <div className="exam-header">
          <h1>Secure Login Portal</h1>
          <div className="barcode"></div>
        </div>

        {/* Tabs */}
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === "terminal" ? "active" : ""}`}
            onClick={() => setActiveTab("terminal")}
          >
            TERMINAL LOGIN
          </button>
          <button
            className={`tab-button ${activeTab === "google" ? "active" : ""}`}
            onClick={() => setActiveTab("google")}
          >
            GOOGLE AUTH
          </button>
        </div>

        {/* Animation Area */}
        <div className="animation-canvas">
          {activeTab === "terminal" ? (
            <div className="terminal-display">
              <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  color: "#00ff00",
                  fontFamily: "Courier New, monospace",
                  fontSize: "12px",
                  zIndex: 1,
                }}
              >
                {message && `> ${message}`}
                {isLoading && <span className="cursor">_</span>}
              </div>
            </div>
          ) : (
            <div className="google-auth-display">
              <div ref={googleAuthRef} style={{ width: "100%", height: "100%" }} />
              <div className="google-label">GOOGLE AUTHENTICATION PROTOCOL</div>
            </div>
          )}
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleLogin}>
          {activeTab === "terminal" ? (
            <>
              <div className="form-group">
                <label htmlFor="username">USERNAME:</label>
                <input
                  type="text"
                  id="username"
                  className="exam-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">PASSWORD:</label>
                <input
                  type="password"
                  id="password"
                  className="exam-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "PROCESSING..." : "AUTHENTICATE"}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="submit-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Login with Google"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
