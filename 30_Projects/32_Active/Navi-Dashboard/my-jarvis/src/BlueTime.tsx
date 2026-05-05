import React, { useState, useEffect } from 'react';
import JarvisTuanSliders from './JarvisTuanSliders';

/**
 * JARVIS Blue Time Widget Configuration
 * All coordinates strictly follow the original Time.ini from SH Lee.
 */
interface BlueTimeConfig {
  canvas: { width: number; height: number };
  center: { x: number; y: number };
  pivot: { x: number; y: number };
  textPos: {
    hour: { x: number; y: number; angle: number };
    separator: { x: number; y: number; angle: number };
    minute: { x: number; y: number; angle: number };
  };
}

const BLUE_TIME_LAYOUT: BlueTimeConfig = {
  canvas: { width: 720, height: 505 },
  center: { x: 429, y: 231 }, // TimeStyle X, Y
  pivot: { x: 92, y: 92 },    // TimeStyle OffsetX, OffsetY
  textPos: {
    hour: { x: 300, y: 62, angle: -36 },
    separator: { x: 325, y: 43, angle: -27 }, // Calculated from 25r, -19r
    minute: { x: 337, y: 40, angle: -23 }    // Calculated from 12r, -3r
  }
};

const BlueTime: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [aniTick, setAniTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      // Simulating MeasureAni = Time * 10
      setAniTick(Date.now() / 100);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const ms = time.getMilliseconds();

  // Rotation Calculations
  const hourRot = (((h % 12) * 3600 + m * 60 + s) / 43200) * 360;
  const minRot = ((m * 60 + s) / 3600) * 360;
  const secRot = ((s + ms / 1000) / 60) * 360;

  const outerRot = (aniTick % 240) / 240 * 360;
  const innerRot = -(aniTick % 390) / 390 * 360;

  const assetBase = "/Skins/Blue/Time";

  // ─────────────────────────────────────────────────
  // Rainmeter Rotator Rule:
  //   X, Y   = rotation center on the canvas
  //   OffsetX/Y = distance from image top-left to pivot
  //   ∴ image top-left = (X - OffsetX, Y - OffsetY)
  //                    = (429 - 92, 231 - 92)
  //                    = (337, 139)
  // ─────────────────────────────────────────────────
  const imgLeft = BLUE_TIME_LAYOUT.center.x - BLUE_TIME_LAYOUT.pivot.x; // 337
  const imgTop  = BLUE_TIME_LAYOUT.center.y - BLUE_TIME_LAYOUT.pivot.y; // 139

  const rotatorStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${imgLeft}px`,  // 337 — image top-left, NOT the center
    top:  `${imgTop}px`,   // 139 — image top-left, NOT the center
    width: '183px',
    height: '183px',
    transformOrigin: `${BLUE_TIME_LAYOUT.pivot.x}px ${BLUE_TIME_LAYOUT.pivot.y}px`, // pivot at (92, 92) within the image
    pointerEvents: 'none',
  };

  const textBaseStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: '"Arial Black", sans-serif',
    color: '#FFFFFF',
    fontSize: '13px',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transformOrigin: 'top left',
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: `${BLUE_TIME_LAYOUT.canvas.width}px`, 
      height: `${BLUE_TIME_LAYOUT.canvas.height}px`,
      overflow: 'hidden'
    }}>
      {/* --- Deconstructed Background Layers --- */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* Layer 0: Static Outer Base (Scales & Ticks) */}
        <img src={`${assetBase}/bg_outer.png`} alt="" style={{ position: 'absolute' }} />
        
        {/* Layer 1: Mid Ring (Counter-Clockwise Rotation) */}
        <img src={`${assetBase}/bg_mid.png`} alt="" style={{ 
          position: 'absolute',
          animation: 'tuan-rotate-cw 40s linear infinite', 
          transformOrigin: '431.17px 230.11px'
        }} />

        {/* Layer 2: Inner Ring (Clockwise Rotation) */}
        <img src={`${assetBase}/bg_inner.png`} alt="" style={{ 
          position: 'absolute',
          animation: 'tuan-rotate-ccw 25s linear infinite',
          transformOrigin: '431.17px 230.11px'
        }} />

        {/* Layer 3: Central Core (Static or Very Slow) */}
        <img src={`${assetBase}/bg_core.png`} alt="" style={{ 
          position: 'absolute',
          opacity: 0.8
        }} />
      </div>

      {/* Animated Curved Sliders Overlay */}
      <div style={{ position: 'absolute', left: '129px', top: '-69px', pointerEvents: 'none' }}>
        <JarvisTuanSliders />
      </div>

      {/* Clock Text */}
      <div style={{ ...textBaseStyle, left: BLUE_TIME_LAYOUT.textPos.hour.x, top: BLUE_TIME_LAYOUT.textPos.hour.y, transform: `rotate(${BLUE_TIME_LAYOUT.textPos.hour.angle}deg)` }}>
        {String(h).padStart(2, '0')}
      </div>
      <div style={{ ...textBaseStyle, left: BLUE_TIME_LAYOUT.textPos.separator.x, top: BLUE_TIME_LAYOUT.textPos.separator.y, transform: `rotate(${BLUE_TIME_LAYOUT.textPos.separator.angle}deg)` }}>
        :
      </div>
      <div style={{ ...textBaseStyle, left: BLUE_TIME_LAYOUT.textPos.minute.x, top: BLUE_TIME_LAYOUT.textPos.minute.y, transform: `rotate(${BLUE_TIME_LAYOUT.textPos.minute.angle}deg)` }}>
        {String(m).padStart(2, '0')}
      </div>

      {/* Rotator Assets */}
      <img src={`${assetBase}/outring.png`} style={{ ...rotatorStyle, transform: `rotate(${outerRot}deg)` }} alt="" />
      <img src={`${assetBase}/inring.png`} style={{ ...rotatorStyle, transform: `rotate(${innerRot}deg)` }} alt="" />
      <img src={`${assetBase}/hour.png`} style={{ ...rotatorStyle, transform: `rotate(${hourRot}deg)` }} alt="" />
      <img src={`${assetBase}/min.png`} style={{ ...rotatorStyle, transform: `rotate(${minRot}deg)` }} alt="" />
      <img src={`${assetBase}/sec.png`} style={{ ...rotatorStyle, transform: `rotate(${secRot}deg)` }} alt="" />
    </div>
  );
};

export default BlueTime;
