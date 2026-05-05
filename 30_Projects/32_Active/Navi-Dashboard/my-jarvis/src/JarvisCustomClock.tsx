import React, { useState, useEffect } from 'react';

/**
 * JarvisCustomClock Component
 * Based on Suvi_Jarvis_Rainmeter \ Custom Clock and Date \ Alt Date and Time
 */

const JarvisCustomClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const seconds = time.getSeconds();
    const hhmm = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const weekday = time.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = time.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });

    // SVG Geometry for Analog Seconds
    const center = { x: 50, y: 55 }; // Adjusted slightly for canvas

    const renderRing = (radius: number, thickness: number, color: string, percentage: number = 100) => {
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        return (
            <circle
                cx={center.x} cy={center.y} r={radius}
                fill="none"
                stroke={color}
                strokeWidth={thickness}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                transform={`rotate(-90, ${center.x}, ${center.y})`}
            />
        );
    };

    return (
        <div style={{
            position: 'relative',
            width: '320px',
            height: '140px',
            color: '#00aeff',
            fontFamily: 'lcd, Arial, sans-serif',
            userSelect: 'none'
        }}>
            {/* 1. ANALOG SECONDS RINGS */}
            <svg style={{ position: 'absolute', left: 0, top: 0, width: '100px', height: '110px' }}>
                {/* BG Ring 1 (Inner/Outer composite) */}
                {renderRing(24.5, 11, 'rgba(255, 255, 255, 0.1)')}

                {/* BG Ring 2 (Outer Border) */}
                {renderRing(33, 2, '#00aeff')}

                {/* Active Seconds Fill */}
                {renderRing(25, 6, '#00aeff', (seconds / 60) * 100)}
            </svg>

            {/* 2. DIGITAL TIME HH:MM */}
            <div style={{
                position: 'absolute',
                left: '155px',
                top: '22px',
                transform: 'translateX(-50%)',
                fontSize: '48px',
                fontWeight: 'bold',
                fontFamily: 'lcd, monospace',
                letterSpacing: '2px'
            }}>
                {hhmm}
            </div>

            {/* 3. SEPARATOR LINE */}
            <div style={{
                position: 'absolute',
                left: '86px',
                top: '75px',
                width: '112px',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
            }} />

            {/* 4. CALENDAR INFO */}
            <div style={{
                position: 'absolute',
                left: '143px',
                top: '80px',
                width: '100%',
                textAlign: 'center',
                transform: 'translateX(-50%)',
                fontSize: '14px',
                fontFamily: 'Imagine Font, Arial, sans-serif',
                textTransform: 'uppercase'
            }}>
                {weekday}
            </div>

            <div style={{
                position: 'absolute',
                left: '143px',
                top: '102px',
                width: '100%',
                textAlign: 'center',
                transform: 'translateX(-50%)',
                fontSize: '18px',
                fontFamily: 'lcd, monospace'
            }}>
                {fullDate}
            </div>
        </div>
    );
};

export default JarvisCustomClock;
