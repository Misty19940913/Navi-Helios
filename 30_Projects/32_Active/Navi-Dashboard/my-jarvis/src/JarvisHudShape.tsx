import React from 'react';

/**
 * JarvisHudShape V9.0 - Advanced Array Engine
 * Introduced arrayMode: 'orbital' | 'stacked'.
 */

interface HudShapeProps {
    cx: number;
    cy: number;
    orbitRadius: number;
    orbitAngle?: number; 
    width?: number;
    height?: number;
    sides?: number;       
    count?: number;       
    gap?: number;         
    radiusStep?: number;  
    arrayMode?: 'orbital' | 'stacked'; // New
    color?: string;
    iconUrl?: string;
    rotation?: number;    
    rotationSpeed?: string;
    pulseSpeed?: string;  
    pulseRange?: number;  
    reverse?: boolean;
    opacity?: number;
    viewSize?: number;
}

const JarvisHudShape: React.FC<HudShapeProps> = ({
    cx, cy,
    orbitRadius,
    orbitAngle = 0,
    width = 10,
    height = 10,
    sides = 4,
    count = 1,
    gap = 0,
    radiusStep = 0,
    arrayMode = 'orbital',
    color = "#00FF44",
    iconUrl = "",
    rotation = 0,
    rotationSpeed = "0s",
    pulseSpeed = "0s",    
    pulseRange = 0,       
    reverse = false,
    opacity = 1,
    viewSize = 1000
}) => {

    const renderSingleShape = (angle: number, currentRadius: number, index: number) => {
        const rad = (angle - 90) * Math.PI / 180;
        const tx = cx + currentRadius * Math.cos(rad);
        const ty = cy + currentRadius * Math.sin(rad);
        const finalRotation = angle + rotation;

        if (iconUrl) {
            return (
                <image 
                    key={index}
                    href={iconUrl}
                    x={-width/2}
                    y={-height/2}
                    width={width}
                    height={height}
                    transform={`translate(${tx},${ty}) rotate(${finalRotation})`}
                    style={{ opacity }}
                />
            );
        }

        let points = "";
        if (sides <= 0) {
            points = `M -${width/2} 0 L ${width/2} 0 M 0 -${height/2} L 0 ${height/2}`;
            return (
                <path 
                    key={index}
                    d={points} 
                    stroke={color} 
                    strokeWidth="1.5"
                    transform={`translate(${tx},${ty}) rotate(${finalRotation})`}
                />
            );
        } else if (sides === 1) {
            return (
                <line 
                    key={index}
                    x1="0" y1={-height/2} x2="0" y2={height/2}
                    stroke={color}
                    strokeWidth={width}
                    transform={`translate(${tx},${ty}) rotate(${finalRotation})`}
                />
            );
        }

        const pts: string[] = [];
        for (let i = 0; i < sides; i++) {
            const pRad = (i * 2 * Math.PI / sides) - Math.PI / 2;
            const px = (width / 2) * Math.cos(pRad);
            const py = (height / 2) * Math.sin(pRad);
            pts.push(`${px},${py}`);
        }
        points = pts.join(" ");

        return (
            <polygon 
                key={index}
                points={points} 
                fill={color}
                transform={`translate(${tx},${ty}) rotate(${finalRotation})`}
            />
        );
    };

    const shapes = [];
    for (let i = 0; i < count; i++) {
        const currentAngle = (arrayMode === 'stacked') ? orbitAngle : orbitAngle + (i * gap);
        const currentRadius = orbitRadius + (i * radiusStep);
        shapes.push(renderSingleShape(currentAngle, currentRadius, i));
    }

    const layerStyle: any = {
        position: 'absolute',
        width: `${viewSize}px`,
        height: `${viewSize}px`,
        pointerEvents: 'none',
        transformOrigin: `${cx}px ${cy}px`,
        '--pulse-scale': 1 + pulseRange,
        animation: [
            rotationSpeed !== "0s" ? `${reverse ? 'jarvis-rotate-cw' : 'jarvis-rotate-ccw'} ${rotationSpeed} linear infinite` : '',
            pulseSpeed !== "0s" ? `jarvis-radial-pulse ${pulseSpeed} ease-in-out infinite` : ''
        ].filter(Boolean).join(', ')
    };

    return (
        <div style={layerStyle}>
            <svg width="100%" height="100%" viewBox={`0 0 ${viewSize} ${viewSize}`}>
                <g opacity={opacity}>{shapes}</g>
            </svg>
        </div>
    );
};

export default JarvisHudShape;
