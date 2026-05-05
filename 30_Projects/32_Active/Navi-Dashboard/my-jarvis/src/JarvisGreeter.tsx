import React, { useState, useEffect } from 'react';

/**
 * JarvisGreeter Component
 * Based on Suvi_Jarvis_Rainmeter \ Greeter
 * A simple greeting module that changes with the time of day.
 */

const JarvisGreeter: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const userName = "SYSTEM OPERATOR"; // Placeholder for #username#

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const hour = currentTime.getHours();
    
    let greeting = "GREETINGS";
    let iconColor = "#00d4ff";
    let Icon = null;

    if (hour >= 4 && hour < 12) {
        greeting = "GOOD MORNING";
        iconColor = "#FFD700"; // Golden Morning
        Icon = (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke={iconColor} strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
        );
    } else if (hour >= 12 && hour < 18) {
        greeting = "GOOD AFTERNOON";
        iconColor = "#ff6400"; // Bright Afternoon
        Icon = (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke={iconColor} strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M4.22 4.22l1.42 1.42M1 12h2M4.22 19.78l1.42-1.42" />
                <path d="M12 21v2M18.36 18.36l1.42 1.42M21 12h2M18.36 5.64l1.42-1.42" opacity="0.3" />
            </svg>
        );
    } else if (hour >= 18 && hour < 24) {
        greeting = "GOOD EVENING";
        iconColor = "#ff4081"; // Sunset Evening
        Icon = (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke={iconColor} strokeWidth="2" fill="none">
                <path d="M17 18a5 5 0 00-10 0" />
                <path d="M12 2v2M4.22 4.22l1.42 1.42M1 12h2M23 12h-2M19.78 4.22l-1.42 1.42" />
            </svg>
        );
    } else {
        greeting = "GOOD NIGHT";
        iconColor = "#9c27b0"; // Deep Night
        Icon = (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke={iconColor} strokeWidth="2" fill="none">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
        );
    }

    return (
        <div style={{
            position: 'relative',
            width: '250px',
            height: '150px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            borderLeft: `4px solid ${iconColor}`,
            padding: '10px'
        }}>
            <div style={{ marginBottom: '10px' }}>
                {Icon}
            </div>
            
            <div style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '2px',
                marginBottom: '5px'
            }}>
                {greeting},
            </div>

            <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                color: iconColor,
                textTransform: 'uppercase'
            }}>
                {userName}
            </div>
        </div>
    );
};

export default JarvisGreeter;
