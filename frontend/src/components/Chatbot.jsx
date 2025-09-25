// App.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// Simple 3D component without complex dependencies
function BotModel({ isTyping }) {
  return (
    <div className="bot-model">
      <div className="bot-head"></div>
      <div className="bot-body"></div>
      <div className="bot-eyes">
        <div className="eye left-eye"></div>
        <div className="eye right-eye"></div>
      </div>
      {isTyping && (
        <div className="typing-3d">Typing...</div>
      )}
      <div className="floating-particles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="particle" style={{
            animationDelay: `${i * 0.5}s`,
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`
          }}></div>
        ))}
      </div>
    </div>
  );
}

// Message Component
function Message({ message, isUser }) {
  return (
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      <div className="message-content">
        <div className="avatar">
          {isUser ? 'U' : 'B'}
        </div>
        <div className="text">
          {message}
        </div>
      </div>
    </div>
  );
}

// Quick Options Component
function QuickOptions({ options, onSelect }) {
  return (
    <div className="quick-options">
      {options.map((option, index) => (
        <button
          key={index}
          className="quick-option"
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// Main Chatbot Component
function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial bot message
  useEffect(() => {
    setTimeout(() => {
      addBotMessage("Hello! I'm your student assistant. How can I help you today?");
    }, 1000);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message, isUser) => {
    setMessages(prev => [...prev, { text: message, isUser }]);
  };

  const addBotMessage = (message) => {
    addMessage(message, false);
  };

  const addUserMessage = (message) => {
    addMessage(message, true);
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    
    addUserMessage(inputValue);
    setInputValue('');
    
    setIsTyping(true);
    
    // Simulate bot thinking
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(getBotResponse(inputValue));
    }, 1500);
  };

  const handleQuickOption = (option) => {
    addUserMessage(option);
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(getBotResponse(option));
    }, 1500);
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hi there! I'm here to help with your academic journey. What would you like to know?";
    } else if (lowerMessage.includes('course') || lowerMessage.includes('registration')) {
      return "Course registration typically opens two weeks before the semester begins. Make sure to check your academic requirements and consult with your advisor.";
    } else if (lowerMessage.includes('study') || lowerMessage.includes('tip')) {
      return "Effective study tips: create a schedule, use active recall, take regular breaks, and form study groups. What subject are you studying?";
    } else if (lowerMessage.includes('campus') || lowerMessage.includes('resource')) {
      return "The campus offers many resources: library, tutoring center, writing center, career services, and mental health support. Which one interests you?";
    } else if (lowerMessage.includes('assignment') || lowerMessage.includes('deadline')) {
      return "It's important to plan ahead for assignments. Break large projects into smaller tasks and set personal deadlines before the actual due date.";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "That's an interesting question! As a student assistant, I can help with course info, study tips, campus resources, and more. What specific area are you curious about?";
    }
  };

  const quickOptions = [
    "Course registration help",
    "Study tips for exams",
    "Campus resources",
    "Assignment deadlines",
    "Extracurricular activities"
  ];

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
              
              {messages.length > 0 && messages[messages.length - 1].isUser && !isTyping && (
                <QuickOptions 
                  options={quickOptions} 
                  onSelect={handleQuickOption} 
                />
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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