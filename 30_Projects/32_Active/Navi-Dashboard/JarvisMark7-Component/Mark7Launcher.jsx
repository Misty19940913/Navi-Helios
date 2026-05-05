import React, { useState } from 'react';
import './Mark7Launcher.css';

const JARVIS_MARK7_CONFIG = {
  launcher: [
    { id: 1, name: "My Documents", x: 14, y: 136, rot: 9, lx: 55, ly: 148, lrot: 101 },
    { id: 2, name: "Google", x: 54, y: 141, rot: -2, lx: 87, ly: 149, lrot: 90 },
    { id: 3, name: "PhotoShop", x: 84, y: 134, rot: -13, lx: 117, ly: 142, lrot: 79 },
    { id: 4, name: "Notepad", x: 113, y: 121, rot: -24, lx: 146, ly: 129, lrot: 68 }
  ]
};

const Mark7Launcher = () => {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <div className="mark7-launcher-container" style={{ position: 'relative', width: 360, height: 274 }}>
      <img src="assets/Launcher/LauncherBG.PNG" className="launcher-bg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      
      {JARVIS_MARK7_CONFIG.launcher.map(btn => {
        const isHovered = hoveredBtn?.id === btn.id;
        
        return (
          <div key={btn.id}>
            <img 
              src={`assets/Launcher/${isHovered ? 'BtOver' : 'BTNormal'}.png`}
              style={{ 
                position: 'absolute', 
                left: btn.x, 
                top: btn.y, 
                transform: `rotate(${btn.rot}deg)`, 
                transformOrigin: 'center', 
                cursor: 'pointer' 
              }}
              onMouseEnter={() => setHoveredBtn(btn)}
              onMouseLeave={() => setHoveredBtn(null)}
              alt={btn.name}
            />
            {/* The 01x, 02x labels strictly matching INI angles */}
            <div 
              style={{ 
                position: 'absolute', 
                left: btn.lx, 
                top: btn.ly, 
                color: isHovered ? '#fff' : 'transparent',
                transform: `rotate(${btn.lrot}deg)`, 
                transformOrigin: 'top left',
                fontFamily: '"Arial Black", sans-serif', 
                fontSize: 13, 
                pointerEvents: 'none', 
                transition: 'color 0.1s' 
              }}
            >
              0{btn.id}x
            </div>
          </div>
        );
      })}

      {/* Display name matching INI DispName position */}
      <div 
        className="launcher-display-name"
        style={{ 
          position: 'absolute', 
          left: 33, 
          top: 208, 
          color: '#c5effc', 
          fontSize: 10, 
          fontFamily: 'Arial, sans-serif' 
        }}
      >
        {hoveredBtn ? hoveredBtn.name : ""}
      </div>
    </div>
  );
};

export default Mark7Launcher;
