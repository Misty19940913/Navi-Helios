import React, { useState, useRef, useCallback } from 'react';

import { JarvisArchitect } from './JarvisArchitect';
import { WIDGET_REGISTRY, WIDGET_LIST } from './widgetRegistry';
import type { WidgetType } from './widgetRegistry';
import JarvisLauncher from './JarvisLauncher';
import JarvisSystem from './JarvisSystem';
import JarvisUSB from './JarvisUSB';
import Jarvis3rdGig from './Jarvis3rdGig';

type AppMode = 'VIEWER' | 'ARCHITECT';

const PREVIEW_OFFSET = { left: -270, top: -290 };
const SYSTEM_PREVIEW_OFFSET = { left: -20, top: -20 };
const USB_PREVIEW_OFFSET = { left: -355, top: -0 };
const SUVI_PREVIEW_OFFSET = { left: -240, top: -60 };

function OverlayComparison({ type }: { type: 'LAUNCHER' | 'SYSTEM' | 'USB' | '3RDGIG' }) {
  const [opacity, setOpacity] = useState(0.5);
  const offset = type === 'LAUNCHER' ? PREVIEW_OFFSET : type === 'SYSTEM' ? SYSTEM_PREVIEW_OFFSET : type === 'USB' ? USB_PREVIEW_OFFSET : SUVI_PREVIEW_OFFSET;
  const Component = type === 'LAUNCHER' ? JarvisLauncher : type === 'SYSTEM' ? JarvisSystem : type === 'USB' ? JarvisUSB : Jarvis3rdGig;
  const canvas = type === 'LAUNCHER' ? { w: 360, h: 274 } : type === 'SYSTEM' ? { w: 360, h: 414 } : type === 'USB' ? { w: 358, h: 505 } : { w: 240, h: 360 };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#00d4ff' }}>
        <span>◀ TSX</span>
        <input type="range" min={0} max={1} step={0.01} value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} style={{ width: '200px', accentColor: '#00d4ff' }} />
        <span>ORIGINAL ▶</span>
        <span style={{ color: '#fff', minWidth: '36px' }}>{Math.round(opacity * 100)}%</span>
      </div>
      <div style={{ position: 'relative', width: `${canvas.w}px`, height: `${canvas.h}px` }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Component />
        </div>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: opacity, pointerEvents: 'none' }}>
          <img src="/Preview_mark7.png" alt="" style={{ position: 'absolute', left: `${offset.left}px`, top: `${offset.top}px` }} />
        </div>
      </div>
    </div>
  );
}

