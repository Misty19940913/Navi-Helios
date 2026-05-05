import React, { useState } from 'react';

/**
 * JarvisUSB Component
 * Based on Rainmeter [Iron_Man_HUD] USB by SH Lee
 */

interface USBDriveProps {
  id: number;
  letter: string;
  angle: number;
  pos: { x: number; y: number };
  usedPercent: number;
  label: string;
  totalSize: string;
  offsets: {
    name: { x: number; y: number };
    free: { x: number; y: number };
    post: { x: number; y: number };
    lbl: { x: number; y: number };
    bar: { x: number; y: number };
  }
}

const USBDrive: React.FC<USBDriveProps> = ({ id, letter, angle, pos, usedPercent, label, totalSize, offsets }) => {
  // 1. Base Positions
  const btnX = pos.x;
  const btnY = pos.y;

  // 2. Component Positions using explicit offsets
  const barX = btnX + offsets.bar.x;
  const barY = btnY + offsets.bar.y;

  const nameX = barX + offsets.name.x;
  const nameY = barY + offsets.name.y;
  const nameAngle = angle - 4;

  const freeX = nameX + offsets.free.x;
  const freeY = nameY + offsets.free.y;

  const postX = freeX + offsets.post.x;
  const postY = freeY + offsets.post.y;

  const lblX = postX + offsets.lbl.x;
  const lblY = postY + offsets.lbl.y;

  return (
    <>
      {/* Background (diskbg.png) */}
      <img
        src="/Skins/Iron_Man_Mark_7/USB_Disk/diskbg.png"
        style={{
          position: 'absolute',
          left: `${btnX}px`,
          top: `${btnY}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'top left'
        }}
        alt=""
      />

      {/* Bar (diskbar.png) */}
      <div style={{
        position: 'absolute',
        left: `${barX}px`,
        top: `${barY}px`,
        width: '29px',
        height: '8px',
        overflow: 'hidden',
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'top left',
        backgroundColor: 'rgba(255,130,0,0.2)'
      }}>
        <img
          src="/Skins/Iron_Man_Mark_7/USB_Disk/diskbar.png"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${usedPercent}%`,
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'left'
          }}
          alt=""
        />
      </div>

      {/* Name Text */}
      <div style={{
        position: 'absolute',
        left: `${nameX}px`,
        top: `${nameY}px`,
        color: '#FFF',
        fontSize: '7px',
        fontFamily: 'Arial',
        transform: `rotate(${nameAngle}deg)`,
        transformOrigin: 'top left',
        whiteSpace: 'nowrap'
      }}>
        {label} ({letter}) : {totalSize}B
      </div>

      {/* Free Space Percentage */}
      <div style={{
        position: 'absolute',
        left: `${freeX}px`,
        top: `${freeY}px`,
        color: '#B90000',
        fontSize: '11px',
        fontFamily: '"Arial Black"',
        transform: `rotate(${angle}deg) translateX(-100%)`,
        transformOrigin: 'top left'
      }}>
        {100 - usedPercent}
      </div>

      {/* % Postfix */}
      <div style={{
        position: 'absolute',
        left: `${postX}px`,
        top: `${postY}px`,
        color: '#B90000',
        fontSize: '7px',
        fontFamily: 'Arial',
        transform: `rotate(${angle}deg) translateX(-100%)`,
        transformOrigin: 'top left'
      }}>
        %
      </div>

      {/* Drive Label */}
      <div style={{
        position: 'absolute',
        left: `${lblX}px`,
        top: `${lblY}px`,
        color: '#B90000',
        fontSize: '5px',
        fontFamily: 'Arial',
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'top left'
      }}>
        {label.toUpperCase()}
      </div>
    </>
  );
};

const JarvisUSB: React.FC = () => {
  const [ironState, setIronState] = useState(0);

  const drives = [
    {
      id: 1, letter: 'E:', angle: 25, pos: { x: 250, y: 304 }, usedPercent: 45, label: '', totalSize: '16.2G',
      offsets: {
        bar: { x: 6, y: 8 },
        name: { x: 6, y: -18 },
        free: { x: 62, y: 29 },
        post: { x: 6, y: 5 },
        lbl: { x: -6, y: -9 },
      }
    },
    {
      id: 2, letter: 'F:', angle: 33, pos: { x: 237, y: 326 }, usedPercent: 78, label: '', totalSize: '32.0G',
      offsets: {
        bar: { x: 4, y: 9 },
        name: { x: 10, y: -17 },
        free: { x: 57, y: 37 },
        post: { x: 5, y: 6 },
        lbl: { x: -5, y: -10 },
      }
    },
    {
      id: 3, letter: 'G:', angle: 40, pos: { x: 223, y: 349 }, usedPercent: 12, label: '', totalSize: '128.0G',
      offsets: {
        bar: { x: 3, y: 8 },
        name: { x: 10, y: -16 },
        free: { x: 53, y: 44 },
        post: { x: 4, y: 8 },
        lbl: { x: -4, y: -10 },
      }
    },
  ];

  return (
    <div style={{
      position: 'relative',
      width: '358px',
      height: '505px',
      overflow: 'hidden'
    }}>
      {/* Background */}
      <img src="/Skins/Iron_Man_Mark_7/USB_Disk/usbbg.png" alt="" style={{ position: 'absolute', inset: 0 }} />

      {/* Centerpiece Image */}
      <img
        src={`/Skins/Iron_Man_Mark_7/USB_Disk/USB${ironState}.png`}
        onClick={() => setIronState(prev => (prev === 0 ? 1 : 0))}
        style={{
          position: 'absolute',
          left: '177px',
          top: '290px',
          cursor: 'pointer'
        }}
        alt=""
      />

      {/* Drive Meters */}
      {drives.map(d => (
        <USBDrive key={d.id} {...d} />
      ))}
    </div>
  );
};

export default JarvisUSB;
