import React, { useState } from 'react';
import JarvisHudLinear from './JarvisHudLinear';
import JarvisHudPath from './JarvisHudPath';
import JarvisHudRing from './JarvisHudRing';
import JarvisHudShape from './JarvisHudShape';
import testRefData from './data/core_hold_shape.json';

/**
 * JarvisHudLinearLab V1.0
 * Dedicated environment for Horizontal/Vertical/Linear HUD components.
 */

interface PathPoint {
    x: number;
    y: number;
}

interface PathLayer {
    id: string;
    type: 'path';
    points: PathPoint[];
    cornerRadius: number;
    strokeWidth: number;
    dashArray: string;
    flowSpeed: string;
    color: string;
    opacity: number;
}

const JarvisHudLinearLab: React.FC = () => {
    const [layers, setLayers] = useState<PathLayer[]>([
        // --- 1. 頂部梯形主框架 (Header Assembly) ---
        { id: 'top-1', type: 'path', points: [{x:350, y:100}, {x:480, y:100}, {x:512, y:75}, {x:544, y:100}, {x:674, y:100}], color: '#00D4FF', cornerRadius: 5, strokeWidth: 2, dashArray: '', flowSpeed: '0s', opacity: 1 },
        { id: 'top-2', type: 'path', points: [{x:380, y:60}, {x:644, y:60}], color: '#00D4FF', cornerRadius: 0, strokeWidth: 0.5, dashArray: '2,8', flowSpeed: '2s', opacity: 0.6 },
        
        // --- 2. 底部支撐底座 (Footer Assembly) ---
        { id: 'bot-1', type: 'path', points: [{x:350, y:485}, {x:480, y:485}, {x:512, y:510}, {x:544, y:485}, {x:674, y:485}], color: '#00D4FF', cornerRadius: 5, strokeWidth: 2, dashArray: '', flowSpeed: '0s', opacity: 1 },
        
        // --- 3. 左側大型機翼括號 (Left Wing Bracket) ---
        { id: 'wing-L1', type: 'path', points: [{x:250, y:150}, {x:200, y:150}, {x:200, y:435}, {x:250, y:435}], color: '#00D4FF', cornerRadius: 15, strokeWidth: 2.5, dashArray: '', flowSpeed: '0s', opacity: 1 },
        { id: 'wing-L2', type: 'path', points: [{x:190, y:200}, {x:190, y:385}], color: '#FF6400', cornerRadius: 0, strokeWidth: 1.5, dashArray: '2,5', flowSpeed: '0.5s', opacity: 0.8 },
        
        // --- 4. 右側大型機翼括號 (Right Wing Bracket) ---
        { id: 'wing-R1', type: 'path', points: [{x:774, y:150}, {x:824, y:150}, {x:824, y:435}, {x:774, y:435}], color: '#00D4FF', cornerRadius: 15, strokeWidth: 2.5, dashArray: '', flowSpeed: '0s', opacity: 1 },
        { id: 'wing-R2', type: 'path', points: [{x:834, y:200}, {x:834, y:385}], color: '#FF6400', cornerRadius: 0, strokeWidth: 1.5, dashArray: '2,5', flowSpeed: '0.5s', opacity: 0.8 },

        // --- 5. 對角科技動力傳輸線 (Diagonal Connectors) ---
        { id: 'diag-TL', type: 'path', points: [{x:350, y:150}, {x:420, y:220}], color: '#00D4FF', cornerRadius: 0, strokeWidth: 1, dashArray: '4,4', flowSpeed: '1s', opacity: 0.5 },
        { id: 'diag-TR', type: 'path', points: [{x:674, y:150}, {x:604, y:220}], color: '#00D4FF', cornerRadius: 0, strokeWidth: 1, dashArray: '4,4', flowSpeed: '1s', opacity: 0.5 },
        { id: 'diag-BL', type: 'path', points: [{x:350, y:435}, {x:420, y:365}], color: '#00D4FF', cornerRadius: 0, strokeWidth: 1, dashArray: '4,4', flowSpeed: '1s', opacity: 0.5 },
        { id: 'diag-BR', type: 'path', points: [{x:674, y:435}, {x:604, y:365}], color: '#00D4FF', cornerRadius: 0, strokeWidth: 1, dashArray: '4,4', flowSpeed: '1s', opacity: 0.5 },

        // --- 6. 中心十字核心 (Center Core Reticles) ---
        { id: 'core-C1', type: 'path', points: [{x:482, y:292}, {x:542, y:292}], color: '#FFFFFF', cornerRadius: 0, strokeWidth: 1, dashArray: '2,2', flowSpeed: '0s', opacity: 0.6 },
        { id: 'core-C2', type: 'path', points: [{x:512, y:262}, {x:512, y:322}], color: '#FFFFFF', cornerRadius: 0, strokeWidth: 1, dashArray: '2,2', flowSpeed: '0s', opacity: 0.6 }
    ]);
    const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
    const [importText, setImportText] = useState('');
    const [bgUrl, setBgUrl] = useState("/ref_bg_dark.jpg");
    const [bgOpacity, setBgOpacity] = useState(0.35); // 🚩 🚩 全新透明度控制
    const [zoom, setZoom] = useState(1.4);
    const [viewPanX, setViewPanX] = useState(0);
    const [viewPanY, setViewPanY] = useState(0);
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
    const [canvasWidth, setCanvasWidth] = useState(1024); // 🚩 遵照圓圖比例
    const [canvasHeight, setCanvasHeight] = useState(585); 
    const [activeFrame, setActiveFrame] = useState<{w: number, h: number} | null>(null);
    const [refData, setRefData] = useState<{ layers: any[], global?: any }>(testRefData); // 🚩 預設載入
    const [refImportText, setRefImportText] = useState('');
    const [refScale, setRefScale] = useState(1.0); // 🚩 🚩 全新縮放功能

    const commonFrames = [
        { name: '360x240 (HUD)', w: 360, h: 240 },
        { name: '640x480 (STD)', w: 640, h: 480 },
        { name: '1280x720 (HD)', w: 1280, h: 720 }
    ];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Calculate raw X,Y within the space, considering zoom
        const rawX = (e.clientX - rect.left) / zoom;
        const rawY = (e.clientY - rect.top) / zoom;
        setMouseCoords({ x: Math.round(rawX), y: Math.round(rawY) });
    };

    const addLayer = () => {
        const newLayer: PathLayer = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'path',
            points: [{x: 412, y: 292}, {x: 612, y: 292}],
            cornerRadius: 10,
            strokeWidth: 2,
            dashArray: "",
            flowSpeed: "0s",
            color: '#00D4FF',
            opacity: 1
        };
        setLayers([...layers, newLayer]);
        setActiveLayerId(newLayer.id);
    };

    const updateLayer = (id: string, updates: Partial<PathLayer>) => {
        setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const adjustPoint = (layerId: string, ptIdx: number, axis: 'x' | 'y', amount: number) => {
        setLayers(layers.map(l => {
            if (l.id !== layerId) return l;
            const newPts = [...l.points];
            newPts[ptIdx] = { ...newPts[ptIdx], [axis]: newPts[ptIdx][axis] + amount };
            return { ...l, points: newPts };
        }));
    };

    const mirrorLayer = (id: string) => {
        const source = layers.find(l => l.id === id);
        if (!source) return;
        const centerX = canvasWidth / 2;
        const mirroredPts = source.points.map(p => ({
            x: centerX + (centerX - p.x),
            y: p.y
        })).reverse(); // 反轉順序以維持線條連貫感
        
        const newLayer: PathLayer = {
            ...source,
            id: Math.random().toString(36).substr(2, 9),
            points: mirroredPts
        };
        setLayers([...layers, newLayer]);
    };

    const activeLayer = layers.find(l => l.id === activeLayerId);

    const handleImport = () => {
        try {
            const data = JSON.parse(importText);
            if (data.layers) setLayers(data.layers.map((l: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                ...l
            })));
            if (data.global?.bgUrl) setBgUrl(data.global.bgUrl);
        } catch (e) { alert("JSON 格式錯誤"); }
    };

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#0a141d', color: '#fff', fontFamily: 'monospace' }}>
            {/* Global Animation Styles */}
            <style>{`
                @keyframes jarvis-radial-pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(var(--pulse-scale)); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
            `}</style>

            {/* Sidebar */}
            <div style={{ width: '380px', height: '100%', borderRight: '1px solid #00D4FF44', overflowY: 'auto', padding: '15px' }}>
                <h2 style={{ fontSize: '14px', borderBottom: '1px solid #00D4FF', paddingBottom: '5px', color: '#00D4FF' }}>LINEAR HUD LAB V1.0</h2>
                
                <div style={sectionStyle}>
                    <h2 style={{ fontSize: '11px', color: '#00D4FF' }}>全域設定GLOBAL</h2>
                    <div style={ctrlRow}>
                        <label>畫布寬度:</label>
                        <input type="number" value={canvasWidth} onChange={e => setCanvasWidth(Number(e.target.value))} style={numInputSmall} />
                    </div>
                    <div style={ctrlRow}>
                        <label>畫布高度:</label>
                        <input type="number" value={canvasHeight} onChange={e => setCanvasHeight(Number(e.target.value))} style={numInputSmall} />
                    </div>
                    <div style={ctrlRow}>
                        <label>背景圖網址:</label>
                        <input type="text" value={bgUrl} onChange={e => setBgUrl(e.target.value)} style={{...numInputSmall, width:'180px', textAlign:'left'}} />
                    </div>
                    <div style={ctrlRow}>
                        <label>背景透明度:</label>
                        <input type="number" step="0.05" value={bgOpacity} onChange={e => setBgOpacity(Number(e.target.value))} style={numInputSmall} />
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={bgOpacity} onChange={e => setBgOpacity(Number(e.target.value))} style={rangeStyle} />
                </div>

                <div style={sectionStyle}>
                    <h3 style={{fontSize:'10px', color:'#ff6400'}}>圓周參考資料 (Circular Reference)</h3>
                    <div style={{fontSize:'9px', color:'#ff6400', marginBottom:'4px'}}>
                        狀態: {refData.layers.length > 0 ? `已載入 ${refData.layers.length} 個圖層` : '未載入'}
                    </div>
                    <textarea 
                        value={refImportText} 
                        onChange={e => setRefImportText(e.target.value)} 
                        placeholder="在此貼上圓周模式生成的 JSON..." 
                        style={{width:'100%', height:'40px', background:'#000', color:'#ff6400', fontSize:'9px', border:'1px solid #ff640044'}} 
                    />
                    <button onClick={() => {
                        try {
                            const data = JSON.parse(refImportText);
                            if (data.layers) {
                                setRefData({ layers: data.layers, global: data.global });
                                console.log("Ref Data Loaded:", data);
                            } else {
                                alert("此 JSON 不含 layers 欄位");
                            }
                        } catch(e) { alert("JSON 格式錯誤，請檢查複製是否完整"); }
                    }} style={{...btnStyle, background:'#ff640044', color:'#ff6400', border:'1px solid #ff6400', marginTop:'5px'}}>
                        載入參考圖層
                    </button>
                    {refData.layers.length > 0 && (
                        <div style={{ marginTop: '8px', borderTop: '1px solid #ff640033', paddingTop: '8px' }}>
                            <div style={ctrlRow}>
                                <label style={{color:'#ff6400'}}>參考縮放 (Scale):</label>
                                <input type="number" step="0.05" value={refScale} onChange={e => setRefScale(Number(e.target.value))} style={{...numInputSmall, color:'#ff6400'}} />
                            </div>
                            <input type="range" min="0.1" max="5.0" step="0.05" value={refScale} onChange={e => setRefScale(Number(e.target.value))} style={{...rangeStyle, accentColor: '#ff6400'}} />
                            <button onClick={() => setRefData({ layers: [] })} style={{...microBtn, color:'#ff6400', border:'none', marginTop:'4px'}}>
                                清除參考 ({refData.layers.length})
                            </button>
                        </div>
                    )}
                </div>

                <div style={sectionStyle}>
                    <h3 style={{fontSize:'10px', color:'#00D4FF'}}>常用視窗預設框 (Resolution Frames)</h3>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'4px'}}>
                        {commonFrames.map(f => (
                            <button key={f.name} onClick={() => setActiveFrame(f)} style={{...microBtn, background: activeFrame?.name === f.name ? '#00D4FF44' : '#111'}}>
                                {f.name}
                            </button>
                        ))}
                        <button onClick={() => setActiveFrame(null)} style={{...microBtn, color:'#ff6400'}}>取消預設框</button>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <button onClick={addLayer} style={btnStyle}>+ 新增科技路徑 (Path)</button>
                </div>

                {activeLayer && (
                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 style={{ fontSize: '11px', color: '#ffce00', margin: 0 }}>編輯路徑 MASTER</h3>
                            <button onClick={() => mirrorLayer(activeLayer.id)} style={{...microBtn, background: '#ff6400', color: '#fff'}}>左右鏡像 MIRROR</button>
                        </div>
                        
                        <div style={{...subSection, borderColor: '#ffce00'}}>
                            <div style={{ fontSize: '10px', color: '#888', marginBottom: '8px' }}>座標點位控制 POINTS</div>
                            {activeLayer.points.map((pt, idx) => (
                                <div key={idx} style={{ marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '6px' }}>
                                    <div style={{ fontSize: '9px', color: '#aaa' }}>POINT {idx + 1}</div>
                                    <div style={ctrlRow}>
                                        <label>X:</label>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            <button onClick={() => adjustPoint(activeLayer.id, idx, 'x', -10)} style={microBtn}>-10</button>
                                            <button onClick={() => adjustPoint(activeLayer.id, idx, 'x', -1)} style={microBtn}>-1</button>
                                            <input type="number" value={pt.x} onChange={e => {
                                                const newPts = [...activeLayer.points];
                                                newPts[idx].x = Number(e.target.value);
                                                updateLayer(activeLayer.id, { points: newPts });
                                            }} style={numInputSmall} />
                                            <button onClick={() => adjustPoint(activeLayer.id, idx, 'x', 1)} style={microBtn}>+1</button>
                                            <button onClick={() => adjustPoint(activeLayer.id, idx, 'x', 10)} style={microBtn}>+10</button>
                                        </div>
                                    </div>
                                    <div style={ctrlRow}>
                                        <label>Y:</label>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            <button onClick={() => adjustPoint(activeLayer.id, idx, 'y', -10)} style={microBtn}>-10</button>
                                            <button onClick={() => adjustPoint(activeLayer.id, idx, 'y', -1)} style={microBtn}>-1</button>
                                            <input type="number" value={pt.y} onChange={e => {
                                                const newPts = [...activeLayer.points];
                                                newPts[idx].y = Number(e.target.value);
                                                updateLayer(activeLayer.id, { points: newPts });
                                            }} style={numInputSmall} />
                                            <button onClick={() => adjustPoint(activeLayer.id, idx, 'y', 1)} style={microBtn}>+1</button>
                                            <button onClick={() => adjustPoint(activeLayer.id, idx, 'y', 10)} style={microBtn}>+10</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => {
                                const last = activeLayer.points[activeLayer.points.length - 1] || { x: 512, y: 292 };
                                updateLayer(activeLayer.id, { points: [...activeLayer.points, { x: last.x + 40, y: last.y }] });
                            }} style={{...microBtn, width: '100%', marginTop: '5px'}}>+ 增加點位</button>

                            <div style={{...ctrlRow, marginTop:'10px'}}><label>圓角半徑:</label> <input type="number" value={activeLayer.cornerRadius} onChange={e => updateLayer(activeLayer.id, { cornerRadius: Number(e.target.value) })} style={numInputSmall} /></div>
                            <input type="range" min="0" max="100" value={activeLayer.cornerRadius} onChange={e => updateLayer(activeLayer.id, { cornerRadius: Number(e.target.value) })} style={rangeStyle} />

                            <div style={{...ctrlRow, marginTop:'4px'}}><label>線條粗細:</label> <input type="number" step="0.5" value={activeLayer.strokeWidth} onChange={e => updateLayer(activeLayer.id, { strokeWidth: Number(e.target.value) })} style={numInputSmall} /></div>
                            <input type="range" min="0.5" max="20" step="0.5" value={activeLayer.strokeWidth} onChange={e => updateLayer(activeLayer.id, { strokeWidth: Number(e.target.value) })} style={rangeStyle} />
                        </div>
                                
                                <div style={ctrlRow}><label>虛線設定 (Dash):</label> <input type="text" value={activeLayer.dashArray} onChange={e => updateLayer(activeLayer.id, { dashArray: e.target.value })} style={numInputSmall} /></div>
                                <div style={ctrlRow}><label>流速 (Flow):</label> <input type="text" value={activeLayer.flowSpeed} onChange={e => updateLayer(activeLayer.id, { flowSpeed: e.target.value })} style={numInputSmall} /></div>

                        <div style={ctrlRow}><label>顏色:</label> <input type="color" value={activeLayer.color} onChange={e => updateLayer(activeLayer.id, { color: e.target.value })} style={{width:'55px'}} /></div>
                        
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                           <button onClick={() => {
                               const dup = { ...activeLayer, id: Math.random().toString(36).substr(2, 9) };
                               setLayers([...layers, dup]);
                               setActiveLayerId(dup.id);
                           }} style={btnStyle}>複製圖層</button>
                           <button onClick={() => { setLayers(layers.filter(l => l.id !== activeLayerId)); setActiveLayerId(null); }} style={{...btnStyle, background:'#a33', color:'#fff'}}>刪除</button>
                        </div>
                    </div>
                )}

                <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#050a0f', padding: '5px', borderRadius: '4px', border: '1px solid #1a2a35' }}>
                    {layers.map(l => (
                        <div key={l.id} onClick={() => setActiveLayerId(l.id)} style={{ padding: '4px', cursor: 'pointer', borderLeft: l.id === activeLayerId ? '3px solid #00FF44' : '3px solid #1a2a35', fontSize: '10px', background: l.id === activeLayerId ? '#ffffff11' : 'transparent', marginBottom: '2px' }}>
                            #{l.id.slice(0, 3)} | {l.type.toUpperCase()} | X:{l.x} Y:{l.y}
                        </div>
                    ))}
                </div>

                <div style={sectionStyle}>
                    <h3 style={{fontSize:'10px'}}>匯入/匯出 JSON</h3>
                    <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="貼上 JSON..." style={{width:'100%', height:'80px', background:'#000', color:'#00FF44', fontSize:'10px', padding:'5px'}} />
                    <button onClick={handleImport} style={{...btnStyle, marginTop:'5px'}}>匯入資料</button>
                </div>
            </div>

            {/* Viewport */}
            <div style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', background: '#050a0f' }}>
                {/* Viewport Toolbar */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(10,20,29,0.85)', padding: '12px', border: '1px solid #00D4FF44', borderRadius:'8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button onClick={() => setZoom(prev => +(prev - 0.2).toFixed(1))} style={microBtn}>-</button>
                        <input type="range" min="0.5" max="10" step="0.1" value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ width: '80px' }} />
                        <button onClick={() => setZoom(prev => +(prev + 0.2).toFixed(1))} style={microBtn}>+</button>
                    </div>
                    <button onClick={() => { setViewPanX(0); setViewPanY(0); setZoom(2.7); }} style={microBtn}>重置視角</button>
                </div>

                <div style={{ width: '100%', height: 'calc(100% - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <div 
                        onMouseMove={handleMouseMove}
                        style={{ position: 'relative', width: `${canvasWidth}px`, height: `${canvasHeight}px`, transform: `scale(${zoom}) translate(${viewPanX/zoom}px, ${viewPanY/zoom}px)`, transformOrigin: 'center center', border: '1px solid #00D4FF22' }}>
                        <img src={bgUrl} alt="" style={{ position: 'absolute', opacity: bgOpacity, pointerEvents: 'none', left: 0, top: 0, width: `${canvasWidth}px`, height: `${canvasHeight}px`, transition: '0.2s' }} />
                        
                        {/* Center Guides (Aligned to Absolute Geometric Center) */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: `${canvasWidth}px`, height: `${canvasHeight}px`, pointerEvents: 'none', zIndex: 1 }}>
                            <line x1="0" y1={canvasHeight/2} x2={canvasWidth} y2={canvasHeight/2} stroke="#00D4FF11" strokeDasharray="5,5" />
                            <line x1={canvasWidth/2} y1="0" x2={canvasWidth/2} y2={canvasHeight} stroke="#00D4FF11" strokeDasharray="5,5" />
                            <circle cx={canvasWidth/2} cy={canvasHeight/2} r="5" fill="none" stroke="#FF6400" />
                            <text x={canvasWidth/2 + 10} y={canvasHeight/2 - 10} fill="#FF6400" fontSize="10">CENTRE ({canvasWidth/2},{canvasHeight/2})</text>
                            
                            {/* Outer Workspace Tech Borders */}
                            <path d={`M 0,20 L 0,0 L 20,0 M ${canvasWidth-20},0 L ${canvasWidth},0 L ${canvasWidth},20 M ${canvasWidth},${canvasHeight-20} L ${canvasWidth},${canvasHeight} L ${canvasWidth-20},${canvasHeight} M 20,${canvasHeight} L 0,${canvasHeight} L 0,${canvasHeight-20}`} fill="none" stroke="#00D4FF" strokeWidth="2" />
                        </svg>

                        {/* Coordinate Probe */}
                        <div style={{ position: 'absolute', left: mouseCoords.x + 15, top: mouseCoords.y + 15, color: '#00FF44', fontSize: '10px', background: '#000000AA', padding: '2px 5px', borderRadius: '3px', pointerEvents: 'none', zIndex: 100, border: '1px solid #00FF4444' }}>
                           X: {mouseCoords.x} | Y: {mouseCoords.y}
                        </div>

                        {/* Ghost Reference Layers (Polar) - CALIBRATED TO CENTER & SCALE */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', zIndex: 10 }}>
                            {refData.layers.map((l: any, idx: number) => {
                                const cx = canvasWidth / 2;
                                const cy = canvasHeight / 2;
                                // 使用 refScale 進行動態縮放
                                const sRad = (l.radius || 100) * refScale;
                                const sStroke = (l.strokeWidth || 2) * refScale;
                                const computedInner = sRad - sStroke;
                                
                                if (l.type === 'ring') {
                                    return <JarvisHudRing key={`ref-${idx}`} {...l} radius={sRad} strokeWidth={sStroke} cx={cx} cy={cy} innerRadius={computedInner} size={canvasWidth} opacity={1} fillMode="solid" />;
                                } else if (l.type === 'shape') {
                                    return <JarvisHudShape key={`ref-${idx}`} {...l} radius={sRad} strokeWidth={sStroke} cx={cx} cy={cy} size={canvasWidth} opacity={1} fillMode="solid" />;
                                }
                                return null;
                            })}
                        </div>

                        {layers.map(l => {
                            const isSelected = l.id === activeLayerId;
                            const selectionStyle: React.CSSProperties = isSelected ? { filter: 'drop-shadow(0 0 10px #FFFFFF) brightness(1.3)', zIndex: 50 } : {};
                            
                            return (
                                <div key={l.id} style={{ position: 'absolute', inset: 0, ...selectionStyle }}>
                                    <JarvisHudPath {...l} points={l.points || []} viewSize={canvasWidth} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer JSON Export */}
                <div style={{ height: '160px', background: '#02050a', borderTop: '2px solid #00D4FF', padding: '15px', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#00D4FF', fontWeight: 'bold' }}>JSON EXPORT CONFIG (LINEAR)</span>
                        <button onClick={() => { navigator.clipboard.writeText(JSON.stringify({ layers }, null, 2)); alert('JSON 已複製！'); }} style={{ ...microBtn, background: '#00FF44', color: '#000' }}>複製 JSON</button>
                    </div>
                    <pre style={{ margin: 0, color: '#00FF44', overflowY: 'auto', height: '100px', background: '#000', padding: '10px', fontSize: '10px' }}>
                        {JSON.stringify({ global: { bgUrl }, layers }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

const sectionStyle = { marginBottom: '10px', background: '#0a141d', padding: '10px', borderRadius: '4px', border: '1px solid #1a2a35' };
const subSection = { border: '1px solid #1a2a35', padding: '8px', borderRadius: '4px', margin: '6px 0' };
const ctrlRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '4px' };
const rangeStyle = { width: '100%', accentColor: '#00D4FF', margin: '4px 0' };
const btnStyle = { width: '100%', padding: '8px', background: '#00D4FF', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem', marginBottom: '5px' };
const microBtn = { padding: '2px 8px', fontSize: '10px', background: '#222', border: '1px solid #444', color: '#00D4FF', cursor: 'pointer' };
const numInputSmall: React.CSSProperties = { width: '55px', background: '#000', border: '1px solid #1a2a35', color: '#00FF44', fontSize: '10px', textAlign: 'center' };

export default JarvisHudLinearLab;
