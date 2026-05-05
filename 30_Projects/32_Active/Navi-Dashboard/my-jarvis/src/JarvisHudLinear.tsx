import React from 'react';

/**
 * JarvisHudLinear V1.0 - The Linear Engine
 * Supports Horizontal/Vertical arrays, progress bars, and custom angled lines.
 */

interface HudLinearProps {
    x: number;
    y: number;
    width?: number;
    height?: number;
    direction?: number; // Angle (0 = Horizontal Right, 90 = Vertical Down)
    segments?: number;
    gap?: number;
    type?: 'bar' | 'shape' | 'path';
    progress?: number;   // 0 to 1
    color?: string;
    iconUrl?: string;
    sides?: number;      // For shape type
    opacity?: number;
    pulseSpeed?: string;
    pulseRange?: number;
    viewSize?: number;
}

const JarvisHudLinear: React.FC<HudLinearProps> = ({
    x, y,
    width = 100,
    height = 5,
    direction = 0,
    segments = 1,
    gap = 2,
    type = 'bar' as any,
    progress = 1,
    color = "#00D4FF",
    iconUrl = "",
    sides = 4,
    opacity = 1,
    pulseSpeed = "0s",
    pulseRange = 0,
    viewSize = 1000
}) => {

    const rad = (direction * Math.PI) / 180;
    
    // For shape arrays, calculate positions
    const renderShapes = () => {
        const items = [];
        for (let i = 0; i < segments; i++) {
            const offset = i * ( (direction === 0 || direction === 180 ? width : height) + gap );
            const tx = x + offset * Math.cos(rad);
            const ty = y + offset * Math.sin(rad);

            if (iconUrl) {
                items.push(
                    <image key={i} href={iconUrl} x={-width/2} y={-height/2} width={width} height={height} transform={`translate(${tx},${ty}) rotate(${direction})`} style={{ opacity }} />
                );
            } else if (sides === 1) {
                items.push(
                    <line key={i} x1={-width/2} y1="0" x2={width/2} y2="0" stroke={color} strokeWidth={height} transform={`translate(${tx},${ty}) rotate(${direction})`} />
                );
            } else {
                const pts = [];
                for (let s = 0; s < sides; s++) {
                    const pRad = (s * 2 * Math.PI / sides) - Math.PI / 2;
                    const px = (width / 2) * Math.cos(pRad);
                    const py = (height / 2) * Math.sin(pRad);
                    pts.push(`${px},${py}`);
                }
                items.push(
                    <polygon key={i} points={pts.join(" ")} fill={color} transform={`translate(${tx},${ty}) rotate(${direction})`} />
                );
            }
        }
        return items;
    };

    const renderBar = () => {
        const barWidth = width * progress;
        return (
            <rect 
                x={0} y={-height/2} 
                width={barWidth} height={height} 
                fill={color} 
                transform={`translate(${x},${y}) rotate(${direction})`} 
            />
        );
    };

    const layerStyle: any = {
        position: 'absolute',
        width: `${viewSize}px`,
        height: `${viewSize}px`,
        pointerEvents: 'none',
        '--pulse-scale': 1 + pulseRange,
        animation: pulseSpeed !== "0s" ? `jarvis-radial-pulse ${pulseSpeed} ease-in-out infinite` : ''
    };

    return (
        <div style={layerStyle}>
            <svg width="100%" height="100%" viewBox={`0 0 ${viewSize} ${viewSize}`}>
                <g opacity={opacity}>
                    {type === 'bar' ? renderBar() : renderShapes()}
                </g>
            </svg>
        </div>
    );
};

export default JarvisHudLinear;
