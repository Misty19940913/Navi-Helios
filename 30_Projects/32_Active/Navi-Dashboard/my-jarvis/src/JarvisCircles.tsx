import React, { useState, useEffect } from 'react';

/**
 * JarvisCircles Component
 * Based on Suvi_Jarvis_Rainmeter \ circles \ CPU and RAM
 */

const JarvisCircles: React.FC = () => {
    const [cpu, setCpu] = useState(45);
    const [ram, setRam] = useState(62);
    const [uptime, setUptime] = useState("03h, 45m");
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCpu(Math.floor(Math.random() * 100));
            setRam(prev => (prev + Math.random() - 0.5)); // Slight ram jitter
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const ramUsedPercent = ram;
    const cpuUsedPercent = cpu;

    // SVG Geometry for Roundlines
    // CPU/Power: LineLength=31, LineStart=36 -> radius 33.5, stroke 5
    // RAM: LineLength=27, LineStart=15 -> radius 21, stroke 12
    const size = { w: 215, h: 87 };
    const circleCenter = { x: 54, y: 43.5 }; // W=108/2, H=87/2

    const renderCircularBar = (center: {x:number, y:number}, radius: number, strokeWidth: number, percentage: number, color: string, startAngle: number = 0) => {
        const circumference = 2 * Math.PI * radius;
        const dashOffset = circumference - (percentage / 100) * circumference;
        return (
            <circle
                cx={center.x} cy={center.y} r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                transform={`rotate(${(startAngle * 180 / Math.PI) - 90}, ${center.x}, ${center.y})`}
            />
        );
    };

    return (
        <div style={{
            position: 'relative',
            width: `${size.w}px`,
            height: `${size.h}px`,
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: '"Arial Black", sans-serif',
            userSelect: 'none'
        }}>
            {/* Background */}
            <img src="/Skins/Suvi_Jarvis/circles/bg_ram_cpu.png" alt="" style={{ position: 'absolute', inset: 0 }} />

            {/* Circular Meters */}
            <svg style={{ position: 'absolute', left: 0, top: 0, width: '108px', height: '87px' }}>
                {/* RAM (Inner) - Red */}
                {renderCircularBar(circleCenter, 21, 12, ramUsedPercent, 'rgba(255, 0, 0, 1)', 3.0)}
                
                {/* CPU/Power (Outer) - Orange */}
                {renderCircularBar(circleCenter, 33.5, 5, cpuUsedPercent, 'rgba(255, 100, 0, 0.8)', 4.7123)}
            </svg>

            {/* RAM Info */}
            <div style={{ position: 'absolute', left: '95px', top: '13px', fontSize: '8px', fontWeight: 'bold' }}>
                RAM: 16.0GB
            </div>
            <div style={{ position: 'absolute', left: '95px', top: '25px', fontSize: '8px', fontWeight: 'bold' }}>
                {(16 * (ramUsedPercent/100)).toFixed(1)}GB used
            </div>
            <div style={{ position: 'absolute', left: '181px', top: '19px', fontSize: '7px', fontWeight: 'bold', color: 'white' }}>
                {ramUsedPercent.toFixed(0)}%
            </div>

            {/* CPU Info */}
            <div style={{ position: 'absolute', left: '95px', top: '47px', fontSize: '7px', fontWeight: 'bold' }}>
                CPU: 3600 MHz
            </div>
            <div style={{ position: 'absolute', left: '66px', top: '38px', fontSize: '7px', fontWeight: 'bold', textAlign: 'right', transform: 'translateX(-100%)' }}>
                {cpu}%
            </div>

            {/* Uptime */}
            <div style={{ position: 'absolute', left: '95px', top: '0px', fontSize: '7px', fontWeight: 'bold' }}>
                Uptime:
            </div>
            <div style={{ position: 'absolute', left: '140px', top: '0px', fontSize: '7px', fontWeight: 'bold' }}>
                {uptime}
            </div>

            {/* CPU Graph Placeholder */}
            <div style={{
                position: 'absolute',
                left: '95px',
                top: '62px',
                width: '115px',
                height: '21px',
                border: '1px solid rgba(255, 0, 0, 0.2)',
                background: 'linear-gradient(0deg, rgba(255, 0, 0, 0.1) 0%, transparent 100%)'
            }} />
        </div>
    );
};

export default JarvisCircles;
