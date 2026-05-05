import React, { useState, useEffect, useCallback } from 'react';
import JarvisHudRing from './JarvisHudRing';
import JarvisHudShape from './JarvisHudShape';

/**
 * JarvisHudLab V28.0 - Real-time Kinetic Preview
 * Global animation injection for instant rhythmic feedback.
 */

interface HudLayer {
    id: string;
    type: 'ring' | 'shape';
    radius: number;           
    strokeWidth: number;      
    startAngle: number;       
    endAngle: number;         
    segments: number;
    gap: number;
    color: string;
    rotationSpeed: string;    
    pulseSpeed: string;       
    pulseRange: number;       
    reverse: boolean;
    opacity: number;
    startSkew: number;
    endSkew: number;
    fillMode: 'solid' | 'outline';
    hideEdges: [boolean, boolean, boolean, boolean];
    sides?: number;           
    shapeWidth?: number;
    shapeHeight?: number;
    shapeRotation?: number;   
    radiusStep?: number;      // New: Radius Step
    arrayMode?: 'orbital' | 'stacked'; // New: Distribution Mode
    iconUrl?: string;
}

const JarvisHudLab: React.FC = () => {
    const [layers, setLayers] = useState<HudLayer[]>([
        { id: '1', type: 'ring', radius: 102.4, strokeWidth: 11, startAngle: 0, endAngle: 360, segments: 10, gap: 5, color: '#00D4FF', rotationSpeed: '10s', pulseSpeed: '2s', pulseRange: 0.05, reverse: false, opacity: 1, startSkew: 0, endSkew: 0, fillMode: 'solid', hideEdges: [false, false, false, false] }
    ]);
    const [activeLayerId, setActiveLayerId] = useState<string>('1');
    const activeLayer = layers.find(l => l.id === activeLayerId) || layers[0];
    const [isSkewLinked, setIsSkewLinked] = useState(false);
    const [centerX, setCenterX] = useState(429.37); 
    const [centerY, setCenterY] = useState(231.46);
    const [bgUrl, setBgUrl] = useState("/Preview_mark7.png");

    const [zoom, setZoom] = useState(2.7);
    const [viewPanX, setViewPanX] = useState(0); 
    const [viewPanY, setViewPanY] = useState(0); 

    const [isLocked, setIsLocked] = useState(false);
    const [importText, setImportText] = useState('');
    const [showImport, setShowImport] = useState(false);

    const updateActiveLayer = (updates: Partial<HudLayer>) => {
        let finalUpdates = { ...updates };
        if (isSkewLinked) {
            if (updates.startSkew !== undefined) finalUpdates.endSkew = -updates.startSkew;
            if (updates.endSkew !== undefined) finalUpdates.startSkew = -updates.endSkew;
        }
        setLayers(prev => prev.map(l => l.id === activeLayerId ? { ...l, ...finalUpdates } : l));
    };

    const toggleEdge = (idx: number) => {
        if (!activeLayer.hideEdges) return;
        const newEdges = [...activeLayer.hideEdges] as [boolean, boolean, boolean, boolean];
        newEdges[idx] = !newEdges[idx];
        updateActiveLayer({ hideEdges: newEdges });
    };

    const addLayer = (type: 'ring' | 'shape') => {
        const newId = Math.random().toString(36).substr(2, 9);
        const baseLayer: HudLayer = { 
            id: newId, type, radius: 100, strokeWidth: 5, startAngle: 0, endAngle: 360, segments: 1, gap: 0, color: type === 'ring' ? '#00D4FF' : '#00FF44', rotationSpeed: "0s", pulseSpeed: "0s", pulseRange: 0, reverse: false, opacity: 1, startSkew: 0, endSkew: 0, fillMode: 'solid', hideEdges: [false,false,false,false],
            sides: 4, shapeWidth: 10, shapeHeight: 10, shapeRotation: 0, iconUrl: ""
        };
        setLayers([...layers, baseLayer]);
        setActiveLayerId(newId);
    };

    const duplicateLayer = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setLayers([...layers, { ...activeLayer, id: newId }]);
        setActiveLayerId(newId);
    };

    const removeLayer = (id: string) => {
        if (layers.length > 1) {
            const filtered = layers.filter(l => l.id !== id);
            setLayers(filtered);
            setActiveLayerId(filtered[0].id);
        }
    };

    const handleImport = () => {
        try {
            const data = JSON.parse(importText);
            if (data.global) { 
                setCenterX(data.global.centerX ?? 500); 
                setCenterY(data.global.centerY ?? 500); 
                if (data.global.bgUrl) setBgUrl(data.global.bgUrl);
            }
            if (data.layers && Array.isArray(data.layers)) {
                const hydrated = data.layers.map((l: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    type: l.type || 'ring',
                    radius: l.radius ?? 100,
                    strokeWidth: l.strokeWidth ?? 5,
                    startAngle: l.startAngle ?? 0,
                    endAngle: l.endAngle ?? 360,
                    segments: l.segments ?? 1,
                    gap: l.gap ?? 0,
                    color: l.color || '#00D4FF',
                    rotationSpeed: l.rotationSpeed || '0s',
                    pulseSpeed: l.pulseSpeed || '0s',
                    pulseRange: l.pulseRange ?? 0,
                    reverse: l.reverse ?? false,
                    opacity: l.opacity ?? 1,
                    startSkew: l.startSkew ?? 0,
                    endSkew: l.endSkew ?? 0,
                    fillMode: l.fillMode || 'solid',
                    hideEdges: Array.isArray(l.hideEdges) ? l.hideEdges : [false, false, false, false],
                    sides: l.sides ?? 4,
                    shapeWidth: l.shapeWidth ?? l.shapeSize ?? 10,
                    shapeHeight: l.shapeHeight ?? l.shapeSize ?? 10,
                    shapeRotation: l.shapeRotation ?? 0,
                    radiusStep: l.radiusStep ?? 0,
                    arrayMode: l.arrayMode || 'orbital',
                    iconUrl: l.iconUrl || ""
                }));
                setLayers(hydrated);
                if (hydrated.length > 0) setActiveLayerId(hydrated[0].id);
            }
            setShowImport(false); setImportText('');
        } catch (e) { alert('JSON Error'); }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isLocked) return;
        const step = e.shiftKey ? 1 : 0.1;
        switch (e.key) {
            case 'ArrowUp': setCenterY(prev => +(prev - step).toFixed(2)); e.preventDefault(); break;
            case 'ArrowDown': setCenterY(prev => +(prev + step).toFixed(2)); e.preventDefault(); break;
            case 'ArrowLeft': setCenterX(prev => +(prev - step).toFixed(2)); e.preventDefault(); break;
            case 'ArrowRight': setCenterX(prev => +(prev + step).toFixed(2)); e.preventDefault(); break;
        }
    }, [isLocked]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#050a0f', color: '#a0c0d0', fontFamily: '"Microsoft JhengHei", monospace', overflow: 'hidden' }}>
            
            {/* INJECT ANIMATION STYLES */}
            <style>
                {`
                    @keyframes jarvis-rotate-ccw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes jarvis-rotate-cw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                    @keyframes jarvis-radial-pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(var(--pulse-scale)); }
                    }
                `}
            </style>

            <div style={{ width: '450px', flexShrink: 0, background: '#0a141d', padding: '15px', borderRight: '2px solid #00D4FF', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2 style={{ color: '#00D4FF', margin: 0, fontSize: '0.9rem' }}>HUD 律動設計器 v28.0</h2>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => setShowImport(!showImport)} style={microBtn}>導入</button>
                        <button onClick={() => setIsLocked(!isLocked)} style={{ ...microBtn, background: isLocked ? '#f44' : '#444' }}>{isLocked ? '鎖' : '調'}</button>
                    </div>
                </div>

                {showImport && (
                    <div style={sectionStyle}>
                        <textarea value={importText} onChange={e => setImportText(e.target.value)} style={{ width: '100%', height: '80px', background: '#000', color: '#0f0', border: '1px solid #1a2a35', fontSize: '10px' }} />
                        <button onClick={handleImport} style={{ ...btnStyle, marginTop: '5px' }}>還原</button>
                    </div>
                )}
                
                <div style={sectionStyle}>
                    <div style={ctrlRow}>
                        <span style={{ fontSize: '10px', color: '#ff6400' }}>背景底圖 (BG URL):</span>
                    </div>
                    <input type="text" value={bgUrl} onChange={e => setBgUrl(e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid #1a2a35', color: '#ff6400', fontSize: '10px', padding: '4px', marginBottom: '8px' }} />

                    <div style={ctrlRow}>
                        <span style={{ fontSize: '10px', color: '#ff6400' }}>圓心校準 (Global Offset):</span>
                        <div style={microGroup}>
                            <input type="number" step="0.1" value={centerX} onChange={e => setCenterX(Number(e.target.value))} style={numInputSmall} />
                            <input type="number" step="0.1" value={centerY} onChange={e => setCenterY(Number(e.target.value))} style={numInputSmall} />
                        </div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h3 style={{ fontSize: '0.85rem', color: '#00D4FF', margin: '0 0 10px 0' }}>[{activeLayer.type.toUpperCase()}] {activeLayerId.slice(0, 4)}</h3>
                    
                    {activeLayer.type === 'ring' ? (
                        <>
                            <div style={ctrlRow}>
                                <label>填充模式 (Mode):</label>
                                <button onClick={() => updateActiveLayer({ fillMode: activeLayer.fillMode === 'solid' ? 'outline' : 'solid' })} style={{ ...btnStyle, height: '24px', background: activeLayer.fillMode === 'solid' ? '#00D4FF' : '#333', color: activeLayer.fillMode === 'solid' ? '#000' : '#00D4FF' }}>
                                    {activeLayer.fillMode === 'solid' ? '■ 實心 SOLID' : '□ 空心 OUTLINE'}
                                </button>
                            </div>
                            <div style={subSection}>
                                <div style={ctrlRow}><label>半徑 (Radius):</label> <input type="number" value={activeLayer.radius} onChange={e => updateActiveLayer({ radius: Number(e.target.value) })} style={numInputSmall} /></div>
                                <input type="range" min="1" max="600" step="0.1" value={activeLayer.radius} onChange={e => updateActiveLayer({ radius: Number(e.target.value) })} style={rangeStyle} />
                                <div style={ctrlRow}><label>厚度 (Stroke):</label> <input type="number" value={activeLayer.strokeWidth} onChange={e => updateActiveLayer({ strokeWidth: Number(e.target.value) })} style={numInputSmall} /></div>
                                <input type="range" min="-400" max="400" step="0.1" value={activeLayer.strokeWidth} onChange={e => updateActiveLayer({ strokeWidth: Number(e.target.value) })} style={rangeStyle} />
                                <div style={ctrlRow}><label>分佈模式:</label>
                                    <button onClick={() => updateActiveLayer({ arrayMode: activeLayer.arrayMode === 'stacked' ? 'orbital' : 'stacked' })} style={{...microBtn, color: activeLayer.arrayMode === 'stacked' ? '#ff6400' : '#00D4FF'}}>
                                        {activeLayer.arrayMode === 'stacked' ? '疊 堆 STACKED' : '圈 繞 ORBITAL'}
                                    </button>
                                </div>
                                <div style={ctrlRow}><label style={{color:'#ff6400'}}>半徑步進 (Step):</label><input type="number" value={activeLayer.radiusStep} onChange={e => updateActiveLayer({ radiusStep: Number(e.target.value) })} style={numInputSmall} /></div>
                                <input type="range" min="-100" max="100" step="0.1" value={activeLayer.radiusStep} onChange={e => updateActiveLayer({ radiusStep: Number(e.target.value) })} style={rangeStyle} />
                            </div>
                            <div style={subSection}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                                    <button onClick={() => toggleEdge(0)} style={{ ...edgeBtn, background: activeLayer.hideEdges[0] ? '#f44' : '#333' }}>外</button>
                                    <button onClick={() => toggleEdge(2)} style={{ ...edgeBtn, background: activeLayer.hideEdges[2] ? '#f44' : '#333' }}>內</button>
                                    <button onClick={() => toggleEdge(3)} style={{ ...edgeBtn, background: activeLayer.hideEdges[3] ? '#f44' : '#333' }}>左</button>
                                    <button onClick={() => toggleEdge(1)} style={{ ...edgeBtn, background: activeLayer.hideEdges[1] ? '#f44' : '#333' }}>右</button>
                                </div>
                                <div style={ctrlRow}><label>起始角度 θ1:</label><input type="number" value={activeLayer.startAngle} onChange={e => updateActiveLayer({ startAngle: Number(e.target.value) })} style={numInputSmall} /></div>
                                <input type="range" min="-360" max="720" step="0.1" value={activeLayer.startAngle} onChange={e => updateActiveLayer({ startAngle: Number(e.target.value) })} style={rangeStyle} />
                                <div style={ctrlRow}><label>結束角度 θ2:</label><input type="number" value={activeLayer.endAngle} onChange={e => updateActiveLayer({ endAngle: Number(e.target.value) })} style={numInputSmall} /></div>
                                <input type="range" min="-360" max="720" step="0.1" value={activeLayer.endAngle} onChange={e => updateActiveLayer({ endAngle: Number(e.target.value) })} style={rangeStyle} />
                            </div>
                        </>
                    ) : (
                        <div style={subSection}>
                             <div style={ctrlRow}><label style={{color: '#00FF44'}}>圖示路徑 (Icon URL):</label></div>
                             <input type="text" value={activeLayer.iconUrl} onChange={e => updateActiveLayer({ iconUrl: e.target.value })} style={{ width: '100%', background: '#000', border: '1px solid #1a2a35', color: '#00FF44', fontSize: '10px', padding: '4px', marginBottom: '10px' }} />
                             {!activeLayer.iconUrl && (
                                <div style={ctrlRow}><label style={{ color: '#00FF44' }}>幾何邊數:</label><input type="number" value={activeLayer.sides} onChange={e => updateActiveLayer({ sides: Number(e.target.value) })} style={numInputSmall} /></div>
                             )}
                            <div style={ctrlRow}><label>寬度 (W):</label><input type="number" value={activeLayer.shapeWidth} onChange={e => updateActiveLayer({ shapeWidth: Number(e.target.value) })} style={numInputSmall} /></div>
                            <input type="range" min="0.1" max="500" value={activeLayer.shapeWidth} onChange={e => updateActiveLayer({ shapeWidth: Number(e.target.value) })} style={rangeStyle} />
                            <div style={ctrlRow}><label>高度 (H):</label><input type="number" value={activeLayer.shapeHeight} onChange={e => updateActiveLayer({ shapeHeight: Number(e.target.value) })} style={numInputSmall} /></div>
                            <input type="range" min="0.1" max="500" value={activeLayer.shapeHeight} onChange={e => updateActiveLayer({ shapeHeight: Number(e.target.value) })} style={rangeStyle} />
                            <div style={ctrlRow}><label>自轉 (Rot):</label><input type="number" value={activeLayer.shapeRotation} onChange={e => updateActiveLayer({ shapeRotation: Number(e.target.value) })} style={numInputSmall} /></div>
                            <input type="range" min="-360" max="360" value={activeLayer.shapeRotation} onChange={e => updateActiveLayer({ shapeRotation: Number(e.target.value) })} style={rangeStyle} />

                            <div style={ctrlRow}><label>分佈模式:</label>
                                <button onClick={() => updateActiveLayer({ arrayMode: activeLayer.arrayMode === 'stacked' ? 'orbital' : 'stacked' })} style={{...microBtn, color: activeLayer.arrayMode === 'stacked' ? '#ff6400' : '#00D4FF'}}>
                                    {activeLayer.arrayMode === 'stacked' ? '疊 堆 STACKED' : '圈 繞 ORBITAL'}
                                </button>
                            </div>

                            <div style={ctrlRow}><label style={{color:'#ff6400'}}>半徑步進 (Step):</label><input type="number" value={activeLayer.radiusStep} onChange={e => updateActiveLayer({ radiusStep: Number(e.target.value) })} style={numInputSmall} /></div>
                            <input type="range" min="-100" max="100" step="0.1" value={activeLayer.radiusStep} onChange={e => updateActiveLayer({ radiusStep: Number(e.target.value) })} style={rangeStyle} />

                            <div style={ctrlRow}><label>軌道 R:</label><input type="number" value={activeLayer.radius} onChange={e => updateActiveLayer({ radius: Number(e.target.value) })} style={numInputSmall} /></div>
                            <input type="range" min="1" max="600" value={activeLayer.radius} onChange={e => updateActiveLayer({ radius: Number(e.target.value) })} style={rangeStyle} />

                            <div style={ctrlRow}><label>起始方位 (Start θ):</label><input type="number" value={activeLayer.startAngle} onChange={e => updateActiveLayer({ startAngle: Number(e.target.value) })} style={numInputSmall} /></div>
                            <input type="range" min="-360" max="720" value={activeLayer.startAngle} onChange={e => updateActiveLayer({ startAngle: Number(e.target.value) })} style={rangeStyle} />
                        </div>
                    )}

                    <div style={subSection}>
                        <div style={ctrlRow}><label>數量/分段:</label><input type="number" value={activeLayer.segments} onChange={e => updateActiveLayer({ segments: Number(e.target.value) })} style={numInputSmall} /></div>
                        <input type="range" min="1" max="250" value={activeLayer.segments} onChange={e => updateActiveLayer({ segments: Number(e.target.value) })} style={rangeStyle} />
                        <div style={ctrlRow}><label>間距 (Gap):</label><input type="number" step="0.1" value={activeLayer.gap} onChange={e => updateActiveLayer({ gap: Number(e.target.value) })} style={numInputSmall} /></div>
                        <input type="range" min="0" max="360" step="0.1" value={activeLayer.gap} onChange={e => updateActiveLayer({ gap: Number(e.target.value) })} style={rangeStyle} />
                    </div>

                    <div style={{ ...subSection, border: '1px solid #ff640033' }}>
                        <div style={ctrlRow}><label>旋轉週期:</label><input type="text" value={activeLayer.rotationSpeed} onChange={e => updateActiveLayer({ rotationSpeed: e.target.value })} style={numInputSmall} /></div>
                        <div style={ctrlRow}><label>呼吸週期:</label><input type="text" value={activeLayer.pulseSpeed} onChange={e => updateActiveLayer({ pulseSpeed: e.target.value })} style={numInputSmall} /></div>
                        <div style={ctrlRow}><label>呼吸強度:</label><input type="number" step="0.01" value={activeLayer.pulseRange} onChange={e => updateActiveLayer({ pulseRange: Number(e.target.value) })} style={numInputSmall} /></div>
                        <input type="range" min="0" max="1" step="0.01" value={activeLayer.pulseRange} onChange={e => updateActiveLayer({ pulseRange: Number(e.target.value) })} style={rangeStyle} />
                        <div style={ctrlRow}><label>反向旋轉:</label><input type="checkbox" checked={activeLayer.reverse} onChange={e => updateActiveLayer({ reverse: e.target.checked })} /></div>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => addLayer('ring')} style={btnStyle}>+圓環</button>
                        <button onClick={() => addLayer('shape')} style={{ ...btnStyle, background: '#00FF44' }}>+幾何/圖示</button>
                        <button onClick={duplicateLayer} style={btnStyle}>複製</button>
                        <button onClick={() => removeLayer(activeLayerId)} style={{ ...btnStyle, background: '#a33', color: '#fff' }}>刪除</button>
                    </div>
                </div>

                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {layers.map(l => (
                        <div key={l.id} onClick={() => setActiveLayerId(l.id)} style={{ padding: '4px', cursor: 'pointer', borderLeft: l.id === activeLayerId ? '3px solid #00FF44' : '3px solid #1a2a35', fontSize: '10px', background: l.id === activeLayerId ? '#ffffff11' : 'transparent' }}>
                            #{l.id.slice(0, 3)} | {l.type.toUpperCase()} | P:{l.pulseSpeed !== '0s' ? 'ON' : 'OFF'}
                        </div>
                    ))}
                </div>
            </div>

            {/* Viewport Control Toolbar */}
            <div style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', background: '#050a0f' }}>
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(10,20,29,0.85)', padding: '12px', borderRadius: '8px', border: '1px solid #00D4FF44', backdropFilter: 'blur(5px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button onClick={() => setZoom(prev => +(prev - 0.2).toFixed(1))} style={microBtn}>-</button>
                        <input type="range" min="0.5" max="10" step="0.1" value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ width: '80px' }} />
                        <button onClick={() => setZoom(prev => +(prev + 0.2).toFixed(1))} style={microBtn}>+</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={ctrlRow}><span style={{fontSize:'9px'}}>視角 X:</span><input type="range" min="-1000" max="1000" value={viewPanX} onChange={e => setViewPanX(Number(e.target.value))} style={{width:'80px'}} /></div>
                        <div style={ctrlRow}><span style={{fontSize:'9px'}}>視角 Y:</span><input type="range" min="-1000" max="1000" value={viewPanY} onChange={e => setViewPanY(Number(e.target.value))} style={{width:'80px'}} /></div>
                        <button onClick={() => { setViewPanX(0); setViewPanY(0); setZoom(2.7); }} style={{...microBtn, width:'100%', marginTop:'5px'}}>重置視角</button>
                    </div>
                </div>

                <div style={{ width: '100%', height: 'calc(100% - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '1000px', height: '1000px', transform: `scale(${zoom}) translate(${viewPanX / zoom}px, ${viewPanY / zoom}px)`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}>
                        <img src={bgUrl} alt="" style={{ position: 'absolute', left: 500 - centerX, top: 500 - centerY, opacity: 0.4, pointerEvents: 'none' }} />
                        {layers.map(l => (
                            l.type === 'ring' ? (
                                <JarvisHudRing key={l.id} cx={500} cy={500} radius={l.radius} innerRadius={l.radius - l.strokeWidth} startAngle={l.startAngle} endAngle={l.endAngle} segments={l.segments} gap={l.gap} radiusStep={l.radiusStep} arrayMode={l.arrayMode} color={l.id === activeLayerId ? '#00FF44' : l.color} rotationSpeed={l.rotationSpeed} pulseSpeed={l.pulseSpeed} pulseRange={l.pulseRange} reverse={l.reverse} opacity={l.opacity} size={1000} startSkew={l.startSkew} endSkew={l.endSkew} fillMode={l.fillMode} hideEdges={l.hideEdges} />
                            ) : (
                                <JarvisHudShape key={l.id} cx={500} cy={500} orbitRadius={l.radius} orbitAngle={l.startAngle} width={l.shapeWidth} height={l.shapeHeight} sides={l.sides} count={l.segments} gap={l.gap} radiusStep={l.radiusStep} arrayMode={l.arrayMode} color={l.id === activeLayerId ? '#00FF44' : l.color} iconUrl={l.iconUrl} rotation={l.shapeRotation} rotationSpeed={l.rotationSpeed} pulseSpeed={l.pulseSpeed} pulseRange={l.pulseRange} reverse={l.reverse} opacity={l.opacity} viewSize={1000} />
                            )
                        ))}
                    </div>
                </div>

                <div style={{ height: '160px', background: '#02050a', borderTop: '2px solid #00D4FF', padding: '15px', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#00D4FF', fontWeight: 'bold' }}>JSON EXPORT CONFIG</span>
                        <button onClick={() => { navigator.clipboard.writeText(JSON.stringify({ global: { centerX, centerY, bgUrl }, layers: layers.map(({ id, ...r }) => r) }, null, 2)); alert('JSON 已複製！'); }} style={{ ...microBtn, background: '#00FF44', color: '#000' }}>複製 JSON</button>
                    </div>
                    <pre style={{ margin: 0, color: '#00FF44', overflowY: 'auto', height: '100px', background: '#000', padding: '10px', fontSize: '10px' }}>
                        {JSON.stringify({ global: { centerX, centerY, bgUrl }, layers: layers.map(({ id, ...r }) => r) }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

const sectionStyle = { marginBottom: '8px', background: '#050a0f', padding: '10px', borderRadius: '4px', border: '1px solid #1a2a35' };
const subSection = { border: '1px solid #1a2a35', padding: '8px', borderRadius: '4px', margin: '6px 0' };
const ctrlRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '4px' };
const microGroup = { display: 'flex', gap: '2px' };
const rangeStyle = { width: '100%', accentColor: '#00D4FF', margin: '4px 0' };
const btnStyle = { flex: 1, padding: '8px', background: '#00D4FF', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem' };
const microBtn = { padding: '2px 8px', fontSize: '10px', background: '#222', border: '1px solid #444', color: '#00D4FF', cursor: 'pointer', borderRadius: '4px' };
const edgeBtn = { flex: 1, padding: '4px 0', fontSize: '9px', border: 'none', cursor: 'pointer', color: '#fff' };
const numInputSmall = { width: '55px', background: '#000', border: '1px solid #1a2a35', color: '#00FF44', fontSize: '10px', textAlign: 'center' };

export default JarvisHudLab;
