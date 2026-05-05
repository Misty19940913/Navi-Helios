import React, { useState, useEffect } from 'react';

/**
 * JarvisTuanModel Component
 * Based on TuanLinhTinh \ J.A.R.V.I.S Ver 1.1 \ model
 * 161-frame cinematic scanner of a mechanical model.
 */

const JarvisTuanModel: React.FC = () => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % 161);
        }, 50); // 50ms from INI
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '600px',
            height: '600px',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            <div style={{
                width: '600px',
                height: '600px',
                backgroundImage: 'url("/Skins/Tuan/model/model.png")',
                backgroundPosition: `-${frame * 600}px 0px`,
                backgroundRepeat: 'no-repeat',
                transform: 'translateZ(0)'
            }} />
            
            {/* HUD Status Text Overlay */}
            <div style={{
                position: 'absolute',
                top: '40px',
                left: '40px',
                color: '#00ff88',
                fontSize: '10px',
                opacity: 0.6,
                textAlign: 'left',
                lineHeight: '1.4'
            }}>
                SCANNING MODEL...<br />
                ID: MK-XLII<br />
                PHASE: SYNCING
            </div>
        </div>
    );
};

export default JarvisTuanModel;