import JarvisHudLab from './JarvisHudLab';
import JarvisHudLinearLab from './JarvisHudLinearLab';
import JarvisHudMasterLab from './JarvisHudMasterLab';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('VIEWER');
  const [labMode, setLabMode] = useState<'CIRCULAR' | 'LINEAR' | 'MASTER'>('MASTER'); // Default to MASTER

  // Simple URL Routing for the LAB
  if (window.location.pathname === '/lab') {
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
        {/* Compact Lab Navigator */}
        <div style={{ position: 'absolute', top: 0, left: 380, right: 0, height: '32px', background: '#02050aee', zIndex: 999, borderBottom: '1px solid #1a2a35', borderLeft: '1px solid #1a2a35', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', backdropFilter: 'blur(10px)' }}>
          <button onClick={() => setLabMode('CIRCULAR')} style={{ background: labMode === 'CIRCULAR' ? '#00D4FF22' : 'transparent', color: labMode === 'CIRCULAR' ? '#00D4FF' : '#555', border: labMode === 'CIRCULAR' ? '1px solid #00D4FF' : '1px solid #333', padding: '2px 12px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold', borderRadius: '2px' }}>
            [ 圓周模式 ]
          </button>
          <button onClick={() => setLabMode('LINEAR')} style={{ background: labMode === 'LINEAR' ? '#00FF4422' : 'transparent', color: labMode === 'LINEAR' ? '#00FF44' : '#555', border: labMode === 'LINEAR' ? '1px solid #00FF44' : '1px solid #333', padding: '2px 12px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold', borderRadius: '2px' }}>
            [ 線性模式 ]
          </button>
          <button onClick={() => setLabMode('MASTER')} style={{ background: labMode === 'MASTER' ? '#ffce0022' : 'transparent', color: labMode === 'MASTER' ? '#ffce00' : '#555', border: labMode === 'MASTER' ? '1px solid #ffce00' : '1px solid #333', padding: '2px 12px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold', borderRadius: '2px' }}>
            [ 總裝對位 ]
          </button>
          <button onClick={() => window.location.href = '/'} style={{ opacity: 0.6, border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '9px', marginLeft: '20px' }}>
            ➜ BACK TO CONSOLE
          </button>
        </div>
        {labMode === 'CIRCULAR' ? <JarvisHudLab /> : labMode === 'LINEAR' ? <JarvisHudLinearLab /> : <JarvisHudMasterLab />}
      </div>
    );
  }

  const [activeWidget, setActiveWidget] = useState<WidgetType>('BLUE_TIME');
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const stageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) {
      setCoords({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
    }
  }, []);

  if (appMode === 'ARCHITECT') {
    return (
      <>
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
          <button onClick={() => setAppMode('VIEWER')} style={{ background: '#02050a', color: '#ff6400', border: '1px solid #ff6400', padding: '5px 15px', cursor: 'pointer', fontWeight: 'bold' }}>
            ◀ EXIT ARCHITECT
          </button>
        </div>
        <JarvisArchitect />
      </>
    );
  }

  const M7 = WIDGET_LIST.filter(w => ['BLUE_TIME','MARK7_HDD','MARK7_LAUNCHER','MARK7_SYSTEM','MARK7_USB'].includes(w.id));
  const SUVI = WIDGET_LIST.filter(w => w.id.startsWith('ULTIMATE_') || w.id.startsWith('SUVI_'));
  const TUAN = WIDGET_LIST.filter(w => w.id.startsWith('TUAN_'));

  const NavGroup = ({ label, widgets, color }: { label: string; widgets: typeof M7; color: string }) => (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginTop: '6px' }}>
      <div style={{ color: '#fff', fontSize: '9px', opacity: 0.5, borderRight: `1px solid ${color}`, paddingRight: '8px', minWidth: '110px' }}>{label}</div>
      {widgets.map(w => (
        <button key={w.id} onClick={() => setActiveWidget(w.id)} style={{
          background: activeWidget === w.id ? color.replace('1)', '0.25)') : 'transparent',
          color: activeWidget === w.id ? '#fff' : color,
          border: `1px solid ${color}`, padding: '3px 10px', cursor: 'pointer', fontSize: '10px', transition: 'all 0.2s'
        }}>
          {w.name}
        </button>
      ))}
    </div>
  );

  const renderWidget = () => {
    switch (activeWidget) {
      case 'MARK7_LAUNCHER': return <OverlayComparison type="LAUNCHER" />;
      case 'MARK7_SYSTEM':   return <OverlayComparison type="SYSTEM" />;
      case 'MARK7_USB':      return <OverlayComparison type="USB" />;
      case 'SUVI_3RDGIG':   return <OverlayComparison type="3RDGIG" />;
      default:
        const C = WIDGET_REGISTRY[activeWidget]?.component;
        return C ? <C /> : null;
    }
  };

  return (
    <div style={{ backgroundColor: '#02050a', minHeight: '100vh', width: '100%', color: '#00d4ff', fontFamily: 'Consolas, monospace', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        button:hover { filter: brightness(1.3); }
      `}</style>

      <nav style={{ padding: '10px 20px', borderBottom: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,20,30,0.6)', zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <button onClick={() => setAppMode('ARCHITECT')} style={{ background: 'rgba(255,100,0,0.15)', color: '#ff6400', border: '1px solid #ff6400', padding: '6px 24px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px' }}>
            [⚡] ENTER ARCHITECT MODE
          </button>
        </div>
        <NavGroup label="MARK 7 (SH LEE)" widgets={M7} color="#00d4ff" />
        <NavGroup label="ULTIMATE (SUVRAT)" widgets={SUVI} color="#ff6400" />
        <NavGroup label="V1.1 (TUAN)" widgets={TUAN} color="#00ff88" />
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '5px 20px', borderBottom: '1px solid rgba(0,212,255,0.1)', fontSize: '11px' }}>
        <span>✦ X:<strong style={{ color: '#fff' }}>{coords.x}</strong> Y:<strong style={{ color: '#fff' }}>{coords.y}</strong></span>
        <button onClick={() => setShowGrid(g => !g)} style={{ background: showGrid ? 'rgba(0,212,255,0.2)' : 'transparent', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.4)', padding: '2px 8px', cursor: 'pointer', fontSize: '10px' }}>
          {showGrid ? '◉ GRID' : '◎ GRID'}
        </button>
        <span style={{ opacity: 0.5 }}>│ SCALE:</span>
        <input type="range" min="0.2" max="2.0" step="0.1" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} style={{ width: '120px', accentColor: '#00d4ff' }} />
        <span style={{ color: '#fff', minWidth: '36px' }}>{Math.round(zoom * 100)}%</span>
      </div>

      <main ref={containerRef} style={{ flex: 1, overflow: 'auto', backgroundColor: '#000', padding: '60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', transform: `scale(${zoom})`, transformOrigin: 'center top', transition: 'transform 0.2s' }}>
          <div ref={stageRef} onMouseMove={handleMouseMove} style={{ position: 'relative' }}>
            {showGrid && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999, backgroundImage: 'linear-gradient(rgba(0,212,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.07) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
            )}
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              {renderWidget()}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: '4px 20px', fontSize: '10px', opacity: 0.4, borderTop: '1px solid rgba(0,212,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
        <div>J.A.R.V.I.S MISSION CONTROL</div>
        <div>ACTIVE: {activeWidget}</div>
      </footer>
    </div>
  );
}

export default App;
