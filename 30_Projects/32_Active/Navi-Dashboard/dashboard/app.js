/**
 * NAVI DASHBOARD — JARVIS EDITION
 * Dashboard Canvas + Edit Mode
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Navi Dashboard] JARVIS Shell Loaded');
  
  // DEBUG: Clear localStorage on first load to avoid corrupted state
  // Comment out or remove this line after first load
  // localStorage.removeItem('navi-dashboard-layout');
  
  // Check if this is first load (no valid layout)
  const saved = localStorage.getItem('navi-dashboard-layout');
  if (saved && saved !== '[]') {
    try {
      JSON.parse(saved);
    } catch(e) {
      console.log('[Navi Dashboard] Clearing corrupted localStorage');
      localStorage.removeItem('navi-dashboard-layout');
    }
  }
  
  // State
  let editMode = false;
  let isDragging = false;
  let isResizing = false;
  let currentItem = null;
  let dragOffset = { x: 0, y: 0 };
  let initialSize = { width: 0, height: 0 };
  let initialPos = { x: 0, y: 0 };
  
  // DOM Elements
  const canvas = document.getElementById('dashboard-canvas');
  const exportLayoutBtn = document.getElementById('export-layout-btn');
  const importLayoutBtn = document.getElementById('import-layout-btn');
  const importInput = document.getElementById('import-input');
  const editToggle = document.getElementById('edit-mode-toggle');
  const addWidgetBtn = document.getElementById('add-widget-btn');
  const addElementBtn = document.getElementById('add-element-btn');
  const resetLayoutBtn = document.getElementById('reset-layout-btn');
  
  const studioStage = document.getElementById('studio-stage');
  const btnUndo = document.getElementById('btn-undo');
  const btnImportStudio = document.getElementById('btn-import-studio');

  // ==========================================
  // PAPER.JS INITIALIZATION (Background Math)
  // ==========================================
  const paperCanvas = document.createElement('canvas');
  paperCanvas.style.display = 'none';
  document.body.appendChild(paperCanvas);
  paper.setup(paperCanvas);
  const modal = document.getElementById('widget-modal');
  const modalClose = modal.querySelector('.modal-close');
  
  // ==========================================
  // TEMPLATES
  // ==========================================
  
  const widgetTemplates = {
    agents: `
      <div class="widget-header">
        <span class="widget-title">AGENTS</span>
        <span class="widget-status online">●</span>
      </div>
      <div class="widget-body">
        <div class="stat-large" id="agents-count">18</div>
        <div class="stat-label">ONLINE</div>
      </div>
    `,
    tasks: `
      <div class="widget-header">
        <span class="widget-title">TASKS</span>
        <span class="widget-status active">●</span>
      </div>
      <div class="widget-body">
        <div class="stat-large" id="tasks-count">5</div>
        <div class="stat-label">ACTIVE</div>
      </div>
    `,
    system: `
      <div class="widget-header">
        <span class="widget-title">SYSTEM</span>
        <span class="widget-status healthy">●</span>
      </div>
      <div class="widget-body">
        <div class="stat-large healthy">OK</div>
        <div class="stat-label">HEALTHY</div>
      </div>
    `,
    notes: `
      <div class="widget-header">
        <span class="widget-title">三省六部</span>
        <span class="widget-status online">●</span>
      </div>
      <div class="widget-body">
        <div class="stat-large" style="font-size: 24px;">尚書省</div>
        <div class="stat-label">Edict Core</div>
      </div>
    `
  };
  
  const elementTemplates = {
    line: `<div class="svg-shape-container"><svg class="svg-shape-inner" style="overflow:visible;"><path fill="none" stroke="var(--color-cyan)" stroke-width="2" vector-effect="non-scaling-stroke"></path></svg></div>`,
    rect: `<div class="svg-shape-container"><svg class="svg-shape-inner" style="overflow:visible;"><path fill="rgba(0, 212, 255, 0.2)" stroke="var(--color-cyan)" stroke-width="2" vector-effect="non-scaling-stroke"></path></svg></div>`,
    circle: `<div class="svg-shape-container"><svg class="svg-shape-inner" style="overflow:visible;"><path fill="rgba(0, 212, 255, 0.2)" stroke="var(--color-cyan)" stroke-width="2" vector-effect="non-scaling-stroke"></path></svg></div>`,
    ellipse: `<div class="svg-shape-container"><svg class="svg-shape-inner" style="overflow:visible;"><path fill="rgba(0, 212, 255, 0.2)" stroke="var(--color-cyan)" stroke-width="2" vector-effect="non-scaling-stroke"></path></svg></div>`,
    polygon: `<div class="svg-shape-container"><svg class="svg-shape-inner" style="overflow:visible;"><path fill="rgba(0, 212, 255, 0.2)" stroke="var(--color-cyan)" stroke-width="2" vector-effect="non-scaling-stroke"></path></svg></div>`,
    sector: `<div class="svg-shape-container"><svg class="svg-shape-inner" style="overflow:visible;"><path fill="rgba(0, 212, 255, 0.2)" stroke="var(--color-cyan)" stroke-width="2" vector-effect="non-scaling-stroke"></path></svg></div>`,
    text: `<div class="text-element" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--color-cyan); font-family: monospace;">Text</div>`,
    'custom-bool': `<div class="svg-shape-container"><svg class="svg-shape-inner" style="overflow:visible;"><path fill="rgba(0, 212, 255, 0.2)" stroke="var(--color-cyan)" stroke-width="2" vector-effect="non-scaling-stroke"></path></svg></div>`,
    gauge: `
      <div class="gauge-container">
        <svg class="gauge-svg" viewBox="0 0 100 100">
          <circle class="gauge-bg" cx="50" cy="50" r="40"/>
          <circle class="gauge-fill" cx="50" cy="50" r="40" stroke-dasharray="251.2" stroke-dashoffset="62.8"/>
        </svg>
        <div class="gauge-value">75%</div>
        <div class="gauge-label">CPU</div>
      </div>
    `,
    minibars: `
      <div class="element-header">RESOURCES</div>
      <div class="mini-bars-v">
        <div class="mb-row"><span class="mb-label">CPU</span><div class="mb-bar"><div class="mb-fill" style="width: 45%;"></div></div></div>
        <div class="mb-row"><span class="mb-label">RAM</span><div class="mb-bar"><div class="mb-fill" style="width: 62%;"></div></div></div>
        <div class="mb-row"><span class="mb-label">DISK</span><div class="mb-bar"><div class="mb-fill" style="width: 30%;"></div></div></div>
      </div>
    `,
    radar: `
      <div class="radar-container">
        <div class="radar-ring outer"></div>
        <div class="radar-ring middle"></div>
        <div class="radar-ring inner"></div>
        <div class="radar-sweep"></div>
        <div class="radar-center"></div>
      </div>
    `,
    hexagon: `
      <div class="hex-container">
        <div class="hex-inner">
          <span class="hex-value">12</span>
          <span class="hex-label">NODES</span>
        </div>
      </div>
    `,
    donut: `
      <div class="donut-container">
        <svg class="donut-svg" viewBox="0 0 50 50">
          <circle class="donut-bg" cx="25" cy="25" r="20"/>
          <circle class="donut-fill" cx="25" cy="25" r="20" stroke-dasharray="125.6" stroke-dashoffset="37.7"/>
        </svg>
        <span class="donut-value">70%</span>
      </div>
    `,
    arc: `
      <div class="arc-container">
        <svg class="arc-svg" viewBox="0 0 120 60">
          <path class="arc-bg" d="M10,55 A45,45 0 0,1 110,55"/>
          <path class="arc-fill" d="M10,55 A45,45 0 0,1 110,55" stroke-dasharray="141" stroke-dashoffset="42"/>
        </svg>
        <span class="arc-value">70%</span>
      </div>
    `,
    core: `
      <div class="core-visual">
        <div class="core-ring-1"></div>
        <div class="core-ring-2"></div>
        <div class="core-ring-3"></div>
        <div class="core-center"></div>
      </div>
      <div class="core-text">NAVI</div>
    `,
    text: `
      <div class="text-content">
        <span class="tl-prefix">></span>
        <span class="tl-text">SYSTEM ONLINE</span>
      </div>
    `,
    battery: `
      <div class="battery-container">
        <div class="battery-body">
          <div class="battery-fill" style="width: 85%;"></div>
        </div>
        <div class="battery-tip"></div>
        <span class="battery-value">85%</span>
      </div>
    `,
    clock: `
      <div class="clock-display">
        <span class="clock-time">--:--:--</span>
        <span class="clock-date">----/--/--</span>
      </div>
    `,
    hud: `
      <div class="hud-container">
        <div class="hud-image"></div>
      </div>
    `,
    'corner-tl': `<div class="corner-tl"></div>`,
    'corner-tr': `<div class="corner-tr"></div>`,
    'corner-bl': `<div class="corner-bl"></div>`,
    'corner-br': `<div class="corner-br"></div>`,
    scanline: `<div class="scanline-fill"></div>`,
    vdata: `
      <div class="vdata-container">
        <span class="vdata-label">A</span>
        <div class="vdata-marks">
          <div class="vmark" style="top: 20%;"></div>
          <div class="vmark" style="top: 40%;"></div>
          <div class="vmark" style="top: 60%;"></div>
          <div class="vmark" style="top: 80%;"></div>
        </div>
        <span class="vdata-label">B</span>
      </div>
    `,
    waveform: `
      <div class="waveform-container">
        <canvas class="waveform-canvas"></canvas>
      </div>
    `,
    'core-v2': `
      <div class="core-v2-container">
        <div class="c2-ring c2-ring-1"></div>
        <div class="c2-ring c2-ring-2"></div>
        <div class="c2-ring c2-ring-3"></div>
        <div class="c2-center">
          <span class="c2-label">NAVI</span>
          <span class="c2-sub">CORE</span>
        </div>
        <div class="c2-data c2-data-tl">PWR: 88%</div>
        <div class="c2-data c2-data-tr">TMP: 42°C</div>
        <div class="c2-data c2-data-bl">RPM: 4.2k</div>
        <div class="c2-data c2-data-br">SYN: 0.9s</div>
      </div>
    `,
    'scanning-grid': `
      <div class="scanning-grid-container">
        <div class="sg-grid"></div>
        <div class="sg-line sg-line-h"></div>
        <div class="sg-line sg-line-v"></div>
        <div class="sg-marker" style="left: 30%; top: 40%;"></div>
        <div class="sg-marker" style="left: 70%; top: 60%;"></div>
      </div>
    `,
    'agent-log': `
      <div class="agent-log-container">
        <div class="al-header">AGENT LOGS</div>
        <div class="al-body">
          <div class="al-item"><span class="al-time">10:42</span> <span class="al-msg">Navi: Target localized.</span></div>
          <div class="al-item"><span class="al-time">10:43</span> <span class="al-msg">Larvis: Syncing nodes...</span></div>
          <div class="al-item warning"><span class="al-time">10:45</span> <span class="al-msg">System: Latency detected.</span></div>
          <div class="al-item success"><span class="al-time">10:48</span> <span class="al-msg">Claw: Task completed.</span></div>
        </div>
      </div>
    `,
    'hud-center': `
      <div class="hud-center-container">
        <div class="hc-outer-glow"></div>
        <div class="hc-rings">
          <div class="hc-ring hc-ring-1"></div>
          <div class="hc-ring hc-ring-2"></div>
          <div class="hc-ring hc-ring-3"></div>
        </div>
        <div class="hc-arcs">
          <svg viewBox="0 0 200 200">
            <path class="hc-arc-path" d="M100,20 A80,80 0 0,1 180,100" />
            <path class="hc-arc-path" d="M180,100 A80,80 0 0,1 100,180" />
            <path class="hc-arc-path" d="M100,180 A80,80 0 0,1 20,100" />
            <path class="hc-arc-path" d="M20,100 A80,80 0 0,1 100,20" />
          </svg>
        </div>
        <div class="hc-core">
          <div class="hc-core-inner"></div>
          <div class="hc-core-text">MASTER</div>
        </div>
        <div class="hc-metrics">
          <div class="hc-m-item" style="top: -20px; left: 50%; translate: -50% 0;">CPU 12%</div>
          <div class="hc-m-item" style="bottom: -20px; left: 50%; translate: -50% 0;">RAM 45%</div>
        </div>
      </div>
    `,
    'hud-arc': `
      <div class="hud-arc-container">
        <svg viewBox="0 0 100 100">
          <path class="ha-bg" d="M50,10 A40,40 0 0,1 90,50" />
          <path class="ha-fill" d="M50,10 A40,40 0 0,1 90,50" />
        </svg>
        <div class="ha-label">DISK</div>
        <div class="ha-value">32%</div>
      </div>
    `,
    'hud-tag': `
      <div class="hud-tag-container">
        <div class="ht-line"></div>
        <div class="ht-box">
          <span class="ht-title">DIAGNOSTICS</span>
          <span class="ht-val">STABLE [OK]</span>
        </div>
      </div>
    `
  };
  
  // ==========================================
  // ANIMATIONS & UPDATES
  // ==========================================
  
  function updateClock() {
    const clocks = document.querySelectorAll('.clock-display');
    if (clocks.length === 0) return;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-TW', { hour12: false });
    const dateStr = now.toLocaleDateString('zh-TW').replace(/\//g, '-');
    
    clocks.forEach(c => {
      c.querySelector('.clock-time').textContent = timeStr;
      c.querySelector('.clock-date').textContent = dateStr;
    });
  }
  setInterval(updateClock, 1000);
  
  const waveformState = {
    offset: 0,
    active: true
  };
  
  function drawWaveforms() {
    const canvases = document.querySelectorAll('.waveform-canvas');
    canvases.forEach(canvas => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00d4ff';
      
      const mid = canvas.height / 2;
      const step = 2;
      
      for (let x = 0; x < canvas.width; x += step) {
        const y = mid + Math.sin((x + waveformState.offset) * 0.05) * (canvas.height * 0.3) * Math.sin(x * 0.01 + waveformState.offset * 0.02);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();
    });
    
    waveformState.offset += 2;
    if (waveformState.active) requestAnimationFrame(drawWaveforms);
  }
  requestAnimationFrame(drawWaveforms);
  
  // ==========================================
  // EDIT MODE
  // ==========================================
  
  let systemMode = 'arranger'; // 'arranger' or 'studio'
  
  const sysModeSwitcher = document.getElementById('system-mode-switcher');
  const sysModeBtns = document.querySelectorAll('.sys-mode-btn');
  const arrangerTools = document.querySelectorAll('.arranger-tool');
  const studioTools = document.querySelectorAll('.studio-tool');
  
  sysModeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
          sysModeBtns.forEach(b => b.classList.remove('active'));
          const targetBtn = e.currentTarget;
          targetBtn.classList.add('active');
          systemMode = targetBtn.dataset.sysmode;
          updateSystemModeUI();
      });
  });
  
  function updateSystemModeUI() {
      if (!editMode) return;
      
      if (systemMode === 'arranger') {
          arrangerTools.forEach(el => el.classList.remove('hidden'));
          studioTools.forEach(el => el.classList.add('hidden'));
          studioStage.classList.add('hidden');
          drawingLayer.classList.add('hidden');
          const selectBtn = document.querySelector('.draw-tool[data-tool="select"]');
          if (selectBtn) selectBtn.click();
      } else {
          arrangerTools.forEach(el => el.classList.add('hidden'));
          studioTools.forEach(el => el.classList.remove('hidden'));
          studioStage.classList.remove('hidden');
          drawingLayer.classList.remove('hidden');
          // Clear current selection when entering studio
          document.querySelectorAll('.selected-item').forEach(el => el.classList.remove('selected-item'));
      }
  }

  // ==========================================
  // HISTORY / UNDO SYSTEM
  // ==========================================
  const historyStack = [];
  function saveHistory() {
      if (systemMode !== 'studio') return;
      historyStack.push(studioStage.innerHTML);
      if (historyStack.length > 50) historyStack.shift();
  }
  
  function undoHistory() {
      if (historyStack.length === 0) return;
      studioStage.innerHTML = historyStack.pop();
      // Re-bind listeners if any (not needed for simple SVG div)
      document.querySelectorAll('.selected-item').forEach(el => el.classList.remove('selected-item'));
      saveLayout();
  }

  if (btnUndo) btnUndo.addEventListener('click', undoHistory);
  document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'z') {
          e.preventDefault();
          undoHistory();
      }
  });

  function toggleEditMode() {
    editMode = !editMode;
    document.querySelectorAll('.widget, .element').forEach(item => {
      item.classList.toggle('editable', editMode);
    });
    
    if (sysModeSwitcher) {
        if (editMode) {
            sysModeSwitcher.classList.remove('hidden');
            updateSystemModeUI();
        } else {
            sysModeSwitcher.classList.add('hidden');
            arrangerTools.forEach(el => el.classList.add('hidden'));
            studioTools.forEach(el => el.classList.add('hidden'));
            const selectBtn = document.querySelector('.draw-tool[data-tool="select"]');
            if (selectBtn) selectBtn.click();
        }
    }
    
    console.log(`[Navi Dashboard] Edit mode: ${editMode ? 'ON' : 'OFF'} | Mode: ${systemMode}`);
  }
  
  editToggle.addEventListener('change', toggleEditMode);
  
  // ==========================================
  // MODAL
  // ==========================================
  
  function showModal() {
    if (!editMode) {
      alert('請先開啟編輯模式');
      return;
    }
    modal.classList.remove('hidden');
  }
  
  function hideModal() {
    modal.classList.add('hidden');
  }
  
  addWidgetBtn.addEventListener('click', showModal);
  addElementBtn.addEventListener('click', showModal);
  modalClose.addEventListener('click', hideModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });
  
  // ==========================================
  // ADD WIDGET / ELEMENT
  // ==========================================
  
  function addItem(type, itemType, layoutData = null, target = canvas) {
    const item = document.createElement('div');
    item.className = `${itemType} jarvis-${itemType} ${itemType === 'widget' ? 'window' : ''}`;
    item.dataset.widget = type;
    item.dataset.type = itemType;
    
    if (layoutData) {
      item.style.left = layoutData.left;
      item.style.top = layoutData.top;
      item.style.width = layoutData.width;
      item.style.height = layoutData.height;
      if (layoutData.customProperties) {
         for (const [k, v] of Object.entries(layoutData.customProperties)) {
             if (k !== 'widget' && k !== 'type') {
                 item.dataset[k] = v;
             }
         }
      }
    } else {
      // Random position
      const left = 10 + Math.random() * 40;
      const top = 15 + Math.random() * 30;
      item.style.left = `${left}%`;
      item.style.top = `${top}%`;
      
      if (itemType === 'widget') {
        item.style.width = '220px';
        item.style.height = '160px';
      } else {
        // Element defaults
        const sizes = {
          'corner-tl': [60, 60], 'corner-tr': [60, 60], 'corner-bl': [60, 60], 'corner-br': [60, 60],
          'scanline': ['25%', 2], 'vdata': [30, 200], 'waveform': [200, 80], 'hud': [600, 400],
          'clock': [140, 50], 'battery': [100, 40], 'text': [180, 40], 'core': [120, 120],
          'hexagon': [100, 115], 'gauge': [140, 140], 'radar': [120, 120], 'donut': [80, 80], 'arc': [120, 60],
          'core-v2': [240, 240], 'scanning-grid': [300, 200], 'agent-log': [250, 200],
          'hud-center': [300, 300], 'hud-arc': [120, 120], 'hud-tag': [180, 40]
        };
        const s = sizes[type] || [100, 100];
        item.style.width = typeof s[0] === 'number' ? `${s[0]}px` : s[0];
        item.style.height = typeof s[1] === 'number' ? `${s[1]}px` : s[1];
      }
    }
    
    const templateString = (itemType === 'widget' ? widgetTemplates[type] : elementTemplates[type]);
    if (templateString) {
        item.innerHTML = templateString;
    } else {
        item.innerHTML = `<div class="element-placeholder">[${type}]</div>`;
        item.style.background = 'rgba(0, 212, 255, 0.1)';
        item.style.border = '1px solid var(--color-cyan)';
    }
    
    if (itemType === 'widget') {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      item.appendChild(resizeHandle);
      setupWidgetEvents(item);
    } else {
      item.addEventListener('mousedown', startDrag);
    }
    
    if (editMode) {
      item.classList.add('editable');
    }
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = itemType === 'widget' ? 'widget-delete' : 'item-delete';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      item.remove();
      saveLayout();
    };
    item.appendChild(deleteBtn);
    
    target.appendChild(item);
    item.classList.toggle('editable', editMode);
    
    return item;
  }
  
  // Use event delegation on modal with improved group detection
  modal.addEventListener('click', (e) => {
    const option = e.target.closest('.widget-option');
    if (!option) return;
    
    const type = option.dataset.type;
    const section = option.closest('.modal-section');
    const itemType = section ? (section.dataset.group || 'element') : 'element';
    
    addItem(type, itemType);
    saveLayout();
    hideModal();
  });
  
  // ==========================================
  // DRAWING TOOLS
  // ==========================================
  
  function generateShapePath(type, w, h, props = {}) {
      if (type === 'line') {
          return `M 0 0 L ${w} ${h}`;
      } else if (type === 'rect') {
          const rectW = parseFloat(props.width) || w;
          const rectH = parseFloat(props.height) || h;
          return `M 0 0 H ${rectW} V ${rectH} H 0 Z`;
      } else if (type === 'circle' ) {
          const r = parseFloat(props.r) || w/2;
          return `M 0 ${r} A ${r} ${r} 0 1 0 ${r*2} ${r} A ${r} ${r} 0 1 0 0 ${r}`;
      } else if (type === 'ellipse') {
          const rx = parseFloat(props.rx) || w/2;
          const ry = parseFloat(props.ry) || h/2;
          return `M 0 ${ry} A ${rx} ${ry} 0 1 0 ${rx*2} ${ry} A ${rx} ${ry} 0 1 0 0 ${ry}`;
      } else if (type === 'sector') {
          const r = parseFloat(props.r) || Math.min(w,h)/2;
          const start = parseFloat(props.start) || 0;
          let end = parseFloat(props.end) || 90;
          if (end <= start) end = start + 1; // prevent SVG collapse
          
          const startRads = (start - 90) * Math.PI / 180.0;
          const endRads = (end - 90) * Math.PI / 180.0;
          
          const x1 = r + r * Math.cos(startRads);
          const y1 = r + r * Math.sin(startRads);
          const x2 = r + r * Math.cos(endRads);
          const y2 = r + r * Math.sin(endRads);
          
          const largeArcFlag = end - start <= 180 ? "0" : "1";
          
          return `M ${r} ${r} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      } else if (type === 'polygon') {
          const r = parseFloat(props.r) || Math.min(w,h)/2;
          const sides = parseInt(props.sides) || 5;
          let path = "";
          for (let i = 0; i < sides; i++) {
              const angle = -Math.PI / 2 + (i * 2 * Math.PI / sides);
              const px = r + r * Math.cos(angle);
              const py = r + r * Math.sin(angle);
              path += (i === 0 ? "M " : "L ") + px + " " + py + " ";
          }
          return path + "Z";
      }
      return "";
  }
  
  let currentTool = 'select'; // 'select', 'direct', 'line', 'rect', 'circle', 'ellipse', 'polygon', 'sector', 'text'
  let isDrawingShape = false;
  let drawStart = { x: 0, y: 0 };
  
  const drawingLayer = document.getElementById('drawing-layer');
  const tempDrawPath = document.getElementById('temp-draw-path');
  
  document.querySelectorAll('.draw-tool').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.draw-tool').forEach(b => b.classList.remove('active'));
      const targetBtn = e.currentTarget;
      targetBtn.classList.add('active');
      currentTool = targetBtn.dataset.tool;
      
      if (currentTool !== 'select' && currentTool !== 'direct') {
        drawingLayer.classList.remove('hidden');
        drawingLayer.classList.add('active');
      } else {
        drawingLayer.classList.remove('hidden');
        drawingLayer.classList.remove('active');
      }
    });
  });

  // Selection & Marquee Helpers
  let isMarqueeing = false;
  let marqueeBox = null;
  let marqueeStart = { x: 0, y: 0 };

  function startMarquee(e) {
      isMarqueeing = true;
      const rect = canvas.getBoundingClientRect();
      marqueeStart.x = e.clientX - rect.left;
      marqueeStart.y = e.clientY - rect.top;
      
      marqueeBox = document.createElement('div');
      marqueeBox.className = 'selection-marquee';
      marqueeBox.style.left = marqueeStart.x + 'px';
      marqueeBox.style.top = marqueeStart.y + 'px';
      canvas.appendChild(marqueeBox);
      
      if (!e.shiftKey) {
          document.querySelectorAll('.selected-item').forEach(el => el.classList.remove('selected-item'));
      }
  }

  function updateMarquee(e) {
      if (!isMarqueeing || !marqueeBox) return;
      const rect = canvas.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      marqueeBox.style.left = Math.min(marqueeStart.x, curX) + 'px';
      marqueeBox.style.top = Math.min(marqueeStart.y, curY) + 'px';
      marqueeBox.style.width = Math.abs(marqueeStart.x - curX) + 'px';
      marqueeBox.style.height = Math.abs(marqueeStart.y - curY) + 'px';
  }

  function endMarquee(e) {
      if (!isMarqueeing || !marqueeBox) return;
      const mRect = marqueeBox.getBoundingClientRect();
      
      const targetLayer = systemMode === 'studio' ? studioStage : canvas;
      const selector = systemMode === 'studio' ? '.element' : '.widget, .element';
      targetLayer.querySelectorAll(selector).forEach(item => {
          const iRect = item.getBoundingClientRect();
          const overlap = !(mRect.right < iRect.left || mRect.left > iRect.right || 
                            mRect.bottom < iRect.top || mRect.top > iRect.bottom);
          if (overlap) item.classList.add('selected-item');
      });
      marqueeBox.remove();
      marqueeBox = null;
      isMarqueeing = false;
      const selected = document.querySelectorAll('.selected-item');
      if (selected.length === 1) { currentItem = selected[0]; openSidebar(currentItem); }
      else { currentItem = null; sidebar.classList.add('hidden'); }
  }

  // DRAWING & MARQUEE LISTENERS
  drawingLayer.addEventListener('mousedown', (e) => {
    const rect = drawingLayer.getBoundingClientRect();
    drawStart.x = e.clientX - rect.left;
    drawStart.y = e.clientY - rect.top;

    if (currentTool === 'select') {
        startMarquee(e);
    } else {
        isDrawingShape = true;
        tempDrawPath.style.display = 'block';
        tempDrawPath.setAttribute('d', '');
        saveHistory(); // Save state before drawing
    }
  });

  drawingLayer.addEventListener('mousemove', (e) => {
    const rect = drawingLayer.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (isMarqueeing) {
        updateMarquee(e);
        return;
    }
    if (!isDrawingShape) return;
    
    const w = Math.abs(curX - drawStart.x);
    const h = Math.abs(curY - drawStart.y);
    const x = Math.min(curX, drawStart.x);
    const y = Math.min(curY, drawStart.y);
    
    const d = generateShapePath(currentTool, w, h);
    tempDrawPath.setAttribute('d', d);
    tempDrawPath.setAttribute('transform', `translate(${x}, ${y})`);
  });

  drawingLayer.addEventListener('mouseup', (e) => {
    if (isMarqueeing) { endMarquee(e); return; }
    if (!isDrawingShape) return;
    isDrawingShape = false;
    tempDrawPath.style.display = 'none';
    
    const rect = drawingLayer.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const w = Math.abs(curX - drawStart.x);
    const h = Math.abs(curY - drawStart.y);
    const x = Math.min(curX, drawStart.x);
    const y = Math.min(curY, drawStart.y);
    
    if (w < 5 && h < 5 && currentTool !== 'text') return;
    
    const targetLayer = systemMode === 'studio' ? studioStage : canvas;
    const item = addItem(currentTool, 'element', null, targetLayer);
    
    const layerRect = targetLayer.getBoundingClientRect();
    if (systemMode === 'studio') {
        item.style.left = `${x}px`; // use pixels for studio
        item.style.top = `${y}px`;
    } else {
        item.style.left = `${(x / layerRect.width) * 100}%`;
        item.style.top = `${(y / layerRect.height) * 100}%`;
    }
    item.style.width = `${w}px`;
    item.style.height = `${h}px`;
    
    item.dataset.sysShape = currentTool;
    const d = generateShapePath(currentTool, w, h);
    
    const pathEl = item.querySelector('path');
    if (pathEl) pathEl.setAttribute('d', d);
    
    const svgEl = item.querySelector('svg');
    if (svgEl) svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
    
    saveLayout();
  });

  // ==========================================
  // DRAG & RESIZE

  // ==========================================
  
  function setupWidgetEvents(widget) {
    widget.addEventListener('mousedown', startDrag);
    const handle = widget.querySelector('.resize-handle');
    if (handle) {
      handle.addEventListener('mousedown', startResize);
    }
  }
  
  function startDrag(e) {
    if (!editMode) return;
    if (e.target.closest('.resize-handle') || e.target.closest('.item-delete') || e.target.closest('.widget-delete')) return;
    
    isDragging = true;
    currentItem = e.currentTarget;
    
    const rect = currentItem.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    e.preventDefault();
  }
  
  function startResize(e) {
    if (!editMode) return;
    
    isResizing = true;
    currentItem = e.currentTarget.parentElement;
    
    const rect = currentItem.getBoundingClientRect();
    initialSize.width = rect.width;
    initialSize.height = rect.height;
    initialPos.x = e.clientX;
    initialPos.y = e.clientY;
    
    e.preventDefault();
    e.stopPropagation();
  }
  
  function handleMouseMove(e) {
    if (isDragging && currentItem) {
      const canvasRect = canvas.getBoundingClientRect();
      let left = e.clientX - canvasRect.left - dragOffset.x;
      let top = e.clientY - canvasRect.top - dragOffset.y;
      
      left = Math.max(0, Math.min(left, canvasRect.width - currentItem.offsetWidth));
      top = Math.max(0, Math.min(top, canvasRect.height - currentItem.offsetHeight));
      
      currentItem.style.left = `${(left / canvasRect.width) * 100}%`;
      currentItem.style.top = `${(top / canvasRect.height) * 100}%`;
    }
    
    if (isResizing && currentItem) {
      const deltaX = e.clientX - initialPos.x;
      const deltaY = e.clientY - initialPos.y;
      
      currentItem.style.width = `${Math.max(60, initialSize.width + deltaX)}px`;
      currentItem.style.height = `${Math.max(40, initialSize.height + deltaY)}px`;
    }
  }
  
  function handleMouseUp() {
    if (isDragging || isResizing) saveLayout();
    isDragging = false;
    isResizing = false;
    // Keep currentItem for property editing if not dragging
  }
  
  // Selection for Design & Multi-select
  canvas.addEventListener('click', (e) => {
    if (!editMode) return;
    const item = e.target.closest('.widget, .element');
    if (!item) return;
    
    // Multi-select with Shift
    if (e.shiftKey) {
        item.classList.toggle('selected-item');
    } else {
        document.querySelectorAll('.selected-item').forEach(el => el.classList.remove('selected-item'));
        item.classList.add('selected-item');
    }
    
    const selectedItems = document.querySelectorAll('.selected-item');
    if (selectedItems.length === 1) {
        currentItem = selectedItems[0];
        openSidebar(currentItem);
    } else {
        currentItem = null; 
        sidebar.classList.add('hidden'); // Hide sidebar properties when multi-selecting
    }
  });

  // ==========================================
  // STUDIO TOOLS: BOOLEAN & GROUPING
  // ==========================================
  
  function translatePath(d, dx, dy) {
      if (!d) return "";
      return d.replace(/([ML])\s*([\d\.-]+)\s*([\d\.-]+)/g, (m, op, x, y) => {
          return `${op} ${parseFloat(x) + dx} ${parseFloat(y) + dy}`;
      }).replace(/([HV])\s*([\d\.-]+)/g, (m, op, val) => {
          return `${op} ${parseFloat(val) + (op === 'H' ? dx : dy)}`;
      }).replace(/A\s*([\d\.-]+)\s*([\d\.-]+)\s*([\d\.-]+)\s*(\d)\s*(\d)\s*([\d\.-]+)\s*([\d\.-]+)/g, (m, rx, ry, rot, laf, sf, x, y) => {
          return `A ${rx} ${ry} ${rot} ${laf} ${sf} ${parseFloat(x) + dx} ${parseFloat(y) + dy}`;
      });
  }

  document.querySelectorAll('.boolean-tool').forEach(btn => {
      btn.addEventListener('click', () => {
          const selected = Array.from(studioStage.querySelectorAll('.selected-item'));
          if (selected.length < 2) return alert("請選取至少兩個形狀來執行布林運算");
          
          saveHistory(); 
          const op = btn.dataset.op;
          
          // 1. Convert SVG paths to Paper.js Paths
          const paperPaths = selected.map(el => {
              const pathEl = el.querySelector('path');
              const d = pathEl.getAttribute('d');
              const rect = el.getBoundingClientRect();
              const stageRect = studioStage.getBoundingClientRect();
              
              const p = new paper.Path(d);
              // Map SVG local (0,0) to absolute stage position
              p.bounds.topLeft = new paper.Point(
                  rect.left - stageRect.left,
                  rect.top - stageRect.top
              );
              return p;
          });

          // 2. Perform Boolean Operation
          let result = paperPaths[0];
          for (let i = 1; i < paperPaths.length; i++) {
              let nextAction;
              if (op === 'union') nextAction = result.unite(paperPaths[i]);
              else if (op === 'intersect') nextAction = result.intersect(paperPaths[i]);
              else if (op === 'subtract') nextAction = result.subtract(paperPaths[i]);
              
              if (nextAction) {
                  result.remove();
                  paperPaths[i].remove();
                  result = nextAction;
              }
          }

          // 3. Update DOM with result
          const finalBounds = result.bounds;
          const masterPathData = result.pathData;

          // Remove old elements
          selected.forEach(el => el.remove());

          // Create new primary element
          const newItem = addItem('custom-bool', 'element', null, studioStage);
          newItem.style.left = `${finalBounds.x}px`;
          newItem.style.top = `${finalBounds.y}px`;
          newItem.style.width = `${finalBounds.width}px`;
          newItem.style.height = `${finalBounds.height}px`;
          
          const svg = newItem.querySelector('svg');
          const path = newItem.querySelector('path');
          if (svg && path) {
              // Normalize pathData to local 0,0 relative to new bounds
              const localized = new paper.Path(masterPathData);
              localized.bounds.topLeft = new paper.Point(0, 0);
              path.setAttribute('d', localized.pathData);
              svg.setAttribute('viewBox', `0 0 ${finalBounds.width} ${finalBounds.height}`);
              localized.remove();
          }
          
          result.remove(); // Clean up paper object
          newItem.classList.add('selected-item');
          saveLayout();
          
          newItem.classList.add('selected-item');
          saveLayout();
      });
  });

  // ==========================================
  // IMPORT TO DASHBOARD
  // ==========================================
  if (btnImportStudio) {
      btnImportStudio.addEventListener('click', () => {
          const elements = Array.from(studioStage.querySelectorAll('.element'));
          if (elements.length === 0) return alert("設計畫布上沒有任何內容");
          
          const groupName = prompt("請為此自定義元件命名：", "MyCustomWidget");
          if (!groupName) return;

          // Encapsulate into a new template
          const wrapper = document.createElement('div');
          wrapper.className = 'studio-import-wrapper';
          wrapper.style.width = '100%';
          wrapper.style.height = '100%';
          
          // Copy styles and content
          elements.forEach(el => {
              const clone = el.cloneNode(true);
              clone.classList.remove('selected-item', 'editable');
              wrapper.appendChild(clone);
          });

          const templateName = `custom-${Date.now()}`;
          elementTemplates[templateName] = wrapper.innerHTML;
          
          // Add to main canvas
          const newItem = addItem(templateName, 'element', {
              left: '40%', top: '40%', width: '200px', height: '200px',
              customProperties: { customTitle: groupName }
          }, canvas);
          
          // Switch back to arranger
          document.querySelector('.sys-mode-btn[data-sysmode="arranger"]').click();
          alert(`元件「${groupName}」已成功匯入主畫布！`);
          saveLayout();
      });
  }

  const btnGroup = document.getElementById('btn-group');
  if (btnGroup) {
      btnGroup.addEventListener('click', () => {
          const selected = document.querySelectorAll('.selected-item');
          if (selected.length < 2) return alert("請選取至少兩個元件建立群組");
          
          let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
          const canvasRect = canvas.getBoundingClientRect();
          
          selected.forEach(el => {
             const rect = el.getBoundingClientRect();
             minL = Math.min(minL, rect.left - canvasRect.left);
             minT = Math.min(minT, rect.top - canvasRect.top);
             maxR = Math.max(maxR, rect.right - canvasRect.left);
             maxB = Math.max(maxB, rect.bottom - canvasRect.top);
          });
          
          const w = maxR - minL;
          const h = maxB - minT;
          
          const groupDiv = document.createElement('div');
          groupDiv.className = 'element jarvis-element';
          groupDiv.style.left = `${(minL / canvasRect.width) * 100}%`;
          groupDiv.style.top = `${(minT / canvasRect.height) * 100}%`;
          groupDiv.style.width = `${w}px`;
          groupDiv.style.height = `${h}px`;
          groupDiv.style.position = 'absolute';
          groupDiv.style.background = 'transparent'; // prevent bg overlay
          
          selected.forEach(el => {
             const rect = el.getBoundingClientRect();
             const cL = rect.left - canvasRect.left - minL;
             const cT = rect.top - canvasRect.top - minT;
             
             el.style.left = `${cL}px`;
             el.style.top = `${cT}px`;
             el.classList.remove('selected-item', 'element', 'jarvis-element', 'editable');
             el.style.position = 'absolute';
             
             const handle = el.querySelector('.resize-handle');
             if (handle) handle.remove();
             const delBtn = el.querySelector('.item-delete') || el.querySelector('.widget-delete');
             if (delBtn) delBtn.remove();
             
             groupDiv.appendChild(el);
          });
          
          groupDiv.dataset.widget = 'custom-group-' + Date.now();
          groupDiv.dataset.type = 'element';
          const delBtn = document.createElement('button');
          delBtn.className = 'item-delete';
          delBtn.textContent = '✕';
          delBtn.onclick = (e) => { e.stopPropagation(); groupDiv.remove(); saveLayout(); };
          groupDiv.appendChild(delBtn);
          groupDiv.addEventListener('mousedown', startDrag);
          
          canvas.appendChild(groupDiv);
          groupDiv.classList.add('editable', 'selected-item');
          
          elementTemplates[groupDiv.dataset.widget] = groupDiv.innerHTML;
          saveLayout();
      });
  }
  
  const btnUngroup = document.getElementById('btn-ungroup');
  if (btnUngroup) {
      btnUngroup.addEventListener('click', () => {
          const selected = document.querySelector('.selected-item');
          if (!selected || !selected.dataset.widget || !selected.dataset.widget.startsWith('custom-group')) {
              return alert("請選取一個群組來解散");
          }
          alert("解散群組功能已觸發，此功能即將完善！");
      });
  }
  
  // Sidebar Logic
  const sidebar = document.getElementById('property-editor');
  const closeSidebar = document.getElementById('close-sidebar');
  const applyPropsBtn = document.getElementById('apply-props');
  
  function openSidebar(item) {
    sidebar.classList.remove('hidden');
    
    // Fill values
    document.getElementById('prop-title').value = item.dataset.customTitle || '';
    document.getElementById('prop-color').value = item.dataset.themeColor || 'cyan';
    document.getElementById('prop-data').value = item.dataset.dataPath || '';
    
    // Custom shape styling
    const pathEl = item.querySelector('.svg-shape-inner path');
    const fillInput = document.getElementById('prop-fill');
    const strokeInput = document.getElementById('prop-stroke');
    const strokeWidthInput = document.getElementById('prop-stroke-width');
    
    if (pathEl && fillInput) {
        fillInput.value = item.dataset.customFill || rgbToHex(pathEl.getAttribute('fill') || '#00d4ff');
        strokeInput.value = item.dataset.customStroke || rgbToHex(pathEl.getAttribute('stroke') || '#00d4ff');
        strokeWidthInput.value = item.dataset.customStrokeWidth || pathEl.getAttribute('stroke-width') || '2';
    }

    // Toggle Parametric panels based on shape
    document.querySelectorAll('[id^="param-"]').forEach(el => el.classList.add('hidden'));
    const sysShape = item.dataset.sysShape;
    if (sysShape) {
        const paramPanel = document.getElementById(`param-${sysShape}`);
        if (paramPanel) paramPanel.classList.remove('hidden');
        
        // Populate inputs
        if (sysShape === 'rect') {
            document.getElementById('p-rect-w').value = item.dataset.width || '';
            document.getElementById('p-rect-h').value = item.dataset.height || '';
        } else if (sysShape === 'circle') {
            document.getElementById('p-circ-d').value = (parseFloat(item.dataset.r) || 0) * 2;
        } else if (sysShape === 'ellipse') {
            document.getElementById('p-ell-rx').value = (parseFloat(item.dataset.rx) || 0) * 2;
            document.getElementById('p-ell-ry').value = (parseFloat(item.dataset.ry) || 0) * 2;
        } else if (sysShape === 'sector') {
            document.getElementById('p-sec-r').value = item.dataset.r || '';
            document.getElementById('p-sec-start').value = item.dataset.start || '0';
            document.getElementById('p-sec-end').value = item.dataset.end || '90';
        } else if (sysShape === 'polygon') {
            document.getElementById('p-poly-r').value = item.dataset.r || '';
            document.getElementById('p-poly-sides').value = item.dataset.sides || '5';
        }
    }
  }

  // Helper for hex conversion (since color input expects #rrggbb)
  function rgbToHex(val) {
    if (!val) return '#000000';
    if (val.startsWith('#')) {
        if (val.length === 9) return val.slice(0, 7); // Handle #rrggbbaa by ignoring alpha
        return val;
    }
    if (val.startsWith('rgba')) {
        const parts = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (parts) {
            return '#' + [parts[1], parts[2], parts[3]].map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }
    }
    return '#00d4ff'; // fallback
  }
  
  closeSidebar.onclick = () => {
    sidebar.classList.add('hidden');
    document.querySelectorAll('.selected-item').forEach(el => el.classList.remove('selected-item'));
  };
  
  // Real-time graphics update
  function updateCurrentItemGraphics() {
    if (!currentItem) return;
    
    const title = document.getElementById('prop-title').value;
    const color = document.getElementById('prop-color').value;
    const data = document.getElementById('prop-data').value;
    
    const fillStr = document.getElementById('prop-fill')?.value;
    const strokeStr = document.getElementById('prop-stroke')?.value;
    const strokeWStr = document.getElementById('prop-stroke-width')?.value;
    
    // Apply dataset
    currentItem.dataset.customTitle = title;
    currentItem.dataset.themeColor = color;
    currentItem.dataset.dataPath = data;
    if (fillStr) currentItem.dataset.customFill = fillStr;
    if (strokeStr) currentItem.dataset.customStroke = strokeStr;
    if (strokeWStr) currentItem.dataset.customStrokeWidth = strokeWStr;
    
    // Read and Apply Parametric Attributes
    const sysShape = currentItem.dataset.sysShape;
    let newParams = {};
    if (sysShape === 'rect') {
        newParams.width = document.getElementById('p-rect-w').value;
        newParams.height = document.getElementById('p-rect-h').value;
    } else if (sysShape === 'circle') {
        newParams.r = parseFloat(document.getElementById('p-circ-d').value) / 2 || 10;
    } else if (sysShape === 'ellipse') {
        newParams.rx = parseFloat(document.getElementById('p-ell-rx').value) / 2 || 10;
        newParams.ry = parseFloat(document.getElementById('p-ell-ry').value) / 2 || 10;
    } else if (sysShape === 'sector') {
        newParams.r = document.getElementById('p-sec-r').value;
        newParams.start = document.getElementById('p-sec-start').value;
        newParams.end = document.getElementById('p-sec-end').value;
    } else if (sysShape === 'polygon') {
        newParams.r = document.getElementById('p-poly-r').value;
        newParams.sides = document.getElementById('p-poly-sides').value;
    }
    
    for (const [k, v] of Object.entries(newParams)) {
        if (v !== undefined) currentItem.dataset[k] = v;
    }
    
    // Update Visuals title
    const titleEl = currentItem.querySelector('.widget-title, .clock-time, .arc-value, .gauge-label, .hex-label, .c2-label');
    if (titleEl && title) {
      if (titleEl.classList.contains('widget-title')) titleEl.textContent = title;
      else titleEl.textContent = title; 
    }
    
    // Apply Theme Color
    currentItem.style.setProperty('--color-theme', `var(--color-${color})`);
    currentItem.style.setProperty('--color-theme-glow', `var(--color-${color}-glow)`);
    
    // Apply custom shape settings
    const pathEl = currentItem.querySelector('.svg-shape-inner path');
    if (pathEl) {
        if (fillStr) pathEl.setAttribute('fill', fillStr + '33'); 
        if (strokeStr) pathEl.setAttribute('stroke', strokeStr);
        if (strokeWStr) pathEl.setAttribute('stroke-width', strokeWStr);
        
        if (sysShape) {
            const fw = parseFloat(newParams.width || newParams.r*2 || newParams.rx*2 || currentItem.offsetWidth) || 50;
            const fh = parseFloat(newParams.height || newParams.r*2 || newParams.ry*2 || currentItem.offsetHeight) || 50;
            const newD = generateShapePath(sysShape, fw, fh, newParams);
            if (newD) {
                pathEl.setAttribute('d', newD);
                // Expand SVG viewBox
                currentItem.querySelector('svg').setAttribute('viewBox', `-2 -2 ${fw+4} ${fh+4}`);
                // Expand actual DOM container so it doesn't clip
                currentItem.style.width = `${fw}px`;
                currentItem.style.height = `${fh}px`;
            }
        }
    }
  }

  // Bind real-time input events for instant preview
  sidebar.addEventListener('input', updateCurrentItemGraphics);
  
  applyPropsBtn.onclick = () => {
    if (!currentItem) return;
    updateCurrentItemGraphics(); // ensure final state 
    saveLayout();
    alert('變更已即時生效並永久保存！');
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // ==========================================
  // LAYOUT PERSISTENCE
  // ==========================================
  
  function saveLayout() {
    const items = canvas.querySelectorAll('.widget, .element');
    const layout = Array.from(items).map(item => {
      const data = {
        type: item.dataset.widget,
        itemType: item.dataset.type,
        left: item.style.left,
        top: item.style.top,
        width: item.style.width,
        height: item.style.height,
        customProperties: { ...item.dataset } // Saves all keys
      };
      
      // Save raw HTML of custom drawn elements so they survive reload
      if (data.type && data.type.startsWith('custom-')) {
        data.innerHTML = item.innerHTML;
      }
      return data;
    });
    localStorage.setItem('navi-dashboard-layout', JSON.stringify(layout));
  }
  
  function loadLayout() {
    const saved = localStorage.getItem('navi-dashboard-layout');
    if (!saved || saved === '[]') {
      applyDefaultLayout();
      return;
    }
    
    try {
      const layout = JSON.parse(saved);
      canvas.querySelectorAll('.widget, .element').forEach(w => w.remove());
      layout.forEach(item => {
        // Restore custom drawn templates
        if (item.type.startsWith('custom-') && item.innerHTML) {
            elementTemplates[item.type] = item.innerHTML;
        }
        
        const newItem = addItem(item.type, item.itemType, item);
        if (item.customProperties) {
          // dataset is already mapped inside addItem
          
          // Apply Title visual
          const titleEl = newItem.querySelector('.widget-title, .clock-time, .arc-value, .gauge-label, .hex-label, .c2-label');
          if (titleEl && item.customProperties.customTitle) titleEl.textContent = item.customProperties.customTitle;
          
          // Apply Theme Color visual
          if (item.customProperties.themeColor) {
            newItem.style.setProperty('--color-theme', `var(--color-${item.customProperties.themeColor})`);
            newItem.style.setProperty('--color-theme-glow', `var(--color-${item.customProperties.themeColor}-glow)`);
          }
        }
      });
    } catch (err) {
      localStorage.removeItem('navi-dashboard-layout');
      applyDefaultLayout();
    }
  }
  
  function applyDefaultLayout() {
    console.log('[Navi Dashboard] Applying default layout');
    const defaults = [
      { type: 'agents', itemType: 'widget', left: '2%', top: '8%', width: '220px', height: '160px' },
      { type: 'tasks', itemType: 'widget', left: '25%', top: '8%', width: '220px', height: '160px' },
      { type: 'system', itemType: 'widget', left: '48%', top: '8%', width: '220px', height: '160px' },
      { type: 'clock', itemType: 'element', left: '72%', top: '2%', width: '140px', height: '50px' },
      { type: 'waveform', itemType: 'element', left: '72%', top: '10%', width: '200px', height: '80px' },
      { type: 'corner-tl', itemType: 'element', left: '1%', top: '1%', width: '60px', height: '60px' },
      { type: 'corner-br', itemType: 'element', left: '92%', top: '90%', width: '60px', height: '60px' }
    ];
    defaults.forEach(d => addItem(d.type, d.itemType, d));
  }
  
  function resetLayout() {
    if (confirm('確定要重置所有佈局嗎？')) {
      localStorage.removeItem('navi-dashboard-layout');
      location.reload();
    }
  }
  
  function exportLayout() {
    const saved = localStorage.getItem('navi-dashboard-layout');
    const blob = new Blob([saved || '[]'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `navi-layout-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  importLayoutBtn.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const layout = JSON.parse(event.target.result);
        localStorage.setItem('navi-dashboard-layout', JSON.stringify(layout));
        location.reload();
      } catch (err) {
        alert('無效的配置檔案');
      }
    };
    reader.readAsText(file);
  });
  
  resetLayoutBtn.addEventListener('click', resetLayout);
  exportLayoutBtn.addEventListener('click', exportLayout);
  
  // ==========================================
  // INIT
  // ==========================================
  
  loadLayout();
  updateClock();
  console.log('[Navi Dashboard] Ready.');
});
