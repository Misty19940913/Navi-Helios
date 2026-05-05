import React, { useState, useEffect } from 'react';

/**
 * JarvisAnalogTime Component
 * Based on Suvi_Jarvis_Rainmeter \ Time
 */

const JarvisAnalogTime: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const sec = time.getSeconds();
    const min = time.getMinutes() + sec / 60;
    const hour = (time.getHours() % 12) + min / 60;

    return (
        <div style={{
            position: 'relative',
            width: '180px',
            height: '180px',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <img src="/Skins/Suvi_Jarvis/Time/TimeBG.png" style={{ position: 'absolute', width: '180px' }} alt="" />
            <img src="/Skins/Suvi_Jarvis/Time/outring.png" style={{ position: 'absolute', animation: 'rotCW 60s linear infinite' }} alt="" />
            <img src="/Skins/Suvi_Jarvis/Time/inring.png" style={{ position: 'absolute', animation: 'rotCCW 30s linear infinite' }} alt="" />
            
            {/* Hour Hand */}
            <img 
                src="/Skins/Suvi_Jarvis/Time/hour.png" 
                style={{ 
                    position: 'absolute', 
                    transform: `rotate(${hour * 30}deg)`,
                    transformOrigin: 'center center'
                }} 
                alt="" 
            />
            {/* Minute Hand */}
            <img 
                src="/Skins/Suvi_Jarvis/Time/min.png" 
                style={{ 
                    position: 'absolute', 
                    transform: `rotate(${min * 6}deg)`,
                    transformOrigin: 'center center'
                }} 
                alt="" 
            />
            {/* Second Hand */}
            <img 
                src="/Skins/Suvi_Jarvis/Time/sec.png" 
                style={{ 
                    position: 'absolute', 
                    transform: `rotate(${sec * 6}deg)`,
                    transformOrigin: 'center center'
                }} 
                alt="" 
            />
            
            <style>{`
                @keyframes rotCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes rotCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
            `}</style>
        </div>
    );
};

export default JarvisAnalogTime;
