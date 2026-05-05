import React from 'react';

/**
 * JarvisHudRing V8.0 - Advanced Array Engine
 * Introduced arrayMode: 'orbital' | 'stacked'.
 * 'stacked' allows segments to pile up outwards at the same angle.
 */

interface HudRingProps {
    cx: number;
    cy: number;
    radius: number;
    innerRadius: number;
    startAngle?: number;
    endAngle?: number;
    segments?: number;
    gap?: number;
    radiusStep?: number;
    arrayMode?: 'orbital' | 'stacked'; // New: Control distribution
    color?: string;
    rotationSpeed?: string;
    pulseSpeed?: string;
    pulseRange?: number;
    reverse?: boolean;
    opacity?: number;
    size?: number;
    startSkew?: number;
    endSkew?: number;
    fillMode?: 'solid' | 'outline';
    hideEdges?: [boolean, boolean, boolean, boolean];
}

const JarvisHudRing: React.FC<HudRingProps> = ({
    cx, cy,
    radius,
    innerRadius,
    startAngle = 0,
    endAngle = 360,
    segments = 1,
    gap = 0,
    radiusStep = 0,
    arrayMode = 'orbital', // Default: Orbital (follows rotation)
    color = "#00D4FF",
    rotationSpeed = "0s",
    pulseSpeed = "0s",
    pulseRange = 0,
    reverse = false,
    opacity = 1,
    size = 1000,
    startSkew = 0,
    endSkew = 0,
    fillMode = 'solid',
    hideEdges = [false, false, false, false]
}) => {

    const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (r * Math.cos(angleInRadians)),
            y: centerY + (r * Math.sin(angleInRadians))
        };
    };

    const createPath = (x: number, y: number, innerR: number, outerR: number, startDeg: number, endDeg: number, sSkew: number, eSkew: number) => {
        const p1 = polarToCartesian(x, y, outerR, startDeg);
        const p2 = polarToCartesian(x, y, outerR, endDeg);
        const p3 = polarToCartesian(x, y, innerR, endDeg + eSkew);
        const p4 = polarToCartesian(x, y, innerR, startDeg + sSkew);
        const largeArcFlag = endDeg - startDeg <= 180 ? "0" : "1";

        if (fillMode === 'solid') {
            return [
                "M", p1.x, p1.y,
                "A", outerR, outerR, 0, largeArcFlag, 1, p2.x, p2.y,
                "L", p3.x, p3.y,
                "A", innerR, innerR, 0, largeArcFlag, 0, p4.x, p4.y,
                "Z"
            ].join(" ");
        } else {
            const [hOuter, hRight, hInner, hLeft] = hideEdges;
            let path = `M ${p1.x} ${p1.y}`;
            if (!hOuter) path += ` A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`;
            else path += ` M ${p2.x} ${p2.y}`;
            if (!hRight) path += ` L ${p3.x} ${p3.y}`;
            else path += ` M ${p3.x} ${p3.y}`;
            if (!hInner) path += ` A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}`;
            else path += ` M ${p4.x} ${p4.y}`;
            if (!hLeft) path += ` L ${p1.x} ${p1.y}`;
            return path;
        }
    };

    const arcLength = (endAngle - startAngle);
    const isFullCircle = (Math.abs(arcLength) >= 360 && segments === 1);
    const segmentLength = isFullCircle ? 360 : (arcLength - (segments - 1) * gap) / segments;
    const paths = [];

    if (isFullCircle) {
        const half = 180;
        paths.push(createPath(cx, cy, innerRadius, radius, startAngle, startAngle + half, startSkew, 0));
        paths.push(createPath(cx, cy, innerRadius, radius, startAngle + half, startAngle + 360, 0, endSkew));
    } else {
        for (let i = 0; i < segments; i++) {
            // ORBITAL: Angle increments
            // STACKED: Angle stays fixed, Radius increments
            const s = (arrayMode === 'stacked') ? startAngle : startAngle + i * (segmentLength + gap);
            const e = (arrayMode === 'stacked') ? endAngle : s + segmentLength;
            
            const currentR = radius + (i * radiusStep);
            const currentInnerR = innerRadius + (i * radiusStep);
            paths.push(createPath(cx, cy, currentInnerR, currentR, s, e, startSkew, endSkew));
        }
    }

    const layerStyle: any = {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
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
            <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
                {paths.map((d, i) => (
                    <path key={i} d={d} fill={fillMode === 'solid' ? color : 'none'} stroke={fillMode === 'outline' ? color : 'none'} strokeWidth={fillMode === 'outline' ? 1.5 : 0} opacity={opacity} />
                ))}
            </svg>
        </div>
    );
};

export default JarvisHudRing;
