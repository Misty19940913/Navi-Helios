import React from 'react';

/**
 * JarvisRotatorX Component
 * Based on Suvi_Jarvis_Rainmeter \ RotatorX
 * A complex 6-layer rotating JARVIS logo animation.
 */

const JarvisRotatorX: React.FC = () => {
    return (
        <div style={{
            position: 'relative',
            width: '340px',
            height: '340px',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Layer 1: RNG.png (Inner/Outer Ring) - Slow CW */}
            <img 
                src="/Skins/Suvi_Jarvis/RotatorX/RNG.png" 
                style={{ 
                    position: 'absolute', width: '340px', height: '340px',
                    animation: 'rotatorCW 15s linear infinite' 
                }} 
                alt="" 
            />

            {/* Layer 2: JOC.png - Slow CCW */}
            <img 
                src="/Skins/Suvi_Jarvis/RotatorX/JOC.png" 
                style={{ 
                    position: 'absolute', width: '340px', height: '340px',
                    animation: 'rotatorCCW 12s linear infinite' 
                }} 
                alt="" 
            />

            {/* Layer 3: JSP.png - Slow CW */}
            <img 
                src="/Skins/Suvi_Jarvis/RotatorX/JSP.png" 
                style={{ 
                    position: 'absolute', width: '340px', height: '340px',
                    animation: 'rotatorCW 10s linear infinite' 
                }} 
                alt="" 
            />

            {/* Layer 4: JCE.png - Fast CCW */}
            <img 
                src="/Skins/Suvi_Jarvis/RotatorX/JCE.png" 
                style={{ 
                    position: 'absolute', width: '340px', height: '340px',
                    animation: 'rotatorCCW 6s linear infinite' 
                }} 
                alt="" 
            />

            {/* Layer 5: JCC.png - Fast CW */}
            <img 
                src="/Skins/Suvi_Jarvis/RotatorX/JCC.png" 
                style={{ 
                    position: 'absolute', width: '340px', height: '340px',
                    animation: 'rotatorCW 5s linear infinite' 
                }} 
                alt="" 
            />

            {/* Layer 6: JARVIS.png - Static Center */}
            <img 
                src="/Skins/Suvi_Jarvis/RotatorX/JARVIS.png" 
                style={{ position: 'absolute', width: '340px', height: '340px' }} 
                alt="" 
            />

            <style>{`
                @keyframes rotatorCW {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rotatorCCW {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
            `}</style>
        </div>
    );
};

export default JarvisRotatorX;
