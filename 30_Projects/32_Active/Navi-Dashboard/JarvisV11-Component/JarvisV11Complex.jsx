import React, { useState, useEffect, useRef } from 'react';
import './JarvisV11.css';

/**
 * JarvisV11Complex - High-fidelity animated HUD
 * Based on Version 1.1 suite (161-frame bitmaps)
 */
const JarvisV11Complex = ({ type = 'rotaters', size = 600 }) => {
  const [frame, setFrame] = useState(0);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Load the massive bitmap
    const img = new Image();
    img.src = `assets/${type}/${type}.png`;
    img.onload = () => {
      imageRef.current = img;
    };
  }, [type]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % 161);
    }, 50); // 20fps per Rainmeter Update=50
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const frameWidth = 600; // Found via identify
      const frameHeight = 600;
      
      ctx.clearRect(0, 0, frameWidth, frameHeight);
      ctx.drawImage(
        imageRef.current,
        frame * frameWidth, 0, frameWidth, frameHeight, // Source
        0, 0, frameWidth, frameHeight // Destination
      );
    }
  }, [frame]);

  return (
    <div className="jarvis-v11-wrapper" style={{ width: size, height: size }}>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={600} 
        className="v11-canvas"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="v11-glow-ring" />
    </div>
  );
};

export default JarvisV11Complex;
