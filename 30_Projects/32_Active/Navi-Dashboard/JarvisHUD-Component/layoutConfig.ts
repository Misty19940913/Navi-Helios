/**
 * Jarvis HUD Layout Configuration
 * Automatically migrated from Time.ini
 */

export interface HudMeter {
  name: string;
  type: 'IMAGE' | 'ROTATOR' | 'STRING';
  x: number;
  y: number;
  w?: number;
  h?: number;
  imageName?: string;
  measureName?: string;
  angle?: number; // Radians from INI, we will convert to deg
  offsetX?: number;
  offsetY?: number;
  rotationAngle?: number;
  valueReminder?: number;
  text?: string;
  style?: Record<string, any>;
}

export const JARVIS_LAYOUT_CONFIG = {
  metadata: {
    name: "[Iron_Man_HUD]Time",
    author: "SH Lee",
    viewBox: "0 0 720 505", // Exact match for TimeBG.png
    center: { x: 521, y: 323 } // 429+92, 231+92
  },
  meters: [
    {
      name: "Background",
      type: "IMAGE",
      x: 0,
      y: 0,
      imageName: "TimeBG.png"
    },
    {
      name: "MeterTime1",
      type: "STRING",
      x: 300,
      y: 62,
      measureName: "hours",
      angle: -0.6283,
      style: { fontSize: 13, fontFamily: 'Arial Black', color: '#FFFFFF' }
    },
    {
      name: "MeterTime2",
      type: "STRING",
      x: 325,
      y: 43,
      text: ":",
      angle: -0.4712,
      style: { fontSize: 13, fontFamily: 'Arial Black', color: '#FFFFFF' }
    },
    {
      name: "MeterTime3",
      type: "STRING",
      x: 337,
      y: 40,
      measureName: "minutes",
      angle: -0.4014,
      style: { fontSize: 13, fontFamily: 'Arial Black', color: '#FFFFFF' }
    },
    {
      name: "MeterHour",
      type: "ROTATOR",
      x: 429,
      y: 231,
      offsetX: 92,
      offsetY: 92,
      imageName: "hour.png",
      rotationAngle: 6.2832,
      valueReminder: 43200 // 12 hours
    },
    {
      name: "MeterMinute",
      type: "ROTATOR",
      x: 429,
      y: 231,
      offsetX: 92,
      offsetY: 92,
      imageName: "min.png",
      rotationAngle: 6.2832,
      valueReminder: 3600 // 1 hour
    },
    {
      name: "MeterSecond",
      type: "ROTATOR",
      x: 429,
      y: 231,
      offsetX: 92,
      offsetY: 92,
      imageName: "sec.png",
      rotationAngle: 6.2832,
      valueReminder: 60 // 1 minute
    },
    {
      name: "MeterOutterRing",
      type: "ROTATOR",
      x: 429,
      y: 231,
      offsetX: 92,
      offsetY: 92,
      imageName: "outring.png",
      rotationAngle: 6.2832,
      valueReminder: 240, // Decorative rotation speed
      isDecorative: true
    },
    {
      name: "MeterInnerRing",
      type: "ROTATOR",
      x: 429,
      y: 231,
      offsetX: 92,
      offsetY: 92,
      imageName: "inring.png",
      rotationAngle: -6.2832,
      valueReminder: 390,
      isDecorative: true
    }
  ] as HudMeter[]
};
