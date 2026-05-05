import React, { useState, useEffect } from 'react';
import './JarvisSphere.css';

/**
 * JarvisSphere - The Central Arc Reactor
 * Based on Sphere/sphere.ini from the Ultimate suite.
 */
const JarvisSphere = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    // Rainmeter Update=20, Formula=Counter % 20
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 20);
    }, 50); // Approximately 20fps for the core animation
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="jarvis-sphere-container">
      {/* 1. Sphere Background */}
      <img 
        src="assets/Sphere/sphere background.png" 
        className="sphere-bg" 
        alt="Core Background" 
      />

      {/* 2. Animated Core (Bitmap Meter) */}
      <div 
        className="sphere-core-animated"
        style={{
          backgroundImage: `url('assets/Sphere/small sphere.png')`,
          backgroundPosition: `-${frame * 48}px 0px`
        }}
      />

      {/* 3. Overlay Overlay */}
      <img 
        src="assets/Sphere/overlay.png" 
        className="sphere-overlay" 
        alt="Core Overlay" 
      />

      {/* 4. Rotating Effect (Enhancement) */}
      <div className="sphere-glow-pulse" />
    </div>
  );
};

export default JarvisSphere;
