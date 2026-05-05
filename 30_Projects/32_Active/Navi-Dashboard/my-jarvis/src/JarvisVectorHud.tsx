import React from 'react';
import JarvisHudRing from './JarvisHudRing';

/**
 * JarvisVectorHud - Data-driven HUD renderer.
 * Takes a JSON configuration (from HudLab) and renders a complex multi-layer vector HUD.
 */

interface HudConfig {
    global: {
        centerX: number;
        centerY: number;
    };
    layers: any[];
}

interface Props {
    config: HudConfig;
    size?: number;
}

const JarvisVectorHud: React.FC<Props> = ({ config, size = 1000 }) => {
    if (!config || !config.layers) return null;

    return (
        <div style={{ position: 'absolute', width: `${size}px`, height: `${size}px`, pointerEvents: 'none' }}>
            {config.layers.map((l, index) => (
                <JarvisHudRing
                    key={index}
                    cx={config.global.centerX}
                    cy={config.global.centerY}
                    radius={l.radius}
                    strokeWidth={l.strokeWidth}
                    startAngle={l.startAngle}
                    endAngle={l.endAngle}
                    segments={l.segments}
                    gap={l.gap}
                    color={l.color}
                    rotationSpeed={l.rotationSpeed}
                    reverse={l.reverse}
                    opacity={l.opacity}
                    size={size}
                />
            ))}
        </div>
    );
};

export default JarvisVectorHud;
