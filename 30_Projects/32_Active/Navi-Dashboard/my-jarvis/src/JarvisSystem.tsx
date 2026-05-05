import React, { useState, useEffect, useRef } from 'react';

/**
 * JarvisSystem Component
 * Based on Rainmeter [Iron_Man_HUD] CPU_Network by SH Lee
 * Strictly following System.ini and Lua scripts math.
 * 
 * Note: The center points (417, 231/237) are outside the 360x414 canvas.
 */

const CONFIG = {
  canvas: { width: 360, height: 414 },
  centers: {
    cpu: { x: 417, y: 231 },
    netIn: { x: 410, y: 246 }, // x shifted by user previously
    netOut: { x: 410, y: 246 },
    temp: { x: 429, y: 233 }
  },

  // SpeedFan indices mappings
  angles: {
    str1: 0.506 * (180 / Math.PI), // deg
    str2: -1.1519 * (180 / Math.PI),
    rnd1: 3.2149, // rad
    rnd2: 3.6128, // rad
  }
};

const JarvisSystem: React.FC = () => {

  const [cpuUsage, setCpuUsage] = useState(45);
  const [netInHistory, setNetInHistory] = useState<number[]>(new Array(30).fill(0));
  const [netOutHistory, setNetOutHistory] = useState<number[]>(new Array(32).fill(0));

  // Dynamic sensors
  const [netInSpeed, setNetInSpeed] = useState(1660);
  const [netOutSpeed, setNetOutSpeed] = useState(232);
  const [cpuTemp, setCpuTemp] = useState(43);
  const [gpuTemp, setGpuTemp] = useState(49);
  const [cpuFan, setCpuFan] = useState(4561);
  const [auxFan, setAuxFan] = useState(0);

  // Simulation for live dashboard effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate CPU
      setCpuUsage(Math.floor(Math.random() * 100));

      // Simulate Sensors
      setNetInSpeed(Math.floor(Math.random() * 5000));
      setNetOutSpeed(Math.floor(Math.random() * 500));
      setCpuTemp(40 + Math.floor(Math.random() * 10));
      setGpuTemp(45 + Math.floor(Math.random() * 10));
      setCpuFan(4400 + Math.floor(Math.random() * 300));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderCPUBars = () => {
    const bars = [];
    const r1 = 290;
    const imgw = 13;
    const count = 15;
    const activeCount = Math.floor(cpuUsage / (100 / count));

    for (let i = 1; i <= count; i++) {
      const an = (15.8 - i) * 1.62;
      const rad = (an * Math.PI) / 180;

      const x1 = r1 * Math.cos(rad);
      const y1 = r1 * Math.sin(rad);
      const tx = imgw * Math.cos(rad);
      const ty = imgw * Math.sin(rad);

      const x2 = Math.floor(CONFIG.centers.cpu.x - x1 + 0.44);
      const y2 = Math.floor(CONFIG.centers.cpu.y + y1 - ty + 0.44);

      const isActive = i <= activeCount;
      const imgSrc = isActive ? 'run.png' : 'rest.png';

      bars.push(
        <img
          key={`cpu-${i}`}
          src={`/Skins/Iron_Man_Mark_7/System/${imgSrc}`}
          style={{
            position: 'absolute',
            left: `${x2}px`,
            top: `${y2}px`,
            transform: `rotate(${-an}deg)`,
            transformOrigin: 'top left'
          }}
          alt=""
        />
      );
    }
    return bars;
  };

  const renderNetBars = (history: number[], type: 'in' | 'out') => {
    const bars = [];
    const config = type === 'in'
      ? { r0: 344, imgw: 40, an0: 24.8, step: 0.88, center: CONFIG.centers.netIn, prefix: 'inbar' }
      : { r0: 302, imgw: 35, an0: 24.4, step: 0.84, center: CONFIG.centers.netOut, prefix: 'outbar' };

    history.forEach((val, i) => {
      const n = i + 1;
      const an = config.an0 - n * config.step;
      const rad = (an * Math.PI) / 180;

      const r1 = config.r0 + val;
      const x1 = r1 * Math.cos(rad);
      const y1 = r1 * Math.sin(rad);
      const tx = config.imgw * Math.cos(rad);
      const ty = config.imgw * Math.sin(rad);

      const x2 = Math.floor(config.center.x - x1 + 0.44);
      const y2 = Math.floor(config.center.y + y1 - ty + 0.44);

      // Thresholds are also different between lua scripts
      let suffix = "";
      if (type === 'in') {
        if (val >= 14) suffix = "4";
        else if (val >= 11) suffix = "3";
        else if (val >= 8) suffix = "2";
        else if (val >= 4) suffix = "1";
      } else {
        if (val >= 15) suffix = "4";
        else if (val >= 10) suffix = "3";
        else if (val >= 5) suffix = "2";
        else suffix = "1"; // lua shows outbar1 as base for <5
      }

      bars.push(
        <img
          key={`net-${type}-${i}`}
          src={`/Skins/Iron_Man_Mark_7/System/${config.prefix}${suffix}.png`}
          style={{
            position: 'absolute',
            left: `${x2}px`,
            top: `${y2}px`,
            transform: `rotate(${-an}deg)`,
            transformOrigin: 'top left'
          }}
          alt=""
        />
      );
    });
    return bars;
  };

  return (
    <div style={{
      position: 'relative',
      width: `${CONFIG.canvas.width}px`,
      height: `${CONFIG.canvas.height}px`,
      overflow: 'hidden',
    }}>
      {/* Background */}
      <img src="/Skins/Iron_Man_Mark_7/System/SysBG.png" alt="" style={{ position: 'absolute', inset: 0 }} />


      {/* CPU Bars */}
      {renderCPUBars()}

      {/* Network Bars */}
      {renderNetBars(netInHistory, 'in')}
      {renderNetBars(netOutHistory, 'out')}

      {/* Labels & Values */}
      {/* CPU Usage Percentage */}
      <div style={{
        position: 'absolute', left: '147px', top: '211px',
        color: '#CCC', fontSize: '11px', transform: 'translateX(-100%)',
        fontFamily: 'Arial, sans-serif', fontWeight: 'bold'
      }}>
        {cpuUsage}%
      </div>

      {/* Network Speeds bps */}
      <div style={{
        position: 'absolute', left: '83px', top: '205px',
        color: '#A0A0FF', fontSize: '12px', transform: 'translateX(-100%)',
        textAlign: 'right', fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '10px' }}>{netInSpeed}</div>
        <div style={{ fontSize: '10px', marginTop: '-15px' }}>bps</div>
      </div>

      <div style={{
        position: 'absolute', left: '112px', top: '205px',
        color: '#A0A0FF', fontSize: '12px', transform: 'translateX(-100%)',
        textAlign: 'right', fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '10px' }}>{netOutSpeed}</div>
        <div style={{ fontSize: '10px', marginTop: '-15px' }}>bps</div>
      </div>

      {/* Temperatures */}
      <div style={{
        position: 'absolute', left: '174px', top: '96px',
        color: '#CCC', fontSize: '12px',
        transform: `rotate(${CONFIG.angles.str1}deg) translateX(-100%)`,
        transformOrigin: 'bottom right',
        whiteSpace: 'nowrap'
      }}>
        {cpuTemp}°C
      </div>

      <div style={{
        position: 'absolute', left: '149px', top: '82px',
        color: '#CCC', fontSize: '12px',
        transform: `rotate(${CONFIG.angles.str1}deg) translateX(-100%)`,
        transformOrigin: 'bottom right',
        whiteSpace: 'nowrap'
      }}>
        {gpuTemp}°C
      </div>

      {/* Fan Speeds */}
      <div style={{
        position: 'absolute', left: '109px', top: '26px',
        color: '#A0A0FF', fontSize: '12px',
        transform: `rotate(${CONFIG.angles.str2}deg) translateX(-95%)`,
        transformOrigin: 'bottom right',
        whiteSpace: 'nowrap'
      }}>
        {cpuFan}rpm
      </div>

      <div style={{
        position: 'absolute', left: '102px', top: '33px',
        color: '#A0A0FF', fontSize: '12px',
        transform: `rotate(${CONFIG.angles.str2}deg) translateX(-100%)`,
        transformOrigin: 'bottom right',
        whiteSpace: 'nowrap'
      }}>
        {auxFan}rpm
      </div>
    </div >
  );
};

export default JarvisSystem;
