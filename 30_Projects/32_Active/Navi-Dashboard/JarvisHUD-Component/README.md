# Jarvis HUD React Component

This is a modern React transformation of the Iron Man HUD Jarvis Blue Rainmeter skin.

## 📁 Asset Setup

For this component to work, you must place the following images in your project's public directory (default path: `/public/assets/jarvis-hud/`):

1.  `TimeBG.png`
2.  `outring.png`
3.  `inring.png`
4.  `hour.png`
5.  `min.png`
6.  `sec.png`

> [!TIP]
> You can find these assets extracted in `temp_rmskin` within this folder.

## 🚀 Usage

```jsx
import JarvisHUD from './JarvisHUD';

function App() {
  return (
    <div style={{ background: '#000', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <JarvisHUD size={600} />
    </div>
  );
}
```

## ✨ Features

*   **Responsive**: Set the `size` prop to scale the entire HUD.
*   **Dynamic**: Real-time clock rotation for Hour, Minute, and Second hands.
*   **Animated**: Continuous counter-rotating decorative rings.
*   **Premium Look**: Added scanning line effects, pulsing separators, and cyan glow filters.
*   **High Performance**: Uses CSS animations for rotations to minimize React re-renders.
