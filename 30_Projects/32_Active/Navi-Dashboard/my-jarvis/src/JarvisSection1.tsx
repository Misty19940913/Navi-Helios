import React from 'react';

/**
 * JarvisSection1 Component
 * Based on Suvi_Jarvis_Rainmeter \ section1
 * A 6-layer differential rotator with a central glow.
 */

const JarvisSection1: React.FC = () => {
    return (
        <div style={{
            position: 'relative',
            width: '218px',
            height: '218px',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Layers 1-7 (Note: 5 is missing in INI) */}
            
            {/* MeterUnder1: ValueReminder=80, CW (Fastest) */}
            <img 
                src="/Skins/Suvi_Jarvis/Section1/1.png" 
                style={{ position: 'absolute', width: '218px', height: '218px', animation: 'sectionCW 4s linear infinite' }} 
                alt="" 
            />

            {/* MeterUnder3: ValueReminder=200, CW */}
            <img 
                src="/Skins/Suvi_Jarvis/Section1/3.png" 
                style={{ position: 'absolute', width: '218px', height: '218px', animation: 'sectionCW 10s linear infinite' }} 
                alt="" 
            />

            {/* MeterUnder4: ValueReminder=250, CCW */}
            <img 
                src="/Skins/Suvi_Jarvis/Section1/4.png" 
                style={{ position: 'absolute', width: '218px', height: '218px', animation: 'sectionCCW 12.5s linear infinite' }} 
                alt="" 
            />

            {/* MeterUnder6: ValueReminder=350, CCW */}
            <img 
                src="/Skins/Suvi_Jarvis/Section1/6.png" 
                style={{ position: 'absolute', width: '218px', height: '218px', animation: 'sectionCCW 17.5s linear infinite' }} 
                alt="" 
            />

            {/* MeterUnder7: ValueReminder=400, CW */}
            <img 
                src="/Skins/Suvi_Jarvis/Section1/7.png" 
                style={{ position: 'absolute', width: '218px', height: '218px', animation: 'sectionCW 20s linear infinite' }} 
                alt="" 
            />

            {/* MeterUnder2: ValueReminder=420, CCW (Slowest) */}
            <img 
                src="/Skins/Suvi_Jarvis/Section1/2.png" 
                style={{ position: 'absolute', width: '218px', height: '218px', animation: 'sectionCCW 21s linear infinite' }} 
                alt="" 
            />

            {/* Central Glow */}
            <img 
                src="/Skins/Suvi_Jarvis/Section1/glow.png" 
                style={{ 
                    position: 'absolute', 
                    left: '29px', 
                    top: '32px', 
                    width: '160px', /* Approximate size if centered */
                    opacity: 0.8
                }} 
                alt="" 
            />

            <style>{`
                @keyframes sectionCW {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes sectionCCW {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
            `}</style>
        </div>
    );
};

export default JarvisSection1;
