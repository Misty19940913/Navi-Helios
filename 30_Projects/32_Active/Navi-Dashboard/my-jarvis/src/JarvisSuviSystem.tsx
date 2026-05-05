import React, { useState, useEffect } from 'react';

/**
 * JarvisSuviSystem Component
 * Based on Suvi_Jarvis_Rainmeter \ System
 * Diagnostic scan of the Iron Man skeleton with system metrics.
 */

const JarvisSuviSystem: React.FC = () => {
    const [frame, setFrame] = useState(0);
    const [netIn, setNetIn] = useState(120);
    const [netOut, setNetOut] = useState(45);

    useEffect(() => {
        const frameInterval = setInterval(() => {
            setFrame(f => (f + 1) % 7);
        }, 500);

        const netInterval = setInterval(() => {
            setNetIn(Math.floor(Math.random() * 200 + 150));
            setNetOut(Math.floor(Math.random() * 80 + 20));
        }, 1200);

        return () => {
            clearInterval(frameInterval);
            clearInterval(netInterval);
        };
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '360px',
            height: '414px',
            color: '#00aeff',
            fontFamily: '"Hooge 05_53", Arial, sans-serif',
            userSelect: 'none',
            border: '1px solid rgba(0, 174, 255, 0.1)', // Debug border
            overflow: 'hidden',
            margin: '0 auto'
        }}>
            {/* Background */}
            <img 
                src="/Skins/Suvi_Jarvis/System/SysBG.png" 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} 
                alt="" 
            />

            {/* Wireframe Underlay */}
            <img 
                src="/Skins/Suvi_Jarvis/System/Wireframe_001.png" 
                style={{ 
                    position: 'absolute', 
                    left: '110px', 
                    top: '110px', 
                    width: '140px', 
                    opacity: 0.2, 
                    pointerEvents: 'none' 
                }} 
                alt="" 
            />

            {/* Diagnostic Skeleton Frame */}
            <img 
                key={frame}
                src={`/Skins/Suvi_Jarvis/System/IronMan${frame}.png`} 
                style={{ 
                    position: 'absolute', 
                    left: '110px', 
                    top: '130px', 
                    width: '140px',
                    pointerEvents: 'none'
                }} 
                alt="Diagnostic Skeleton" 
            />

            {/* Data Overlays */}
            <div style={{ position: 'absolute', left: '40px', top: '75px', textAlign: 'left' }}>
                <div style={{ fontSize: '9px', opacity: 0.7, color: '#00d4ff' }}>UPLINK</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{netOut} Kb/s</div>
            </div>

            <div style={{ position: 'absolute', right: '40px', top: '75px', textAlign: 'right' }}>
                <div style={{ fontSize: '9px', opacity: 0.7, color: '#00d4ff' }}>DOWNLINK</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{netIn} Kb/s</div>
            </div>

            <div style={{ 
                position: 'absolute', 
                left: '25px', 
                bottom: '90px', 
                fontSize: '8px', 
                textAlign: 'left',
                opacity: 0.8,
                lineHeight: '1.4'
            }}>
                OS_CORE_VERSION: 10.4.2<br />
                ENCRYPTION: AES-256<br />
                STATUS: OPTIMAL<br />
                SYNC_LOCK: ACTIVE
            </div>
            
            {/* Network Activity Arrows */}
            <img 
                src="/Skins/Suvi_Jarvis/System/arrow1.png" 
                style={{ position: 'absolute', left: '60px', top: '100px', width: '12px', animation: 'suviPulse 1s infinite' }} 
                alt="" 
            />
            <img 
                src="/Skins/Suvi_Jarvis/System/arrow2.png" 
                style={{ position: 'absolute', right: '60px', top: '100px', width: '12px', animation: 'suviPulse 1s infinite alternate-reverse' }} 
                alt="" 
            />

            <style>{`
                @keyframes suviPulse { 
                    0% { opacity: 0.3; transform: translateY(0); }
                    100% { opacity: 1; transform: translateY(-3px); }
                }
            `}</style>
        </div>
    );
};

export default JarvisSuviSystem;
