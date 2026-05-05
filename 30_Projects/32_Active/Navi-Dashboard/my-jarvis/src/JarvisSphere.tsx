import React, { useState, useEffect } from 'react';

/**
 * JarvisSphere Component
 * Based on Suvi_Jarvis_Rainmeter \ Sphere
 * A 20-frame bitmap animation of a rotating sphere with diagnostic data.
 */

const JarvisSphere: React.FC = () => {
    const [frame, setFrame] = useState(0);
    const [posX, setPosX] = useState("500.00");
    const [posY, setPosY] = useState("1000.00");

    useEffect(() => {
        const frameInterval = setInterval(() => {
            setFrame(f => (f + 1) % 20);
        }, 50); // ~20fps for smooth animation

        const dataInterval = setInterval(() => {
            setPosX((Math.random() * 500 + 500).toFixed(2));
            setPosY((Math.random() * 1000 + 1000).toFixed(2));
        }, 300);

        return () => {
            clearInterval(frameInterval);
            clearInterval(dataInterval);
        };
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '251px',
            height: '81px',
            userSelect: 'none',
            color: 'white',
            fontFamily: '"Hooge 05_53", Arial, sans-serif'
        }}>
            {/* 1. Background (sphere background.png) */}
            <img 
                src="/Skins/Suvi_Jarvis/Sphere/sphere background.png" 
                style={{ position: 'absolute', inset: 0, width: '251px', height: '81px' }} 
                alt="" 
            />

            {/* 2. Bitmap Animation (small sphere.png) */}
            <div style={{
                position: 'absolute',
                left: '25px',
                top: '20px',
                width: '48px',
                height: '48px',
                backgroundImage: 'url("/Skins/Suvi_Jarvis/Sphere/small sphere.png")',
                backgroundPosition: `-${frame * 48}px 0px`,
                backgroundRepeat: 'no-repeat'
            }} />

            {/* 3. Overlay (overlay.png) */}
            <img 
                src="/Skins/Suvi_Jarvis/Sphere/overlay.png" 
                style={{ position: 'absolute', left: '17px', top: '19px', width: '113px', height: '44px' }} 
                alt="" 
            />

            {/* 4. Labels */}
            <div style={{
                position: 'absolute', left: '142px', top: '14px',
                fontSize: '9px', fontWeight: 'bold',
                textShadow: '0 0 4px rgba(0, 148, 255, 0.8)'
            }}>
                POS X/Y
            </div>

            <div style={{
                position: 'absolute', left: '142px', top: '29px',
                fontSize: '11px', fontWeight: 'bold',
                textShadow: '0 0 4px rgba(0, 148, 255, 0.8)'
            }}>
                {posX}
            </div>

            <div style={{
                position: 'absolute', left: '142px', top: '43px',
                fontSize: '11px', fontWeight: 'bold',
                textShadow: '0 0 4px rgba(0, 148, 255, 0.8)'
            }}>
                {posY}
            </div>
        </div>
    );
};

export default JarvisSphere;
