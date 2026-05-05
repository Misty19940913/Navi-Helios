import React from 'react';

import BlueTime from './BlueTime';
import JarvisHDD from './JarvisHDD';
import JarvisLauncher from './JarvisLauncher';
import JarvisSystem from './JarvisSystem';
import JarvisUSB from './JarvisUSB';
import Jarvis3rdGig from './Jarvis3rdGig';
import JarvisCircles from './JarvisCircles';
import JarvisCustomClock from './JarvisCustomClock';
import JarvisRadar from './JarvisRadar';
import JarvisGreeter from './JarvisGreeter';
import JarvisTag from './JarvisTag';
import JarvisSuviHDD from './JarvisSuviHDD';
import JarvisRecycleBin from './JarvisRecycleBin';
import JarvisRotatorX from './JarvisRotatorX';
import JarvisSection1 from './JarvisSection1';
import JarvisSphere from './JarvisSphere';
import JarvisXClock from './JarvisXClock';
import JarvisAnalogTime from './JarvisAnalogTime';
import JarvisStats from './JarvisStats';
import JarvisSuviSystem from './JarvisSuviSystem';
import JarvisTuanRotator from './JarvisTuanRotator';
import JarvisHudLab from './JarvisHudLab';
import { TuanButton1, TuanButton2, TuanButton3 } from './JarvisTuanButton';
import JarvisTuanModel from './JarvisTuanModel';
import JarvisTuanCircle from './JarvisTuanCircle';
import JarvisTuanSliders from './JarvisTuanSliders';

export type WidgetType =
  | 'BLUE_TIME' | 'MARK7_HDD' | 'MARK7_LAUNCHER' | 'MARK7_SYSTEM' | 'MARK7_USB'
  | 'SUVI_3RDGIG' | 'SUVI_CIRCLES'
  | 'ULTIMATE_CLOCK' | 'ULTIMATE_RADAR' | 'ULTIMATE_GREETER' | 'ULTIMATE_TAG'
  | 'ULTIMATE_HDD' | 'ULTIMATE_TRASH' | 'ULTIMATE_ROTATOR' | 'ULTIMATE_SECTION'
  | 'ULTIMATE_SPHERE' | 'ULTIMATE_XCLOCK' | 'ULTIMATE_ANALOG' | 'ULTIMATE_STATS' | 'ULTIMATE_SUVI_SYS'
  | 'TUAN_ROTATER' | 'TUAN_BUTTON1' | 'TUAN_BUTTON2' | 'TUAN_BUTTON3'
  | 'TUAN_MODEL' | 'TUAN_CIRCLE' | 'TUAN_SLIDERS';

export interface WidgetDef {
  id: WidgetType;
  name: string;
  component: React.ComponentType;
  defaultWidth: number;
  defaultHeight: number;
}

