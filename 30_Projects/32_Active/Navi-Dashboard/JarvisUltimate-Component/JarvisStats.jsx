import React, { useState, useEffect } from 'react';
import './JarvisStats.css';

const StatBar = ({ label, value }) => {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <div className="stat-bar-container">
        {/* Background segments - simplified interpretation of the many outbars in INI */}
        <div className="stat-outbar" style={{ width: '100%' }} />
        {/* Fill bar */}
        <div 
          className="stat-inbar" 
          style={{ width: `${value}%`, transition: 'width 0.5s ease-out' }} 
        />
      </div>
      <span className="stat-value">{Math.round(value)}%</span>
    </div>
  );
};

const JarvisStats = ({ title = "SYSTEM STATUS" }) => {
  const [stats, setStats] = useState({ cpu: 45, ram: 62, net: 15, hdd: 38 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.max(10, Math.min(95, stats.cpu + (Math.random() - 0.5) * 10)),
        ram: Math.max(40, Math.min(80, stats.ram + (Math.random() - 0.5) * 2)),
        net: Math.max(5, Math.min(99, stats.net + (Math.random() - 0.5) * 20)),
        hdd: stats.hdd
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [stats]);

  return (
    <div className="jarvis-stats-container">
      <h2 className="stats-header">{title}</h2>
      <div className="stats-body">
        <StatBar label="CPU" value={stats.cpu} />
        <StatBar label="RAM" value={stats.ram} />
        <StatBar label="NET" value={stats.net} />
        <StatBar label="HDD" value={stats.hdd} />
      </div>
      <img src="assets/System/SysBG.png" className="stats-bg-decoration" />
    </div>
  );
};

export default JarvisStats;
