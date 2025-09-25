import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About ThinkSpira</h1>
        <p>Your AI-powered academic and career companion for B.Tech students.</p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            To reduce academic overload and career confusion by providing a personalized, 
            AI-driven platform that integrates academic planning with real-time career guidance.
          </p>
        </div>

        <div className="about-card">
          <h2>What We Do</h2>
          <ul>
            <li>Automatically sync with Google Classroom & Calendar</li>
            <li>Provide AI-powered mentorship via IBM Granite LLM</li>
            <li>Deliver curated career insights and domain-specific updates</li>
            <li>Map your curriculum to personalized career roadmaps</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>Our Technology</h2>
          <div className="tech-stack">
            <span>React.js</span>
            <span>Node.js</span>
            <span>MongoDB</span>
            <span>IBM Granite LLM</span>
            <span>Google APIs</span>
            <span>Perplexity Pro API</span>
          </div>
        </div>

        <div className="about-card">
          <h2>Meet the Team</h2>
          <p>Knights of Nexus — A dedicated group of developers and innovators passionate about education technology.</p>
        </div>
      </section>
    </div>
  );
};

export default About;