export const WIDGET_REGISTRY: Record<WidgetType, WidgetDef> = {
  'BLUE_TIME':        { id: 'BLUE_TIME',        name: 'MARK7 BLUE TIME',        component: BlueTime,          defaultWidth: 360,  defaultHeight: 180 },
  'MARK7_HDD':        { id: 'MARK7_HDD',        name: 'MARK7 HDD STATUS',       component: JarvisHDD,         defaultWidth: 360,  defaultHeight: 250 },
  'MARK7_LAUNCHER':   { id: 'MARK7_LAUNCHER',   name: 'MARK7 LAUNCHER',         component: JarvisLauncher,    defaultWidth: 360,  defaultHeight: 274 },
  'MARK7_SYSTEM':     { id: 'MARK7_SYSTEM',     name: 'MARK7 SYSTEM',           component: JarvisSystem,      defaultWidth: 360,  defaultHeight: 414 },
  'MARK7_USB':        { id: 'MARK7_USB',        name: 'MARK7 USB DISK',         component: JarvisUSB,         defaultWidth: 358,  defaultHeight: 505 },

  'SUVI_3RDGIG':      { id: 'SUVI_3RDGIG',      name: 'SUVI 3RD GIG CLOCK',     component: Jarvis3rdGig,      defaultWidth: 240,  defaultHeight: 360 },
  'SUVI_CIRCLES':     { id: 'SUVI_CIRCLES',     name: 'SUVI CPU/RAM CIRCLES',   component: JarvisCircles,     defaultWidth: 360,  defaultHeight: 180 },

  'ULTIMATE_CLOCK':   { id: 'ULTIMATE_CLOCK',   name: 'ULTIMATE ALT CLOCK',     component: JarvisCustomClock, defaultWidth: 500,  defaultHeight: 250 },
  'ULTIMATE_RADAR':   { id: 'ULTIMATE_RADAR',   name: 'ULTIMATE RADAR',         component: JarvisRadar,       defaultWidth: 400,  defaultHeight: 400 },
  'ULTIMATE_GREETER': { id: 'ULTIMATE_GREETER', name: 'ULTIMATE GREETER',       component: JarvisGreeter,     defaultWidth: 450,  defaultHeight: 120 },
  'ULTIMATE_TAG':     { id: 'ULTIMATE_TAG',     name: 'ULTIMATE TAG',           component: JarvisTag,         defaultWidth: 400,  defaultHeight: 100 },
  'ULTIMATE_HDD':     { id: 'ULTIMATE_HDD',     name: 'ULTIMATE HDD',           component: JarvisSuviHDD,     defaultWidth: 275,  defaultHeight: 100 },
  'ULTIMATE_TRASH':   { id: 'ULTIMATE_TRASH',   name: 'ULTIMATE RECYCLE BIN',   component: JarvisRecycleBin,  defaultWidth: 350,  defaultHeight: 120 },
  'ULTIMATE_ROTATOR': { id: 'ULTIMATE_ROTATOR', name: 'ULTIMATE CORE ROTATOR',  component: JarvisRotatorX,    defaultWidth: 400,  defaultHeight: 400 },
  'ULTIMATE_SECTION': { id: 'ULTIMATE_SECTION', name: 'ULTIMATE ORBITAL',       component: JarvisSection1,    defaultWidth: 500,  defaultHeight: 500 },
  'ULTIMATE_SPHERE':  { id: 'ULTIMATE_SPHERE',  name: 'ULTIMATE SPHERE',        component: JarvisSphere,      defaultWidth: 500,  defaultHeight: 500 },
  'ULTIMATE_XCLOCK':  { id: 'ULTIMATE_XCLOCK',  name: 'ULTIMATE X-ROTATOR',     component: JarvisXClock,      defaultWidth: 400,  defaultHeight: 400 },
  'ULTIMATE_ANALOG':  { id: 'ULTIMATE_ANALOG',  name: 'ULTIMATE ANALOG TIME',   component: JarvisAnalogTime,  defaultWidth: 300,  defaultHeight: 300 },
  'ULTIMATE_STATS':   { id: 'ULTIMATE_STATS',   name: 'ULTIMATE MINI STATS',    component: JarvisStats,       defaultWidth: 300,  defaultHeight: 150 },
  'ULTIMATE_SUVI_SYS':{ id: 'ULTIMATE_SUVI_SYS',name: 'ULTIMATE DIAGNOSTIC',   component: JarvisSuviSystem,  defaultWidth: 360,  defaultHeight: 414 },

  'TUAN_ROTATER':     { id: 'TUAN_ROTATER',     name: 'TUAN V1.1 CORE ROTATOR', component: JarvisTuanRotator, defaultWidth: 600,  defaultHeight: 600 },
  'TUAN_BUTTON1':     { id: 'TUAN_BUTTON1',     name: 'TUAN BUTTON 01',         component: TuanButton1,       defaultWidth: 200,  defaultHeight: 200 },
  'TUAN_BUTTON2':     { id: 'TUAN_BUTTON2',     name: 'TUAN BUTTON 02',         component: TuanButton2,       defaultWidth: 200,  defaultHeight: 200 },
  'TUAN_BUTTON3':     { id: 'TUAN_BUTTON3',     name: 'TUAN BUTTON 03',         component: TuanButton3,       defaultWidth: 200,  defaultHeight: 200 },
  'TUAN_MODEL':       { id: 'TUAN_MODEL',       name: 'TUAN V1.1 SCANNER',      component: JarvisTuanModel,   defaultWidth: 600,  defaultHeight: 600 },
  'TUAN_CIRCLE':      { id: 'TUAN_CIRCLE',      name: 'TUAN V1.1 CORE CIRCLE',  component: JarvisTuanCircle,  defaultWidth: 500,  defaultHeight: 500 },
  'TUAN_SLIDERS':     { id: 'TUAN_SLIDERS',     name: 'TUAN V1.1 SLIDERS',      component: JarvisTuanSliders, defaultWidth: 600,  defaultHeight: 600 },
  'HUD_LAB':          { id: 'HUD_LAB',          name: 'HUD LAB',                component: JarvisHudLab,      defaultWidth: 1200, defaultHeight: 800 },
};

export const WIDGET_LIST = Object.values(WIDGET_REGISTRY);
