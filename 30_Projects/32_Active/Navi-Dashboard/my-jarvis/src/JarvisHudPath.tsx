import React from 'react';

/**
 * JarvisHudPath V1.0 - The Connector Engine
 * Specialized for tech-styled lines with rounded corners and flow animations.
 */

interface Point {
    x: number;
    y: number;
}

interface HudPathProps {
    points: Point[];
    strokeWidth?: number;
    color?: string;
    cornerRadius?: number;
    dashArray?: string;
    flowSpeed?: string; // "0s" for static, e.g. "2s" for flow
    opacity?: number;
    viewSize?: number;
}

const JarvisHudPath: React.FC<HudPathProps> = ({
    points,
    strokeWidth = 1.5,
    color = "#00D4FF",
    cornerRadius = 5,
    dashArray = "",
    flowSpeed = "0s",
    opacity = 1,
    viewSize = 1000
}) => {
    
    // Helper to generate path with rounded corners
    const generateRoundedPath = (pts: Point[], radius: number) => {
        if (pts.length < 2) return "";
        if (radius <= 0) return `M ${pts.map(p => `${p.x},${p.y}`).join(" L ")}`;

        let path = `M ${pts[0].x},${pts[0].y}`;

        for (let i = 1; i < pts.length - 1; i++) {
            const p1 = pts[i - 1];
            const p2 = pts[i];
            const p3 = pts[i + 1];

            // Direct vectors
            const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
            const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

            // Lengths
            const d1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
            const d2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

            // Normalized
            const vn1 = { x: v1.x / d1, y: v1.y / d1 };
            const vn2 = { x: v2.x / d2, y: v2.y / d2 };

            const currentRadius = Math.min(radius, d1 / 2, d2 / 2);

            const startPoint = {
                x: p2.x + vn1.x * currentRadius,
                y: p2.y + vn1.y * currentRadius
            };
            const endPoint = {
                x: p2.x + vn2.x * currentRadius,
                y: p2.y + vn2.y * currentRadius
            };

            path += ` L ${startPoint.x},${startPoint.y} Q ${p2.x},${p2.y} ${endPoint.x},${endPoint.y}`;
        }

        path += ` L ${pts[pts.length - 1].x},${pts[pts.length - 1].y}`;
        return path;
    };

    const pathD = generateRoundedPath(points, cornerRadius);

    const layerStyle: any = {
        position: 'absolute',
        width: `${viewSize}px`,
        height: `${viewSize}px`,
        pointerEvents: 'none',
    };

    const flowAnim = flowSpeed !== "0s" ? `jarvis-path-flow ${flowSpeed} linear infinite` : 'none';

    return (
        <div style={layerStyle}>
            <style>{`
                @keyframes jarvis-path-flow {
                    from { stroke-dashoffset: 20; }
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
            <svg width="100%" height="100%" viewBox={`0 0 ${viewSize} ${viewSize}`}>
                <path 
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ 
                        opacity, 
                        animation: flowAnim
                    }}
                />
            </svg>
        </div>
    );
};

export default JarvisHudPath;
