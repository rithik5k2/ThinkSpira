// Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

// Simple Bot Model UI
function BotModel({ isTyping }) {
  return (
    <div className="bot-model">
      <div className="bot-head"></div>
      <div className="bot-body"></div>
      <div className="bot-eyes">
        <div className="eye left-eye"></div>
        <div className="eye right-eye"></div>
      </div>
      {isTyping && <div className="typing-3d">Typing...</div>}
    </div>
  );
}

// Message Component
function Message({ message, isUser }) {
  return (
    <div className={`message ${isUser ? "user" : "bot"}`}>
      <div className="message-content">
        <div className="avatar">{isUser ? "U" : "B"}</div>
        <div className="text">{message}</div>
      </div>
    </div>
  );
}

// Main Chatbot
function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message, isUser) => {
    setMessages((prev) => [...prev, { text: message, isUser }]);
  };

const handleSend = async () => {
  if (!inputValue.trim()) return;

  const userMessage = inputValue;
  addMessage(userMessage, true);
  setInputValue("");
  setIsTyping(true);

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    let botMessage = "";
    try {
      // 🟢 Granite returns JSON string inside code fences
      let content = data?.choices?.[0]?.message?.content || "";

      // remove ```json ... ``` wrapper if present
      content = content.replace(/```json|```/g, "").trim();

      // parse into object
      const parsed = JSON.parse(content);

      // ✅ assistant message
      botMessage = parsed.assistant_message || "⚠️ No assistant message found.";

      // 👉 Handle dbquery actions
      if (parsed.dbquery === "add" && parsed.DATES) {
        console.log("🟢 DB ADD detected:", parsed.DATES);
        Object.values(parsed.DATES).flat().forEach(async (task) => {
          console.log("➡️ Adding task:", task);
          const resp = await fetch("http://localhost:5000/api/users/:googleId/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: task.title,
              date: task.planned_date_utc,
            }),
          });
          console.log("✅ Add response:", await resp.json().catch(() => resp.status));
        });
      }

      if (parsed.dbquery === "delete" && parsed.DATES) {
        console.log("🟠 DB DELETE detected:", parsed.DATES);
        Object.values(parsed.DATES).flat().forEach(async (task) => {
          console.log("➡️ Deleting task with ID:", task._id);
          const resp = await fetch(
            "http://localhost:5000/api/users/:id/events/" + task._id,
            { method: "DELETE" }
          );
          console.log("✅ Delete response:", await resp.json().catch(() => resp.status));
        });
      }
    } catch (err) {
      console.error("❌ Parse error:", err);
      botMessage = "⚠️ Error parsing model response.";
    }

    addMessage(botMessage, false);
  } catch (err) {
    addMessage("⚠️ Error: " + err.message, false);
  } finally {
    setIsTyping(false);
  }
};

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Student Assistant Bot</h1>
          <p>Your AI companion for academic success</p>
          <div className="status">
            <div className="status-dot"></div>
            <span>Online</span>
          </div>
        </div>

        <div className="content-area">
          <div className="messages-container">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  message={message.text}
                  isUser={message.isUser}
                />
              ))}

              {isTyping && (
                <div className="typing-indicator">
                  <div className="avatar">B</div>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message here..."
              />
              <button onClick={handleSend}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <div className="bot-container">
            <BotModel isTyping={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
