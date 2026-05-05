import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { WIDGET_LIST, WIDGET_REGISTRY } from './widgetRegistry';
import type { WidgetType } from './widgetRegistry';

export interface LayoutComponent {
  id: string; // unique instance id
  type: WidgetType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  zIndex: number;
}

export const JarvisArchitect: React.FC = () => {
  console.log("ARCHITECT MODE INITIATED");
  const [components, setComponents] = useState<LayoutComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exportData, setExportData] = useState<string>('');

  // Canvas pan & drag state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingWidget, setIsDraggingWidget] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  
  // Dragging widget state
  const draggingWidgetRef = useRef<{ id: string, startX: number, startY: number, mouseStartX: number, mouseStartY: number } | null>(null);

  const addWidget = (type: WidgetType) => {
    const newComp: LayoutComponent = {
      id: `${type}_${Date.now()}`,
      type,
      x: -pan.x + window.innerWidth / 2 - (WIDGET_REGISTRY[type]?.defaultWidth / 2 || 100), // Drop in center of current view
      y: -pan.y + window.innerHeight / 2 - (WIDGET_REGISTRY[type]?.defaultHeight / 2 || 100),
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: components.length + 10,
    };
    setComponents([...components, newComp]);
    setSelectedId(newComp.id);
  };

  const removeSelected = () => {
    setComponents(components.filter(c => c.id !== selectedId));
    setSelectedId(null);
  };

  const updateSelected = (updates: Partial<LayoutComponent>) => {
    if (!selectedId) return;
    setComponents(comps => comps.map(c => c.id === selectedId ? { ...c, ...updates } : c));
  };

  const handlePointerDown = (e: React.PointerEvent, compId: string) => {
    e.stopPropagation();
    setSelectedId(compId);
    const comp = components.find(c => c.id === compId);
    if (!comp) return;

    setIsDraggingWidget(true);
    draggingWidgetRef.current = {
      id: compId,
      startX: comp.x,
      startY: comp.y,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY
    };
  };

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    setSelectedId(null); // Deselect if clicking empty space
    if (e.target === canvasRef.current) {
        setIsPanning(true);
        panStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            panX: pan.x,
            panY: pan.y
        };
    }
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isPanning) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        setPan({
          x: panStartRef.current.panX + dx,
          y: panStartRef.current.panY + dy
        });
      }

      if (isDraggingWidget && draggingWidgetRef.current) {
        const dx = e.clientX - draggingWidgetRef.current.mouseStartX;
        const dy = e.clientY - draggingWidgetRef.current.mouseStartY;
        updateSelected({
          x: draggingWidgetRef.current.startX + dx,
          y: draggingWidgetRef.current.startY + dy
        });
      }
    };

    const handleGlobalPointerUp = () => {
      setIsPanning(false);
      setIsDraggingWidget(false);
      draggingWidgetRef.current = null;
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isPanning, isDraggingWidget, selectedId, components]); // Re-bind on state change because of updateSelected scope

  const handleExport = () => {
    const data = JSON.stringify(components, null, 2);
    setExportData(data);
  };

  const selectedComponent = components.find(c => c.id === selectedId);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: '#02050a', fontFamily: 'Consolas, monospace', color: '#00d4ff' }}>
      
      {/* PALETTE (LEFT) */}
      <div style={{ width: '250px', background: 'rgba(0, 20, 30, 0.9)', borderRight: '1px solid rgba(0, 212, 255, 0.3)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
        <div style={{ padding: '15px', borderBottom: '1px solid rgba(0, 212, 255, 0.3)', fontWeight: 'bold' }}>
          J.A.R.V.I.S PALETTE
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {WIDGET_LIST.map(def => (
            <button
              key={def.id}
              onClick={() => addWidget(def.id)}
              style={{
                display: 'block', width: '100%', padding: '8px', marginBottom: '8px',
                background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff',
                border: '1px solid rgba(0, 212, 255, 0.2)', textAlign: 'left', cursor: 'pointer', fontSize: '11px'
              }}
            >
              + {def.name}
            </button>
          ))}
        </div>
      </div>

      {/* CANVAS (CENTER) */}
      <div 
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        style={{ 
          flex: 1, position: 'relative', overflow: 'hidden', 
          cursor: isPanning ? 'grabbing' : 'grab',
          // Dot grid background mapped to pan
          backgroundImage: 'radial-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px)`, position: 'absolute', inset: 0 }}>
          {components.map(comp => {
            const Def = WIDGET_REGISTRY[comp.type];
            if (!Def) return null;
            const ComponentClass = Def.component;

            return (
              <div
                key={comp.id}
                onPointerDown={(e) => handlePointerDown(e, comp.id)}
                style={{
                  position: 'absolute',
                  left: `${comp.x}px`,
                  top: `${comp.y}px`,
                  width: `${Def.defaultWidth}px`,
                  height: `${Def.defaultHeight}px`,
                  transform: `scale(${comp.scale}) rotate(${comp.rotation}deg)`,
                  opacity: comp.opacity,
                  zIndex: comp.zIndex,
                  cursor: 'move',
                  border: selectedId === comp.id ? '1px dashed #00ff88' : 'none',
                  boxShadow: selectedId === comp.id ? '0 0 15px rgba(0, 255, 136, 0.2)' : 'none',
                }}
              >
                <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
                  <ComponentClass />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROPERTIES (RIGHT) */}
      <div style={{ width: '280px', background: 'rgba(0, 20, 30, 0.9)', borderLeft: '1px solid rgba(0, 212, 255, 0.3)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
        <div style={{ padding: '15px', borderBottom: '1px solid rgba(0, 212, 255, 0.3)', fontWeight: 'bold' }}>
          PROPERTIES
        </div>
        
        {selectedComponent ? (
          <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '11px' }}>
            <div>
              <div style={{ color: '#00ff88', marginBottom: '5px' }}>{WIDGET_REGISTRY[selectedComponent.type].name}</div>
              <div style={{ opacity: 0.5 }}>ID: {selectedComponent.id}</div>
            </div>

            <div>
               <label>X Position:</label>
               <input type="number" value={Math.round(selectedComponent.x)} onChange={e => updateSelected({ x: parseInt(e.target.value) || 0 })} style={{ width: '100%', background: '#02050a', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', padding: '4px' }} />
            </div>
            
            <div>
               <label>Y Position:</label>
               <input type="number" value={Math.round(selectedComponent.y)} onChange={e => updateSelected({ y: parseInt(e.target.value) || 0 })} style={{ width: '100%', background: '#02050a', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', padding: '4px' }} />
            </div>

            <div>
               <label>Scale ({selectedComponent.scale.toFixed(2)}x):</label>
               <input type="range" min="0.1" max="3" step="0.05" value={selectedComponent.scale} onChange={e => updateSelected({ scale: parseFloat(e.target.value) })} style={{ width: '100%', accentColor: '#00d4ff' }} />
            </div>

            <div>
               <label>Rotation ({selectedComponent.rotation}°):</label>
               <input type="range" min="0" max="360" step="1" value={selectedComponent.rotation} onChange={e => updateSelected({ rotation: parseFloat(e.target.value) })} style={{ width: '100%', accentColor: '#00d4ff' }} />
            </div>

            <div>
               <label>Opacity ({Math.round(selectedComponent.opacity * 100)}%):</label>
               <input type="range" min="0" max="1" step="0.05" value={selectedComponent.opacity} onChange={e => updateSelected({ opacity: parseFloat(e.target.value) })} style={{ width: '100%', accentColor: '#00d4ff' }} />
            </div>

            <div>
               <label>Z-Index:</label>
               <input type="number" value={selectedComponent.zIndex} onChange={e => updateSelected({ zIndex: parseInt(e.target.value) || 0 })} style={{ width: '100%', background: '#02050a', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', padding: '4px' }} />
            </div>

            <button onClick={removeSelected} style={{ background: 'rgba(255,0,0,0.2)', border: '1px solid red', color: 'red', cursor: 'pointer', padding: '8px', marginTop: '10px' }}>
              DELETE WIDGET
            </button>
          </div>
        ) : (
          <div style={{ padding: '15px', opacity: 0.5 }}>Select a widget on the canvas to configure properties.</div>
        )}

        {/* BOTTOM EXPORT AREA */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0, 212, 255, 0.3)', padding: '15px' }}>
             <button onClick={handleExport} style={{ width: '100%', padding: '8px', background: '#00d4ff', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                 EXPORT LAYOUT
             </button>
        </div>
      </div>

      {/* EXPORT MODAL OVERLAY */}
      {exportData && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#02050a', border: '1px solid #00d4ff', padding: '20px', width: '600px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0, color: '#00ff88' }}>JSON EXPORT</h3>
                      <button onClick={() => setExportData('')} style={{ background: 'transparent', color: '#00d4ff', border: 'none', cursor: 'pointer' }}>✖ CLOSE</button>
                  </div>
                  <textarea readOnly value={exportData} style={{ flex: 1, background: '#000', color: '#00d4ff', fontFamily: 'monospace', padding: '10px', fontSize: '11px', border: '1px solid rgba(0,212,255,0.2)' }} />
              </div>
          </div>
      )}
    </div>
  );
};
