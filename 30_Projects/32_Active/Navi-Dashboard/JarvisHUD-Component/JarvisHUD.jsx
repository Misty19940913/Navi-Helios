import React, { useState, useEffect, useMemo } from 'react';
import { JARVIS_LAYOUT_CONFIG } from './layoutConfig';
import './JarvisHUD.css';

/**
 * Enhanced JarvisHUD Component
 * Data-driven rendering based on layoutConfig.ts (migrated from Rainmeter)
 */
const JarvisHUD = ({ size = 800 }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  const { metadata, meters } = JARVIS_LAYOUT_CONFIG;

  // Calculate rotation for a given meter based on current time
  const getRotation = (meter) => {
    if (meter.isDecorative) return null; // Handled by CSS animations

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();
    const ms = time.getMilliseconds();

    let totalSeconds = 0;
    if (meter.name === "MeterSecond") totalSeconds = seconds + ms / 1000;
    else if (meter.name === "MeterMinute") totalSeconds = minutes * 60 + seconds;
    else if (meter.name === "MeterHour") totalSeconds = (hours % 12) * 3600 + minutes * 60 + seconds;

    if (totalSeconds === 0) return 0;

    // rotation = (totalUnits / maxUnits) * totalRotationAngle
    const angle = (totalSeconds / meter.valueReminder) * (meter.rotationAngle * (180 / Math.PI));
    return angle;
  };

  return (
    <div 
      className="jarvis-hud-container" 
      style={{ 
        width: size, 
        height: (size * 700) / 1000, // Maintain aspect ratio from viewBox
        '--hud-scale': size / 1000 
      }}
    >
      <svg 
        viewBox={metadata.viewBox} 
        className="hud-canvas"
        xmlns="http://www.w3.org/2000/svg"
      >
        {meters.map(m => {
            const isRot = m.type === 'ROTATOR';
            if (m.type === 'IMAGE' || isRot) {
              const rot = getRotation(m);
              const rotationalTransform = isRot && !m.isDecorative ? `rotate(${rot}deg)` : 'initial';
              const isBg = m.name === "Background";

              return (
                <image 
                  key={m.name} 
                  href={m.imageName} 
                  x={m.x} y={m.y} 
                  width={isBg ? 720 : 184}
                  height={isBg ? 505 : 184}
                  className={isBg ? "" : `hud-meter ${m.isDecorative ? (m.name.includes('Outter') ? 'animate-rotate-cw' : 'animate-rotate-ccw') : ''}`}
                  style={isBg ? {} : { transform: rotationalTransform }}
                />
              );
            }

          if (m.type === 'STRING') {
            const value = m.measureName === 'hours' 
              ? time.getHours().toString().padStart(2, '0')
              : m.measureName === 'minutes'
                ? time.getMinutes().toString().padStart(2, '0')
                : m.text;

            return (
              <text
                key={m.name}
                x={m.x}
                y={m.y}
                fill={m.style.color}
                fontSize={m.style.fontSize}
                transform={`rotate(${m.angle * (180 / Math.PI)}, ${m.x}, ${m.y})`}
                className="hud-text"
              >
                {value}
              </text>
            );
          }

          return null;
        })}
      </svg>
      
      {/* High-end Overlay for Premium feel */}
      <div className="hud-vignette" />
      <div className="hud-scanline" />
    </div>
  );
};

export default JarvisHUD;
