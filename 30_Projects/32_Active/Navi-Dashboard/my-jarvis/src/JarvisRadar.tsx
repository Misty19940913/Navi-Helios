import React from 'react';

/**
 * JarvisRadar Component
 * Based on Suvi_Jarvis_Rainmeter \ D.U. Radar
 */

const JarvisRadar: React.FC = () => {
    return (
        <div style={{
            position: 'relative',
            width: '256px',
            height: '256px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            userSelect: 'none'
        }}>
            {/* 1. Large Outer Decoration (sc.png) */}
            <img 
                src="/Skins/Suvi_Jarvis/Radar/sc.png" 
                style={{ position: 'absolute', width: '256px', height: '256px', opacity: 0.6 }} 
                alt="" 
            />

            {/* 2. Radar Outer Frame (radarbg.png) */}
            <img 
                src="/Skins/Suvi_Jarvis/Radar/radarbg.png" 
                style={{ position: 'absolute', width: '240px', height: '240px', opacity: 0.8 }} 
                alt="" 
            />

            {/* 3. Static Radar Base (s.png) */}
            <img 
                src="/Skins/Suvi_Jarvis/Radar/s.png" 
                style={{ position: 'absolute', width: '129px', height: '129px' }} 
                alt="" 
            />

            {/* 4. Rotating Scanner Light (radarlight.png) */}
            <img 
                src="/Skins/Suvi_Jarvis/Radar/radarlight.png" 
                style={{ 
                    position: 'absolute', 
                    width: '129px', 
                    height: '129px',
                    animation: 'radarRotate 1.8s linear infinite',
                    transformOrigin: 'center center'
                }} 
                alt="" 
            />

            <style>{`
                @keyframes radarRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default JarvisRadar;
