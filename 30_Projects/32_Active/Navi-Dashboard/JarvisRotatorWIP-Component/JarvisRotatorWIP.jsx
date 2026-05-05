import React, { useState, useEffect, useRef } from 'react';
import './JarvisRotatorWIP.css';

/**
 * JarvisRotatorWIP - High-precision mechanical core
 * Based on legion739's WIP version with specific mechanical offsets.
 */
const JarvisRotatorWIP = ({ size = 600 }) => {
  const [rotation, setRotation] = useState(0);
  const requestRef = useRef();

  const animate = (time) => {
    // Smooth independent rotation base (scaled for 60fps)
    setRotation(prev => (prev + 0.5) % 360);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="rotator-wip-container" style={{ width: size, height: size }}>
       {/* Reference: JSP (Angle=10), JCE (Angle=10), JOC (Angle=-5), JCC (Angle=-10) */}
       
       <div className="wip-layer layer-joc" style={{ transform: `rotate(${-rotation * 0.5}deg)` }} />
       <div className="wip-layer layer-jsp" style={{ transform: `rotate(${rotation * 1}deg)` }} />
       <div className="wip-layer layer-jce" style={{ transform: `rotate(${rotation * 1}deg)` }} />
       <div className="wip-layer layer-jcc" style={{ transform: `rotate(${-rotation * 1}deg)` }} />
       
       <div className="wip-central-orb" />
    </div>
  );
};

export default JarvisRotatorWIP;
