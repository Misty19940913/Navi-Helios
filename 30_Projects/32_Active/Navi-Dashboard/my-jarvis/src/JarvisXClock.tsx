import React from 'react';

/**
 * JarvisXClock Component
 * Based on Suvi_Jarvis_Rainmeter \ xClock
 * 7-layer rotating cosmetic element.
 */

const JarvisXClock: React.FC = () => {
    return (
        <div style={{
            position: 'relative',
            width: '218px',
            height: '218px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none'
        }}>
            <img src="/Skins/Suvi_Jarvis/xClock/1.png" style={{ position: 'absolute', animation: 'rotCW 8s linear infinite' }} alt="" />
            <img src="/Skins/Suvi_Jarvis/xClock/2.png" style={{ position: 'absolute', animation: 'rotCCW 42s linear infinite' }} alt="" />
            <img src="/Skins/Suvi_Jarvis/xClock/3.png" style={{ position: 'absolute', animation: 'rotCW 20s linear infinite' }} alt="" />
            <img src="/Skins/Suvi_Jarvis/xClock/4.png" style={{ position: 'absolute', animation: 'rotCCW 25s linear infinite' }} alt="" />
            <img src="/Skins/Suvi_Jarvis/xClock/5.png" style={{ position: 'absolute', animation: 'rotCW 30s linear infinite' }} alt="" />
            <img src="/Skins/Suvi_Jarvis/xClock/6.png" style={{ position: 'absolute', animation: 'rotCCW 35s linear infinite' }} alt="" />
            <img src="/Skins/Suvi_Jarvis/xClock/7.png" style={{ position: 'absolute', animation: 'rotCW 40s linear infinite' }} alt="" />
            
            <style>{`
                @keyframes rotCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes rotCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
            `}</style>
        </div>
    );
};

export default JarvisXClock;
