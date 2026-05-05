import React, { useState, useEffect } from 'react';

/**
 * JarvisTuanSliders Component
 * A 161-frame bitmap animation for the curved sliders/bars.
 * This is meant to be overlaid on TimeBG.png
 */

const JarvisTuanSliders: React.FC = () => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        // Match the 50ms update from Tuan's INI
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % 161);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // The sprite sheet is 96600 x 600 px (161 frames of 600x600)
    return (
        <div style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            backgroundImage: 'url("/Skins/Tuan/sliders/sliders.png")',
            backgroundPosition: `-${frame * 600}px 0px`,
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            // Applying a blue tint filter to match the HUB's Blue theme
            // Hue-rotate from Red (~0deg) to Blue (~200deg)
            filter: 'hue-rotate(200deg) brightness(1.2) contrast(1.2)',
            mixBlendMode: 'screen',
            zIndex: 2 // Sit above background but below clock text
        }} />
    );
};

export default JarvisTuanSliders;
