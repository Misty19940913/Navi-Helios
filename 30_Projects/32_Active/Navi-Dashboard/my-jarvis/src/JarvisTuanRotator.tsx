import React from 'react';

/**
 * JarvisTuanRotator - Individual Multi-Pivot Calibration
 * Each layer uses its own detected center of gravity for rotation
 * to eliminate staggered wobble.
 */

const ASSET_PATH = "/Skins/Tuan/rotaters";

const JarvisTuanRotator: React.FC = () => {
    // 5 custom layers with their precisely detected centers of gravity
    const layers = [
        { id: 'f1', file: 'frame1.png', speed: '12s', rev: false, op: 1.0, cx: 305.73, cy: 306.82 },
        { id: 'f2', file: 'frame2.png', speed: '18s', rev: true,  op: 0.9, cx: 288.59, cy: 329.30 },
        { id: 'f3', file: 'frame3.png', speed: '25s', rev: false, op: 0.8, cx: 277.45, cy: 330.36 },
        { id: 'f4', file: 'frame4.png', speed: '35s', rev: true,  op: 0.7, cx: 286.70, cy: 334.99 },
        { id: 'f5', file: 'frame5.png', speed: '50s', rev: false, op: 0.6, cx: 317.35, cy: 302.61 },
    ];

    return (
        <div style={{
            position: 'relative', 
            width: '600px', 
            height: '600px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'transparent'
        }}>
            <style>{`
                @keyframes tuan-rotate-ccw {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes tuan-rotate-cw {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .rotator-entity {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 600px 600px;
                    pointer-events: none;
                    will-change: transform;
                }
            `}</style>

            {layers.map((layer) => (
                <div
                    key={layer.id}
                    className="rotator-entity"
                    style={{
                        backgroundImage: `url("${ASSET_PATH}/${layer.file}")`,
                        zIndex: 10,
                        opacity: layer.op,
                        // Apply INDIVIDUAL center for each layer to fix the wobble
                        transformOrigin: `${layer.cx}px ${layer.cy}px`,
                        animation: `${layer.rev ? 'tuan-rotate-cw' : 'tuan-rotate-ccw'} ${layer.speed} linear infinite`
                    }}
                />
            ))}

            {/* Central Glow Glow */}
            <div style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)',
                zIndex: 5,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default JarvisTuanRotator;
