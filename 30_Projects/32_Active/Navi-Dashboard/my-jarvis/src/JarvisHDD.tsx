import React, { useState, useEffect, useRef } from 'react';

/**
 * JarvisHDD Component
 * Based on Rainmeter [Iron_Man_HUD]HDD by SH Lee
 * Strictly following HDD.ini coordinates.
 */

interface HDDLayout {
  canvas: { width: number; height: number };
  angle1: number; // -0.52057 rad (~ -29.8 deg)
  angle2: number; // 30 deg
  drive1: {
    btn: { x: number; y: number; w: number; h: number };
    label: { x: number; y: number };
    bar: { x: number; y: number; w: number; h: number };
    percent: { x: number; y: number };
    arrowBase: { x: number; y: number };
  };
  drive2: {
    btn: { x: number; y: number; w: number; h: number };
    label: { x: number; y: number };
    bar: { x: number; y: number; w: number; h: number };
    percent: { x: number; y: number };
    arrowBase: { x: number; y: number };
  };
}

const HDD_LAYOUT: HDDLayout = {
  canvas: { width: 400, height: 234 },
  angle1: -29.8,  // Angle1=-0.52057 rad
  angle2: 30,
  drive1: {
    btn: { x: 290, y: 51, w: 100, h: 25 },
    label: { x: 204, y: 89 },
    bar: { x: 292, y: 53, w: 96, h: 20 },  // HDDBar1: X=292,Y=53,W=96,H=20
    percent: { x: 380, y: 51 },
    arrowBase: { x: 198, y: 81 }
  },
  drive2: {
    btn: { x: 290, y: 76, w: 100, h: 25 },
    label: { x: 226, y: 123 },
    bar: { x: 292, y: 80, w: 84, h: 20 },  // HDDBar2: X=292,Y=80,W=84,H=20
    percent: { x: 369, y: 78 },
    arrowBase: { x: 213, y: 103 }
  }
};

