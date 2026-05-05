import React from 'react';

/**
 * JarvisTag Component
 * Based on Suvi_Jarvis_Rainmeter \ Jarvis Tag
 * A descriptive branding tag for the OS version.
 */

const JarvisTag: React.FC = () => {
    return (
        <div style={{
            position: 'relative',
            width: '284px',
            height: '65px',
            backgroundColor: 'rgba(0, 20, 30, 0.4)',
            borderLeft: '4px solid #b8bdaa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '15px',
            fontFamily: '"Gliscor Gothic", sans-serif',
            userSelect: 'none',
            backdropFilter: 'blur(5px)',
            borderRadius: '0 8px 8px 0',
            borderRight: '1px solid rgba(184,189,170,0.2)',
            borderTop: '1px solid rgba(184,189,170,0.1)',
            borderBottom: '1px solid rgba(184,189,170,0.1)'
        }}>
            {/* Main Tag Text */}
            <div style={{
                color: 'rgba(184,189,170,1)',
                fontSize: '24px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                lineHeight: '1',
                marginBottom: '4px'
            }}>
                J.A.R.V.I.S OS
            </div>

            {/* Version Text */}
            <div style={{
                color: 'rgba(151,173,183,1)',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
            }}>
                Latest 10.0.0.1 version
            </div>

            {/* Decorative Corner Element */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '20px',
                height: '20px',
                borderTop: '2px solid rgba(184,189,170,0.5)',
                borderRight: '2px solid rgba(184,189,170,0.5)'
            }} />
        </div>
    );
};

export default JarvisTag;
