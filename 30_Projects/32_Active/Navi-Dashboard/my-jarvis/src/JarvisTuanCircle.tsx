import React, { useState, useEffect } from 'react';

/**
 * JarvisTuanCircle Component
 * Based on TuanLinhTinh \ J.A.R.V.I.S Ver 1.1 \ circle
 * Massive 201-frame circular animation.
 */

const JarvisTuanCircle: React.FC = () => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        // 30ms update rate from INI
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % 201);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    // WARNING: This component uses a 100,500px wide sprite sheet.
    // If you see a blank screen or flickering, it means the browser/GPU 
    // cannot handle the texture size.

    return (
        <div style={{
            position: 'relative',
            width: '500px',
            height: '500px',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            <div style={{
                width: '500px',
                height: '500px',
                backgroundImage: 'url("/Skins/Tuan/circle/circle.png")',
                backgroundPosition: `-${frame * 500}px 0px`,
                backgroundRepeat: 'no-repeat',
                // Force GPU layer
                transform: 'translateZ(0)',
                willChange: 'background-position'
            }} />
        </div>
    );
};

export default JarvisTuanCircle;
