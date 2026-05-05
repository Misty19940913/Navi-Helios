import React, { useState } from 'react';
import JarvisHudRing from './JarvisHudRing';
import JarvisHudShape from './JarvisHudShape';
import JarvisHudPath from './JarvisHudPath';

// Data Imports
import structureBG from './data/structure_BG.json';
import coreData from './data/core_data.json';
import coreButton from './data/core_button.json';
import coreTime from './data/core_time.json';
import coreHold from './data/core_hold_shape.json';
import coreRotate from './data/core_rotate_shape.json';

/**
 * JarvisHudMasterLab V1.1
 * The ultimate assembly platform for ALL HUD components.
 */
const JarvisHudMasterLab: React.FC = () => {
    // Collect all core-related layers into one manageable array
    const allCoreLayers = [
        ...coreData.layers,
        ...coreButton.layers,
        ...coreTime.layers,
        ...coreHold.layers,
        ...coreRotate.layers
    ];
    
    const [linearLayers] = useState<any[]>(structureBG.layers);
    const [circularLayers] = useState<any[]>(allCoreLayers);

    // Global Adjustment States (Baked Calibration)
    const [coreOffsetX, setCoreOffsetX] = useState(0);
    const [coreOffsetY, setCoreOffsetY] = useState(20);
    const [coreScale, setCoreScale] = useState(0.6);
    
    const [wingDeployOffset, setWingDeployOffset] = useState(0); // 0 = Idle, higher = Deployed
    const [bgOpacity, setBgOpacity] = useState(0.3);
    const [zoom, setZoom] = useState(1.2);

    const canvasWidth = 1024;
    const canvasHeight = 585;

    // Helper: Micro-adjustments
    const adj = (val: number, set: (v: number) => void, amount: number) => set(+(val + amount).toFixed(2));

    const sectionStyle = { marginBottom: '15px', background: '#0a141d', padding: '12px', borderRadius: '4px', border: '1px solid #1a2a35' };
    const ctrlRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '6px' };
    const microBtn = { padding: '2px 8px', fontSize: '10px', background: '#222', border: '1px solid #444', color: '#00D4FF', cursor: 'pointer' };
    const btnStyle = { width: '100%', padding: '10px', background: '#00D4FF', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '5px' };

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#050a0f', color: '#fff', fontFamily: 'monospace' }}>
            
            {/* Control Sidebar */}
            <div style={{ width: '350px', height: '100%', borderRight: '1px solid #1a2a35', padding: '20px', overflowY: 'auto' }}>
                <h2 style={{ fontSize: '14px', borderBottom: '1px solid #00D4FF', paddingBottom: '10px', color: '#00D4FF' }}>MASTER CALIBRATION</h2>
                
                {/* 1. Core Relative Position */}
                <div style={sectionStyle}>
                    <h3 style={{ fontSize: '11px', color: '#ffce00', marginTop: 0 }}>核心組件定位 (CORE TRANSFORM)</h3>
                    <div style={ctrlRow}>
                        <label>Offset X:</label>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => adj(coreOffsetX, setCoreOffsetX, -5)} style={microBtn}>-5</button>
                            <span style={{ minWidth: '30px', textAlign: 'center', color: '#00FF44' }}>{coreOffsetX}</span>
                            <button onClick={() => adj(coreOffsetX, setCoreOffsetX, 5)} style={microBtn}>+5</button>
                        </div>
                    </div>
                    <div style={ctrlRow}>
                        <label>Offset Y:</label>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => adj(coreOffsetY, setCoreOffsetY, -5)} style={microBtn}>-5</button>
                            <span style={{ minWidth: '30px', textAlign: 'center', color: '#00FF44' }}>{coreOffsetY}</span>
                            <button onClick={() => adj(coreOffsetY, setCoreOffsetY, 5)} style={microBtn}>+5</button>
                        </div>
                    </div>
                    <div style={ctrlRow}>
                        <label>Group Scale:</label>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => adj(coreScale, setCoreScale, -0.05)} style={microBtn}>-</button>
                            <span style={{ minWidth: '30px', textAlign: 'center', color: '#00FF44' }}>{coreScale}</span>
                            <button onClick={() => adj(coreScale, setCoreScale, 0.05)} style={microBtn}>+</button>
                        </div>
                    </div>
                </div>

                {/* 2. Kinetic Preview (The sliding wing test) */}
                <div style={sectionStyle}>
                    <h3 style={{ fontSize: '11px', color: '#ff6400', marginTop: 0 }}>動力學測試 (KINETIC DEPLOY)</h3>
                    <div style={ctrlRow}>
                        <label>Wing Deployment:</label>
                        <span style={{ color: '#ff6400' }}>{wingDeployOffset}px</span>
                    </div>
                    <input 
                        type="range" min="0" max="300" 
                        value={wingDeployOffset} 
                        onChange={e => setWingDeployOffset(Number(e.target.value))} 
                        style={{ width: '100%', accentColor: '#ff6400' }} 
                    />
                    <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                        <button onClick={() => setWingDeployOffset(0)} style={{...microBtn, flex: 1}}>IDLE (待機)</button>
                        <button onClick={() => setWingDeployOffset(250)} style={{...microBtn, flex: 1, color: '#ff6400'}}>DEPLOY (展開)</button>
                    </div>
                </div>

                {/* 3. Global Preview Settings */}
                <div style={sectionStyle}>
                    <h3 style={{ fontSize: '11px', color: '#888', marginTop: 0 }}>預覽設定</h3>
                    <div style={ctrlRow}>
                        <label>背景透明度:</label>
                        <input type="range" min="0" max="1" step="0.1" value={bgOpacity} onChange={e => setBgOpacity(Number(e.target.value))} style={{ width: '100%' }} />
                    </div>
                    <div style={ctrlRow}>
                        <label>視窗縮放:</label>
                        <button onClick={() => adj(zoom, setZoom, -0.1)} style={microBtn}>-</button>
                        <button onClick={() => adj(zoom, setZoom, 0.1)} style={microBtn}>+</button>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button onClick={() => {
                        console.log("FINAL PARAMS:", { coreOffsetX, coreOffsetY, coreScale, wingDeployOffset });
                        alert("對位參數已記錄，查看 Console 取得數值");
                    }} style={btnStyle}>儲存校準參數</button>
                </div>
            </div>

            {/* Viewport Render */}
            <div style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ 
                    position: 'relative', 
                    width: `${canvasWidth}px`, 
                    height: `${canvasHeight}px`, 
                    background: '#0a141d', 
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    border: '1px solid #00D4FF22',
                    boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                }}>
                    {/* Background Ref (Optional, but useful) */}
                    <img src="/ref_bg_dark.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: bgOpacity, pointerEvents: 'none' }} />

                    {/* --- LAYER 1: LINEAR CHASSIS (Background Frame) --- */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                        {linearLayers.map(l => {
                            // DYNAMIC INVERSE RESET: Move to center when idle (wingDeployOffset = 0)
                            // return to original JSON when fully deployed (wingDeployOffset = 250)
                            const maxOffset = 250; 
                            const currentPullback = maxOffset - wingDeployOffset;
                            
                            let finalPoints = [...l.points];
                            if (l.id.includes('wing-L')) {
                                finalPoints = l.points.map((p: any) => ({ ...p, x: p.x + currentPullback }));
                            } else if (l.id.includes('wing-R')) {
                                finalPoints = l.points.map((p: any) => ({ ...p, x: p.x - currentPullback }));
                            }

                            return (
                                <div key={l.id} style={{ position: 'absolute', inset: 0 }}>
                                    <JarvisHudPath {...l} points={finalPoints} viewSize={canvasWidth} />
                                </div>
                            );
                        })}
                    </div>

                    {/* --- LAYER 2: CIRCULAR CORE (Moving Group) --- */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        zIndex: 20, 
                        transform: `translate(${coreOffsetX}px, ${coreOffsetY}px) scale(${coreScale})`,
                        transformOrigin: '512px 292.5px', // Standard Center
                        transition: '0.1s ease-out'
                    }}>
                        {circularLayers.map((l, idx) => {
                            const cx = canvasWidth/2;
                            const cy = canvasHeight/2;
                            const key = `${l.id || 'layer'}-${idx}`;
                            
                            if (l.type === 'ring') {
                                // Important: Calculate innerRadius if not explicitly in JSON
                                const iRad = l.innerRadius || (l.radius - (l.strokeWidth || 2));
                                return <JarvisHudRing key={key} {...l} cx={cx} cy={cy} innerRadius={iRad} size={canvasWidth} />;
                            }
                            if (l.type === 'shape') {
                                return <JarvisHudShape key={key} {...l} cx={cx} cy={cy} size={canvasWidth} />;
                            }
                            return null;
                        })}
                    </div>

                    {/* --- LAYER 3: DYNAMIC OVERLAYS (Scanlines/Glow) --- */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
                </div>

                {/* Status Indicator */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '10px', color: '#00D4FF66' }}>
                    [ SYSTEM_CALIBRATION_MODE // ACTIVE ]<br/>
                    CORE_X: {coreOffsetX} | CORE_Y: {coreOffsetY} | SCALE: {coreScale}
                </div>
            </div>
        </div>
    );
};

export default JarvisHudMasterLab;
