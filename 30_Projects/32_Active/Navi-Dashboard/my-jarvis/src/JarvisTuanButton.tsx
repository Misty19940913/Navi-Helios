import React, { useState, useEffect } from 'react';

/**
 * JarvisTuanButton Component
 * Based on TuanLinhTinh \ J.A.R.V.I.S Ver 1.1 \ button1,2,3
 * Interactive animated buttons with 201 frames.
 */

interface Props {
    id?: 1 | 2 | 3;
    label?: string;
    onClick?: () => void;
}

const JarvisTuanButton: React.FC<Props> = ({ id = 1, label = "SYSTEM", onClick }) => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        // Update every 30ms as per INI
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % 201);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            onClick={onClick}
            style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                userSelect: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("/Skins/Tuan/button${id}/button${id}.png")`,
                backgroundPosition: `-${frame * 200}px 0px`,
                backgroundRepeat: 'no-repeat',
                transform: 'translateZ(0)'
            }} />
            
            <div style={{
                zIndex: 2,
                color: '#00ff88',
                fontFamily: 'Consolas, monospace',
                fontSize: '11px',
                fontWeight: 'bold',
                textShadow: '0 0 8px rgba(0, 255, 136, 0.8)',
                marginTop: '10px'
            }}>
                {label}
            </div>
        </div>
    );
}; 

export const TuanButton1: React.FC = () => <JarvisTuanButton id={1} label="LAUNCHER" />;
export const TuanButton2: React.FC = () => <JarvisTuanButton id={2} label="SYSTEM" />;
export const TuanButton3: React.FC = () => <JarvisTuanButton id={3} label="NETWORK" />;

export default JarvisTuanButton;
