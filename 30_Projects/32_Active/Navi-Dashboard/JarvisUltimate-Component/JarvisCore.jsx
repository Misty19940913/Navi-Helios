import React, { useState, useEffect } from 'react';
import JarvisSphere from './JarvisSphere';
import './JarvisCore.css';

/**
 * JarvisCore - The combined Arc Reactor with Rotating Rings
 * Combines Sphere/sphere.ini and RotatorX/rotator.ini
 */
const JarvisCore = ({ size = 600 }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Scale based on target size vs internal 340px base
  const scale = size / 340;

  return (
    <div className="jarvis-core-container" style={{ width: size, height: size }}>
      {/* 1. RotatorX Rings (Each with different speeds from INI) */}
      <div className="rotator-layer layer-joc" style={{ transform: `scale(${scale}) rotate(${-rotation * 0.5}deg)` }} />
      <div className="rotator-layer layer-jsp" style={{ transform: `scale(${scale}) rotate(${rotation * 0.5}deg)` }} />
      <div className="rotator-layer layer-jce" style={{ transform: `scale(${scale}) rotate(${-rotation * 1}deg)` }} />
      <div className="rotator-layer layer-jcc" style={{ transform: `scale(${scale}) rotate(${rotation * 1}deg)` }} />
      <div className="rotator-layer layer-rng" style={{ transform: `scale(${scale}) rotate(${rotation * 0.5}deg)` }} />
      <div className="rotator-layer layer-static-jarvis" style={{ transform: `scale(${scale})` }} />

      {/* 2. Central animating Sphere */}
      <div className="central-sphere-wrapper" style={{ transform: `translate(-50%, -50%) scale(${scale * 0.8})` }}>
        <JarvisSphere />
      </div>

      {/* 3. Global Glow */}
      <div className="core-global-glow" />
    </div>
  );
};

export default JarvisCore;
