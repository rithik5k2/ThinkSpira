// Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); // ✅ useNavigate at the top level

  const features = [
    {
      icon: 'fas fa-robot',
      title: 'Agentic AI Assistant',
      description: 'Get personalized learning support from our advanced AI chatbot that understands your unique needs and learning style.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: 'fas fa-newspaper',
      title: 'Trending News Feed',
      description: 'Stay updated with the latest educational trends, research, and industry developments in your field of study.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: 'fas fa-comments',
      title: 'Alumni Chat Space',
      description: 'Connect with seniors and alumni for mentorship, career advice, and insights from those who\'ve walked your path.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: 'fas fa-users',
      title: 'Interest-Based Groups',
      description: 'Join communities of learners with similar interests to collaborate, share knowledge, and grow together.',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const goals = [
    {
      icon: 'fas fa-graduation-cap',
      title: 'Democratize Quality Education',
      description: 'Make high-quality learning accessible to everyone, regardless of location or economic background.'
    },
    {
      icon: 'fas fa-brain',
      title: 'Personalize Learning Paths',
      description: 'Use AI to create customized learning experiences that adapt to each student\'s pace and goals.'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Foster Meaningful Connections',
      description: 'Build bridges between students, educators, and professionals to create supportive learning communities.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Bridge the Skills Gap',
      description: 'Prepare students for future careers by focusing on practical, in-demand skills alongside theoretical knowledge.'
    }
  ];

  // Auto-slide features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000); // smoother transition speed

    return () => clearInterval(interval);
  }, [features.length]);

  // ✅ Fixed getStarted
  const getStarted = () => {
    navigate("/login");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background-animation"></div>
        <div className="hero-content">
          <h1 className="hero-title">EduTech Connect</h1>
          <p className="hero-subtitle">Revolutionizing education through AI-powered learning and community collaboration</p>
          <div className="hero-buttons">
            <button className="btn-primary pulse" onClick={getStarted}>Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className={`section-title ${isVisible ? 'fade-in-up' : ''}`}>Our Platform Features</h2>
          
          {/* Feature Tabs */}
          <div className="feature-tabs">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`feature-tab ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
                style={{ background: activeFeature === index ? feature.gradient : 'transparent' }}
              >
                <i className={feature.icon}></i>
                <span>{feature.title}</span>
              </button>
            ))}
          </div>

          {/* Feature Content */}
          <div className="feature-content-wrapper">
            <div 
              className="feature-content"
              style={{ transform: `translateX(-${activeFeature * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div key={index} className="feature-slide" style={{ background: feature.gradient }}>
                  <div className="feature-slide-content">
                    <div className="feature-icon-large">
                      <i className={feature.icon}></i>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <button className="btn-outline">Learn More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Dots */}
          <div className="feature-dots">
            {features.map((_, index) => (
              <button
                key={index}
                className={`feature-dot ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="goals">
        <div className="goals-background-animation"></div>
        <div className="container">
          <h2 className={`section-title ${isVisible ? 'fade-in-up' : ''}`}>Our Educational Goals</h2>
          <div className="goals-grid">
            {goals.map((goal, index) => (
              <div 
                key={index} 
                className={`goal-card ${isVisible ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="goal-icon-wrapper">
                  <div className="goal-icon">
                    <i className={goal.icon}></i>
                  </div>
                </div>
                <h3>{goal.title}</h3>
                <p>{goal.description}</p>
                <div className="goal-wave"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-background-animation"></div>
        <div className="container">
          <h2 className="cta-title">Ready to Transform Your Learning Journey?</h2>
          <p className="cta-subtitle">Join thousands of students advancing their education with our innovative platform.</p>
          <button className="btn-primary glow">Sign Up Free</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
