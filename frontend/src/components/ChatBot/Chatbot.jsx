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
    console.log("IBM Response:", data);

    let botMessage = "";

    // ✅ IBM Granite structure: choices[0].message.content
    if (data?.choices?.[0]?.message?.content) {
      try {
        // Parse content if it’s JSON
        const parsed = JSON.parse(data.choices[0].message.content);

        botMessage = (
          <div className="bot-json">
            <p><strong>{parsed.assistant_message}</strong></p>

            {parsed.explain && <p>💡 {parsed.explain}</p>}

            {parsed.DATES && (
              <div>
                <h4>📅 Planned Schedule:</h4>
                <ul>
                  {Object.entries(parsed.DATES).map(([date, tasks]) => (
                    <li key={date}>
                      <strong>{date}</strong>
                      <ul>
                        {tasks.map((t, i) => (
                          <li key={i}>
                            {t.title} — {t.description} (Deadline:{" "}
                            {new Date(t.original_deadline).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      } catch (err) {
        // If parsing fails, just show raw string
        botMessage = data.choices[0].message.content;
      }
    } else {
      // fallback if model returns plain text
      botMessage =
        data?.output?.text?.[0] ||
        data?.results?.[0]?.generated_text ||
        JSON.stringify(data, null, 2);
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
