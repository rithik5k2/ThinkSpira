import React, { useState } from "react";
import { motion } from "framer-motion";
import "./AlumniSpace.css";

const AlumniSpace = () => {
  const alumniProfiles = [
    {
      id: 1,
      name: "Ravi Kumar",
      interests: ["AI", "Startups"],
      bio: "AI Engineer @Google",
    },
    {
      id: 2,
      name: "Priya Sharma",
      interests: ["Data Science", "Research"],
      bio: "PhD @MIT",
    },
    {
      id: 3,
      name: "Aman Verma",
      interests: ["Finance", "Entrepreneurship"],
      bio: "Founder @FinStart",
    },
  ];

  const [sessions, setSessions] = useState([
    { id: 1, title: "AI in Industry", date: "2025-10-02", by: "Ravi Kumar" },
  ]);
  const [interactions, setInteractions] = useState([
    {
      id: 1,
      user: "Priya Sharma",
      content: "Excited to host a session on Data Science soon!",
    },
  ]);
  const [newSession, setNewSession] = useState({ title: "", date: "" });
  const [newPost, setNewPost] = useState("");

  const handleAddSession = () => {
    if (!newSession.title || !newSession.date) return;
    setSessions([
      ...sessions,
      {
        id: Date.now(),
        title: newSession.title,
        date: newSession.date,
        by: "You",
      },
    ]);
    setNewSession({ title: "", date: "" });
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    setInteractions([
      ...interactions,
      { id: Date.now(), user: "You", content: newPost },
    ]);
    setNewPost("");
  };

  return (
    <div className="alumni-pro-container">
      <motion.h1
        className="page-title"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🎓 Alumni Interaction Space
      </motion.h1>

      <div className="grid-layout">
        {/* Alumni Profiles */}
        <motion.section
          className="glass-card"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>🌟 Alumni Profiles</h2>
          <div className="alumni-list">
            {alumniProfiles.map((alum) => (
              <motion.div
                key={alum.id}
                className="alumni-card"
                whileHover={{ scale: 1.05, rotateY: 6 }}
              >
                <h3>{alum.name}</h3>
                <p>{alum.bio}</p>
                <span>Interests: {alum.interests.join(", ")}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Sessions */}
        <motion.section
          className="glass-card"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>📅 Upcoming Sessions</h2>
          <ul className="session-list">
            {sessions.map((s) => (
              <li key={s.id}>
                <strong>{s.title}</strong> — {s.date} (by {s.by})
              </li>
            ))}
          </ul>

          <div className="session-form">
            <input
              type="text"
              placeholder="Session Title"
              value={newSession.title}
              onChange={(e) =>
                setNewSession({ ...newSession, title: e.target.value })
              }
            />
            <input
              type="date"
              value={newSession.date}
              onChange={(e) =>
                setNewSession({ ...newSession, date: e.target.value })
              }
            />
            <button onClick={handleAddSession}>➕ Add Session</button>
          </div>
        </motion.section>

        {/* Interaction Board */}
        <motion.section
          className="glass-card"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>💬 Discussion Board</h2>
          <div className="interaction-list">
            {interactions.map((i) => (
              <motion.div
                key={i.id}
                className="interaction-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong>{i.user}:</strong>
                <p>{i.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="interaction-form">
            <textarea
              placeholder="Write something..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button onClick={handleAddPost}>🚀 Post</button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AlumniSpace;