const JarvisHDD: React.FC = () => {
  const [activity, setActivity] = useState({ v1: 10, v2: 5 });
  const [hovered, setHovered] = useState<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivity({
        v1: (Math.sin(Date.now() / 200) * 32) + 32, // Pulsing 0-64
        v2: (Math.cos(Date.now() / 350) * 32) + 32
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const getArrowStyle = (baseX: number, baseY: number, val: number): React.CSSProperties => {
    const rad = (HDD_LAYOUT.angle2 * Math.PI) / 180;
    const moveX = val * Math.cos(rad);
    const moveY = -val * Math.sin(rad); // Rainmeter Y is down, but sin(30) is up in their formula logic

    return {
      position: 'absolute',
      left: `${baseX + moveX}px`,
      top: `${baseY + moveY}px`,
      transform: `rotate(${-HDD_LAYOUT.angle2}deg)`,
      transformOrigin: 'center',
      pointerEvents: 'none',
      transition: 'left 0.1s linear, top 0.1s linear'
    };
  };

  const getButtonStyle = (btn: typeof HDD_LAYOUT.drive1.btn, id: number): React.CSSProperties => {
    let frame = 0; // 0: Normal, 1: Over, 2: Down
    if (pressed === id) frame = 2;
    else if (hovered === id) frame = 1;

    return {
      position: 'absolute',
      left: `${btn.x}px`,
      top: `${btn.y}px`,
      width: `${btn.w}px`,
      height: `${btn.h}px`,
      backgroundImage: `url('${assetBase}/Button${id}.png')`,
      backgroundPosition: `-${frame * btn.w}px 0px`,
      cursor: 'pointer'
    };
  };

  const textBaseStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transformOrigin: 'top left'
  };

  // assetBase must be declared BEFORE getButtonStyle, which references it
  const assetBase = "/Skins/Iron_Man_Mark_7/HDD";

  // ─────────────────────────────────────────────────────
  // Rainmeter Bar Meter (Flip=1, BarOrientation=Horizontal)
  //   Fill direction: RIGHT → LEFT
  //   CSS equivalent: img anchored to right:0, width = percent%
  //   clipPath shows the right portion; as percent grows → bar grows leftward
  // ─────────────────────────────────────────────────────
  const renderBar = (
    bar: typeof HDD_LAYOUT.drive1.bar,
    imgSrc: string,
    percent: number
  ) => (
    <div style={{
      position: 'absolute',
      left: `${bar.x}px`,
      top: `${bar.y}px`,
      width: `${bar.w}px`,
      height: `${bar.h}px`,
      overflow: 'hidden'
    }}>
      <img
        src={imgSrc}
        alt=""
        style={{
          position: 'absolute',
          right: 0,                        // anchor to right edge
          top: 0,
          width: `${percent}%`,           // grow from right toward left
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'right center'   // keep right portion when cropped
        }}
      />
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      width: `${HDD_LAYOUT.canvas.width}px`,
      height: `${HDD_LAYOUT.canvas.height}px`,
      backgroundColor: 'transparent'
    }}>
      {/* Background */}
      <img src={`${assetBase}/hddbg.png`} alt="" style={{ position: 'absolute', left: 0, top: 0 }} />

      {/* HDD #1 - C: */}
      <div
        style={getButtonStyle(HDD_LAYOUT.drive1.btn, 1)}
        onMouseEnter={() => setHovered(1)}
        onMouseLeave={() => { setHovered(null); setPressed(null); }}
        onMouseDown={() => setPressed(1)}
        onMouseUp={() => setPressed(null)}
      />
      <div style={{
        ...textBaseStyle,
        left: `${HDD_LAYOUT.drive1.label.x}px`,
        top: `${HDD_LAYOUT.drive1.label.y}px`,
        color: '#00008C', fontSize: '6px', fontFamily: 'Arial',
        transform: `rotate(${HDD_LAYOUT.angle1}deg)`
      }}>
        SYSTEM (C:)
      </div>
      {renderBar(HDD_LAYOUT.drive1.bar, `${assetBase}/Disk1Bar.png`, 45)}
      <div style={{
        ...textBaseStyle,
        left: `${HDD_LAYOUT.drive1.percent.x}px`,
        top: `${HDD_LAYOUT.drive1.percent.y}px`,
        color: '#FFFFFF', fontSize: '11px', fontFamily: '"Arial Black"',
        transform: 'translateX(-100%)' // StringAlign=RIGHT
      }}>
        45%
      </div>
      <img src={`${assetBase}/arrow1.png`} style={getArrowStyle(HDD_LAYOUT.drive1.arrowBase.x, HDD_LAYOUT.drive1.arrowBase.y, activity.v1)} alt="" />

      {/* HDD #2 - D: */}
      <div
        style={getButtonStyle(HDD_LAYOUT.drive2.btn, 2)}
        onMouseEnter={() => setHovered(2)}
        onMouseLeave={() => { setHovered(null); setPressed(null); }}
        onMouseDown={() => setPressed(2)}
        onMouseUp={() => setPressed(null)}
      />
      <div style={{
        ...textBaseStyle,
        left: `${HDD_LAYOUT.drive2.label.x}px`,
        top: `${HDD_LAYOUT.drive2.label.y}px`,
        color: '#00008C', fontSize: '6px', fontFamily: 'Arial',
        transform: `rotate(${HDD_LAYOUT.angle1}deg)`
      }}>
        DATA (D:)
      </div>
      {renderBar(HDD_LAYOUT.drive2.bar, `${assetBase}/Disk2Bar.png`, 78)}
      <div style={{
        ...textBaseStyle,
        left: `${HDD_LAYOUT.drive2.percent.x}px`,
        top: `${HDD_LAYOUT.drive2.percent.y}px`,
        color: '#FFFFFF', fontSize: '11px', fontFamily: '"Arial Black"',
        transform: 'translateX(-100%)'
      }}>
        78%
      </div>
      <img src={`${assetBase}/arrow2.png`} style={getArrowStyle(HDD_LAYOUT.drive2.arrowBase.x, HDD_LAYOUT.drive2.arrowBase.y, activity.v2)} alt="" />

    </div>
  );
};

export default JarvisHDD;
