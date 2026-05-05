import React, { useState, useEffect } from 'react';

/**
 * Jarvis3rdGig Component
 * Based on Suvi_Jarvis_Rainmeter \ 3rdGig
 * A Ghost in the Shell inspired circular clock.
 */

const Jarvis3rdGig: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 100); // 10fps for smooth rotation
        return () => clearInterval(interval);
    }, []);

    const h12 = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const millis = time.getMilliseconds();
    
    // Rotation calculations
    // Minutes: Full circle (2pi) every 3600 seconds. 
    // current_minute_in_seconds = (m * 60 + s)
    const minRotate = (minutes * 60 + seconds) * (360 / 3600);
    
    // Seconds: Full circle (2pi) every 60 seconds.
    const secRotate = (seconds + millis / 1000) * (360 / 60);

    // Roundline: (Seconds + 1) % 10. Fills every 10 seconds.
    const roundVal = ((seconds + millis / 1000) + 1) % 10;
    const dashArray = (roundVal / 10) * (2 * Math.PI * 47.5); // radius is approx 47.5 (LineStart 45, LineLength 50)

    return (
        <div style={{
            position: 'relative',
            width: '240px',
            height: '360px', // As per INI H=360
            color: 'white',
            fontFamily: '"Arial Black", sans-serif',
            userSelect: 'none'
        }}>
            {/* 1. Hours Bitmap Circle (hourscircle2.png) */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: '15px',
                width: '240px',
                height: '330px',
                backgroundImage: 'url(/Skins/Suvi_Jarvis/3rdGig/hourscircle2.png)',
                backgroundPosition: `-${h12 * 240}px 0px`,
                backgroundRepeat: 'no-repeat'
            }} />

            {/* 2. Minutes Circle (Minutescircle.png) */}
            <img 
                src="/Skins/Suvi_Jarvis/3rdGig/minutescircle.png"
                style={{
                    position: 'absolute',
                    left: '4px',
                    top: '34px',
                    width: '240px',
                    height: '240px',
                    transform: `rotate(${minRotate}deg)`,
                    transformOrigin: 'center center'
                }}
                alt=""
            />

            {/* 3. Seconds Circle (secondcircle2.png) */}
            <img 
                src="/Skins/Suvi_Jarvis/3rdGig/secondcircle2.png"
                style={{
                    position: 'absolute',
                    left: '4px',
                    top: '34px',
                    width: '240px',
                    height: '240px',
                    transform: `rotate(${secRotate}deg)`,
                    transformOrigin: 'center center'
                }}
                alt=""
            />

            {/* 4. Roundline (Seconds Progress Arc) */}
            <svg style={{
                position: 'absolute',
                left: '85px',
                top: '112px',
                width: '80px',
                height: '80px',
                transform: 'rotate(-90deg)' // To align with StartAngle=270deg (12 o'clock)
            }}>
                <circle 
                    cx="40" cy="40" r="23"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="5"
                    strokeDasharray={`${(roundVal/10) * (2 * Math.PI * 23)} ${2 * Math.PI * 23}`}
                />
            </svg>

            {/* 5. Center Seconds String */}
            <div style={{
                position: 'absolute',
                left: '120px',
                top: '155px',
                transform: 'translateX(-50%)',
                fontSize: '15px',
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                {seconds.toString().padStart(2, '0')}
            </div>

            {/* 6. Mini Time Display (Tilted strings) */}
            {/* Hours HH */}
            <div style={{
                position: 'absolute', left: '32px', top: '98px',
                fontSize: '10px', fontWeight: 'bold',
                transform: 'rotate(-55.8deg)', // -0.974 rad
                transformOrigin: 'left top'
            }}>
                {time.getHours().toString().padStart(2, '0')}
            </div>

            {/* Minutes MM */}
            <div style={{
                position: 'absolute', left: '40px', top: '86px',
                fontSize: '10px', fontWeight: 'bold',
                transform: 'rotate(-43deg)', // -0.75 rad
                transformOrigin: 'left top'
            }}>
                : {minutes.toString().padStart(2, '0')}
            </div>
        </div>
    );
};

export default Jarvis3rdGig;
