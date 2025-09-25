import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

const Register = () => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const terminalRef = useRef(null);
  const punchCardRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);

  // Three.js Scene for Terminal Registration
  useEffect(() => {
    if (activeTab === 'terminal' && terminalRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, terminalRef.current.clientWidth / terminalRef.current.clientHeight, 0.1, 1000);
      
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(terminalRef.current.clientWidth, terminalRef.current.clientHeight);
      renderer.setClearColor(0x000000, 0);
      terminalRef.current.innerHTML = '';
      terminalRef.current.appendChild(renderer.domElement);

      // Create matrix-style registration animation
      const characters = '01USERNAMEEMAILPASSWORDREGISTERABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const raindrops = [];
      const fontSize = 14;
      const columns = Math.floor(terminalRef.current.clientWidth / fontSize);

      for (let i = 0; i < columns; i++) {
        const raindrop = {
          x: i * fontSize,
          y: Math.random() * -terminalRef.current.clientHeight,
          speed: 2 + Math.random() * 5,
          characters: [],
          changeInterval: 5 + Math.floor(Math.random() * 20)
        };
        
        for (let j = 0; j < 15; j++) {
          raindrop.characters.push(characters[Math.floor(Math.random() * characters.length)]);
        }
        raindrops.push(raindrop);
      }

      // Create canvas for 2D matrix effect
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = terminalRef.current.clientWidth;
      canvas.height = terminalRef.current.clientHeight;
      
      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);
      const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        opacity: 0.3
      });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      camera.position.z = 5;

      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        // Clear canvas with fading effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw raindrops with registration-themed colors
        ctx.fillStyle = '#0ff'; // Cyan for registration theme
        ctx.font = `${fontSize}px monospace`;

        raindrops.forEach((drop, index) => {
          drop.y += drop.speed;
          if (drop.y > canvas.height) {
            drop.y = -20;
          }

          // Change characters occasionally
          if (animationRef.current % drop.changeInterval === 0) {
            drop.characters[0] = characters[Math.floor(Math.random() * characters.length)];
          }

          // Draw characters with gradient
          drop.characters.forEach((char, charIndex) => {
            const alpha = 1 - (charIndex / drop.characters.length);
            ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.fillText(char, drop.x, drop.y - charIndex * fontSize);
          });
        });

        texture.needsUpdate = true;
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    }
  }, [activeTab]);

  // Three.js Scene for Google-themed Punch Card
  useEffect(() => {
    if (activeTab === 'punchcard' && punchCardRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, punchCardRef.current.clientWidth / punchCardRef.current.clientHeight, 0.1, 1000);
      
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(punchCardRef.current.clientWidth, punchCardRef.current.clientHeight);
      renderer.setClearColor(0x1a1a1a, 0);
      punchCardRef.current.innerHTML = '';
      punchCardRef.current.appendChild(renderer.domElement);

      // Create Google-themed registration card (white background)
      const cardGeometry = new THREE.BoxGeometry(8, 5, 0.1);
      const cardMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      scene.add(card);

      // Create Google-colored holes (G-o-o-g-l-e colors)
      const googleColors = [0x4285F4, 0xDB4437, 0xF4B400, 0x4285F4, 0x0F9D58, 0xDB4437];
      const holes = [];
      const rows = 6;
      const cols = 10;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const holeGeometry = new THREE.CircleGeometry(0.15, 16);
          const holeMaterial = new THREE.MeshBasicMaterial({ 
            color: googleColors[j % googleColors.length],
            transparent: true,
            opacity: 0.4
          });
          const hole = new THREE.Mesh(holeGeometry, holeMaterial);
          hole.position.set(
            (j - cols/2) * 0.6,
            (rows/2 - i) * 0.6,
            0.06
          );
          holes.push(hole);
          scene.add(hole);
        }
      }

      // Add Google "G" logo in the center
      const gGeometry = new THREE.RingGeometry(0.8, 1, 32);
      const gMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4285F4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const gLogo = new THREE.Mesh(gGeometry, gMaterial);
      gLogo.rotation.x = Math.PI / 2;
      scene.add(gLogo);

      // Add "GOOGLE" text
      const textGeometry = new THREE.PlaneGeometry(3, 0.5);
      const textMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4285F4,
        transparent: true,
        map: createGoogleTextTexture()
      });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(0, -1.5, 0.06);
      scene.add(text);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      camera.position.z = 10;

      // Animation for Google punch card
      const animateHoles = () => {
        animationRef.current = requestAnimationFrame(animateHoles);

        // Animate holes in a wave pattern
        holes.forEach((hole, index) => {
          const time = Date.now() * 0.001;
          const row = Math.floor(index / cols);
          const col = index % cols;
          
          hole.position.z = 0.06 + Math.sin(time + row * 0.5 + col * 0.3) * 0.1;
          hole.material.opacity = 0.4 + Math.sin(time + index * 0.2) * 0.3;
        });

        // Rotate card and logo
        card.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        gLogo.rotation.z += 0.01;

        renderer.render(scene, camera);
      };

      animateHoles();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    }
  }, [activeTab]);

  // Utility function for creating Google text texture
  const createGoogleTextTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#4285F4';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GOOGLE REGISTRATION', 256, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setMessage('');

    await simulateTerminalRegistration();
    setIsLoading(false);
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setMessage('');
    await simulateGoogleRegistration();
    setIsLoading(false);
  };

  const simulateTerminalRegistration = () => {
    return new Promise((resolve) => {
      const messages = [
        '> Initializing registration sequence...',
        '> Validating user data...',
        '> Checking username availability...',
        '> Creating user account...',
        '> Registration complete!'
      ];
      
      let currentMessage = 0;
      const interval = setInterval(() => {
        setMessage(messages[currentMessage]);
        currentMessage++;
        
        if (currentMessage >= messages.length) {
          clearInterval(interval);
          setTimeout(() => {
            setMessage('✓ Registration successful! Welcome aboard.');
            resolve();
          }, 1000);
        }
      }, 800);
    });
  };

  const simulateGoogleRegistration = () => {
    return new Promise((resolve) => {
      const messages = [
        'Redirecting to Google...',
        'Authenticating with Google OAuth...',
        'Creating account with Google...',
        'Setting up your profile...',
        'Google registration complete!'
      ];
      
      let currentMessage = 0;
      const interval = setInterval(() => {
        setMessage(messages[currentMessage]);
        currentMessage++;
        
        if (currentMessage >= messages.length) {
          clearInterval(interval);
          setTimeout(() => {
            setMessage('✓ Google registration successful!');
            resolve();
          }, 1000);
        }
      }, 700);
    });
  };

  const clearForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setMessage('');
  };

  return (
    <div className="register-container">
      <style jsx>{`
        .register-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Courier New', monospace;
          position: relative;
          overflow: hidden;
        }

        .register-box {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #00ffff;
          border-radius: 10px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
          position: relative;
          z-index: 2;
        }

        .tab-buttons {
          display: flex;
          margin-bottom: 2rem;
          border-bottom: 1px solid #00ffff;
        }

        .tab-button {
          flex: 1;
          padding: 1rem;
          background: transparent;
          border: none;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-button.active {
          border-bottom: 2px solid #00ffff;
          background: rgba(0, 255, 255, 0.1);
        }

        .tab-button:hover {
          background: rgba(0, 255, 255, 0.1);
        }

        .animation-canvas {
          height: 200px;
          width: 100%;
          margin-bottom: 2rem;
          border: 1px solid #00ffff;
          position: relative;
          overflow: hidden;
        }

        .terminal-display {
          background: #000;
          color: #00ffff;
          padding: 1rem;
          height: 100%;
          font-family: 'Courier New', monospace;
          overflow: hidden;
          position: relative;
        }

        .punch-card-display {
          background: #ffffff;
          height: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          color: #00ffff;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        input {
          padding: 0.75rem;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid #00ffff;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          border-radius: 5px;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          background: rgba(0, 255, 255, 0.2);
        }

        input::placeholder {
          color: #00ffff;
          opacity: 0.6;
        }

        .password-strength {
          height: 4px;
          background: #333;
          border-radius: 2px;
          margin-top: 0.25rem;
          overflow: hidden;
        }

        .strength-bar {
          height: 100%;
          border-radius: 2px;
          transition: all 0.3s ease;
          width: 0%;
        }

        .strength-weak {
          background: #ff4444;
          width: 33%;
        }

        .strength-medium {
          background: #ffaa00;
          width: 66%;
        }

        .strength-strong {
          background: #00ff00;
          width: 100%;
        }

        .google-button {
          padding: 1rem;
          background: linear-gradient(45deg, #4285F4, #34A853);
          border: none;
          color: white;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 1rem;
        }

        .google-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(66, 133, 244, 0.4);
        }

        .control-buttons {
          display: flex;
          gap: 1rem;
          margin: 1rem 0;
        }

        .control-button {
          flex: 1;
          padding: 0.75rem;
          background: rgba(0, 255, 255, 0.2);
          border: 1px solid #00ffff;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-button:hover:not(:disabled) {
          background: rgba(0, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .register-button {
          padding: 1rem;
          background: linear-gradient(45deg, #00ffff, #00cccc);
          border: none;
          color: #000;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
        }

        .register-button:disabled, .google-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 5px;
          text-align: center;
          font-size: 0.9rem;
          min-height: 20px;
        }

        .message.success {
          background: rgba(0, 255, 255, 0.1);
          color: #00ffff;
          border: 1px solid #00ffff;
        }

        .message.error {
          background: rgba(255, 0, 0, 0.1);
          color: #ff4444;
          border: 1px solid #ff4444;
        }

        .form-title {
          text-align: center;
          color: #00ffff;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 3px;
        }

        .google-icon {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .punch-card-instruction {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .cursor {
          animation: blink 1s infinite;
          color: #00ffff;
        }
      `}</style>

      <div className="register-box">
        <div className="form-title">CREATE ACCOUNT</div>
        
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
          >
            TERMINAL REGISTER
          </button>
          <button 
            className={`tab-button ${activeTab === 'punchcard' ? 'active' : ''}`}
            onClick={() => setActiveTab('punchcard')}
          >
            GOOGLE REGISTER
          </button>
        </div>

        <div className="animation-canvas">
          {activeTab === 'terminal' ? (
            <div className="terminal-display">
              <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
              <div style={{ 
                position: 'absolute', 
                top: '10px', 
                left: '10px', 
                color: '#00ffff',
                fontFamily: 'Courier New, monospace',
                fontSize: '12px',
                zIndex: 1 
              }}>
                {message && `> ${message}`}
                {isLoading && <span className="cursor">_</span>}
              </div>
            </div>
          ) : (
            <div className="punch-card-display">
              <div ref={punchCardRef} style={{ width: '100%', height: '100%' }} />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                color: '#333',
                fontFamily: 'Courier New, monospace',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                GOOGLE REGISTRATION CARD
              </div>
            </div>
          )}
        </div>

        {activeTab === 'terminal' ? (
          <form className="register-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="username">USERNAME:</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter your username..."
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">EMAIL:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email..."
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">PASSWORD:</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password..."
                disabled={isLoading}
              />
              <div className="password-strength">
                <div className={`strength-bar ${
                  formData.password.length === 0 ? '' :
                  formData.password.length < 4 ? 'strength-weak' :
                  formData.password.length < 8 ? 'strength-medium' :
                  'strength-strong'
                }`} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">CONFIRM PASSWORD:</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password..."
                disabled={isLoading}
              />
            </div>

            <div className="control-buttons">
              <button 
                type="button"
                className="control-button"
                onClick={clearForm}
                disabled={isLoading}
              >
                CLEAR FORM
              </button>
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
            >
              {isLoading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        ) : (
          <div className="register-form">
            <button 
              onClick={handleGoogleRegister}
              className="google-button"
              disabled={isLoading}
            >
              <span className="google-icon">G</span>
              CONTINUE WITH GOOGLE
            </button>
            <div className="punch-card-instruction">
              Register quickly using your Google account
            </div>
          </div>
        )}

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;