import React, { useState, useEffect } from 'react';

/**
 * JarvisStats Component
 * Based on Suvi_Jarvis_Rainmeter \ stats
 */

const JarvisStats: React.FC = () => {
    const [metrics, setMetrics] = useState({
        cpu: 18,
        ram: 45,
        swap: 12
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                cpu: Math.floor(Math.random() * 30 + 10),
                ram: 45 + Math.floor(Math.random() * 5),
                swap: 12 + Math.floor(Math.random() * 2)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '180px',
            height: '100px',
            color: '#00aeff',
            fontFamily: '"Hooge 05_53", Arial, sans-serif',
            userSelect: 'none'
        }}>
            <img src="/Skins/Suvi_Jarvis/stats/bg.png" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} alt="" />
            
            <div style={{ position: 'absolute', left: '15px', top: '15px', fontSize: '10px', fontWeight: 'bold' }}>SYSTEM STATS</div>

            <div style={{ position: 'absolute', left: '15px', top: '35px', fontSize: '12px' }}>
                CPU: <span style={{ color: 'white' }}>{metrics.cpu}%</span>
            </div>
            <div style={{ position: 'absolute', left: '15px', top: '50px', fontSize: '12px' }}>
                RAM: <span style={{ color: 'white' }}>{metrics.ram}%</span>
            </div>
            <div style={{ position: 'absolute', left: '15px', top: '65px', fontSize: '12px' }}>
                SWP: <span style={{ color: 'white' }}>{metrics.swap}%</span>
            </div>

            <img src="/Skins/Suvi_Jarvis/stats/win.png" style={{ position: 'absolute', right: '10px', bottom: '10px', width: '32px', opacity: 0.6 }} alt="" />
        </div>
    );
};

export default JarvisStats;
