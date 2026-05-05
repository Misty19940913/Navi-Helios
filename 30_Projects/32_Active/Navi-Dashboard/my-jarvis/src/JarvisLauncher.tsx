import React, { useState } from 'react';

/**
 * JarvisLauncher Component
 * Based on Rainmeter [Iron_Man_HUD] Launcher by SH Lee
 * Strictly following Launcher.ini coordinates.
 *
 * Coordinate resolution (all 'r' relative offsets expanded):
 *   Angle1=20, Angle2=11, Angle3=112
 *
 *   BT1: x=14,  y=136  rot = 20 - 11*1 =  9 deg
 *   BT2: x=54,  y=141  rot = 20 - 11*2 = -2 deg   (14+40, 136+5)
 *   BT3: x=84,  y=134  rot = 20 - 11*3 =-13 deg   (54+30, 141-7)
 *   BT4: x=113, y=121  rot = 20 - 11*4 =-24 deg   (84+29, 134-13)
 *   BT5: x=141, y=102  rot = 20 - 11*5 =-35 deg   (113+28,121-19) — Temp.png, no action
 *
 *   Label1: x=55,  y=148  angle = (112 - 11*1) * pi/180 = 101 deg
 *   Label2: x=87,  y=149  angle = (112 - 11*2) * pi/180 =  90 deg  (55+32, 148+1)
 *   Label3: x=117, y=142  angle = (112 - 11*3) * pi/180 =  79 deg  (87+30, 149-7)
 *   Label4: x=146, y=129  angle = (112 - 11*4) * pi/180 =  68 deg  (117+29,142-13)
 *
 *   DispName (hover name): x=33, y=208
 */

interface LauncherButton {
  id: number;
  name: string;
  file: string;
  img: string;          // 'BTNormal' | 'Temp'
  x: number;
  y: number;
  rotDeg: number;       // ImageRotate
  label: {
    x: number;
    y: number;
    angleDeg: number;   // converted from (Angle3 - Angle2*n) * pi/180 → to deg
    text: string;
  };
}

const LAUNCHER_CONFIG: LauncherButton[] = [
  {
    id: 1, name: 'My Documents', file: 'D:\\My Documents\\',
    img: 'BTNormal', x: 104, y: 79,
    rotDeg: 11,
    label: { x: 55, y: 148, angleDeg: 101, text: '01x' }
  },

  {
    id: 2, name: 'Google', file: 'https://www.google.com',
    img: 'BTNormal', x: 141, y: 82,
    rotDeg: -2,
    label: { x: 87, y: 149, angleDeg: 90, text: '02x' }
  },

  {
    id: 3, name: 'PhotoShop', file: 'Photoshop.exe',
    img: 'BTNormal', x: 177, y: 77,
    rotDeg: -13,
    label: { x: 117, y: 142, angleDeg: 79, text: '03x' }
  },

  {
    id: 4, name: 'Notepad', file: 'notepad.exe',
    img: 'BTNormal', x: 211, y: 65,
    rotDeg: -24,
    label: { x: 146, y: 129, angleDeg: 68, text: '04x' }
  },

  // BT5 uses Temp.png, no interaction defined in INI
  {
    id: 5, name: '', file: '',
    img: 'Temp', x: 243, y: 46,
    rotDeg: -35,
    label: { x: 0, y: 0, angleDeg: 0, text: '' }
  },
];

const CANVAS = { width: 360, height: 274 };

const JarvisLauncher: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [pressedId, setPressedId] = useState<number | null>(null);

  const getAsset = (btn: LauncherButton): string => {
    if (btn.img === 'Temp') return '/Skins/Iron_Man_Mark_7/Launcher/Temp.png';
    if (pressedId === btn.id) return '/Skins/Iron_Man_Mark_7/Launcher/BTRun.png';
    if (hoveredId === btn.id) return '/Skins/Iron_Man_Mark_7/Launcher/BTOver.png';
    return '/Skins/Iron_Man_Mark_7/Launcher/BTNormal.png';
  };

  return (
    <div style={{
      position: 'relative',
      width: `${CANVAS.width}px`,
      height: `${CANVAS.height}px`,
    }}>
      {/* Background */}
      <img
        src="/Skins/Iron_Man_Mark_7/Launcher/LauncherBG.png"
        alt=""
        style={{ position: 'absolute', left: 85, top: -60, pointerEvents: 'none' }}
      />

      {/* Buttons */}
      {LAUNCHER_CONFIG.map(btn => (
        <React.Fragment key={btn.id}>
          {/* Button image */}
          <img
            src={getAsset(btn)}
            alt={btn.name}
            style={{
              position: 'absolute',
              left: `${btn.x}px`,
              top: `${btn.y}px`,
              transform: `rotate(${btn.rotDeg}deg)`,
              transformOrigin: 'center',     // Rainmeter ImageRotate pivots at image center
              cursor: btn.img === 'Temp' ? 'default' : 'pointer',
              pointerEvents: btn.img === 'Temp' ? 'none' : 'auto',
            }}
            onMouseEnter={() => btn.img !== 'Temp' && setHoveredId(btn.id)}
            onMouseLeave={() => { setHoveredId(null); setPressedId(null); }}
            onMouseDown={() => btn.img !== 'Temp' && setPressedId(btn.id)}
            onMouseUp={() => setPressedId(null)}
          />

          {/* Label — shown only on hover (matches Hidden=1 + ShowMeter logic) */}
          {hoveredId === btn.id && btn.label.text && (
            <div style={{
              position: 'absolute',
              left: `${btn.label.x}px`,
              top: `${btn.label.y}px`,
              transform: `rotate(${btn.label.angleDeg}deg)`,
              transformOrigin: 'top left',
              fontFamily: '"Arial Black", sans-serif',
              fontSize: '13px',
              color: '#FFFFFF',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              {btn.label.text}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* DispName — hover name display at fixed position */}
      <div style={{
        position: 'absolute',
        left: '33px',
        top: '208px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: 'rgba(197, 239, 252, 1)',  // FontColor1
        pointerEvents: 'none',
        minHeight: '14px',
      }}>
        {hoveredId !== null
          ? LAUNCHER_CONFIG.find(b => b.id === hoveredId)?.name ?? ''
          : ''}
      </div>

      {/* ─── DEBUG OVERLAY ─────────────────────────────────── */}
      {/* ──────────────────────────────────────────────────── */}
    </div>
  );
};

export default JarvisLauncher;
