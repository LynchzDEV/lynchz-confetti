# React Confetti Shooter 🎉

A simple, lightweight React hook for creating confetti animations with directional shooting. Perfect for celebrations, notifications, and interactive experiences.

## ✨ Features

- 🎯 **Directional shooting**: Left, right, top, or center burst patterns
- 📍 **Source positioning**: Confetti originates from any element position
- 🎨 **Customizable**: Particle count, colors, and physics
- 💡 **One-line usage**: Just call `triggerConfetti('direction')`
- 📱 **Responsive**: Works on all screen sizes
- 🔧 **TypeScript**: Full type safety included
- 🪶 **Lightweight**: Zero dependencies (except React)

## 🚀 Installation

```bash
npm install react-confetti-shooter
```

Or with bun:

```bash
bun add react-confetti-shooter
```

## 📖 Usage

### Basic Usage

```tsx
import React from 'react';
import { useConfetti } from 'react-confetti-shooter';

function MyComponent() {
  const { triggerConfetti, ConfettiRenderer } = useConfetti();

  return (
    <div>
      <ConfettiRenderer />
      
      <button onClick={() => triggerConfetti('center')}>
        Celebrate! 🎉
      </button>
    </div>
  );
}
```

### Auto-Trigger on Component Load

```tsx
import React from 'react';
import { useConfetti } from 'react-confetti-shooter';

function WelcomeComponent() {
  const { ConfettiRenderer } = useConfetti({
    autoTrigger: {
      enabled: true,
      direction: 'center',
      count: 100,
      delay: 1000, // Wait 1 second after component mounts
    }
  });

  return (
    <div>
      <ConfettiRenderer />
      <h1>Welcome! 🎉</h1>
    </div>
  );
}
```

### Advanced Usage with Source Position

```tsx
import React from 'react';
import { useConfetti } from 'react-confetti-shooter';

function MyComponent() {
  const { triggerConfetti, ConfettiRenderer } = useConfetti();

  const handleButtonClick = (
    direction: 'left' | 'right' | 'top' | 'center',
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const sourceX = rect.left + rect.width / 2;
    const sourceY = rect.top + rect.height / 2;
    
    triggerConfetti(direction, 50, sourceX, sourceY);
  };

  return (
    <div>
      <ConfettiRenderer />
      
      <button onClick={(e) => handleButtonClick('left', e)}>
        Shoot Left ←
      </button>
      
      <button onClick={(e) => handleButtonClick('right', e)}>
        Shoot Right →
      </button>
      
      <button onClick={(e) => handleButtonClick('top', e)}>
        Shoot Up ↑
      </button>
      
      <button onClick={(e) => handleButtonClick('center', e)}>
        Explode 💥
      </button>
    </div>
  );
}
```

## 🔧 API Reference

### `useConfetti(options?)`

Hook that manages confetti animations.

**Parameters:**
- `options`: `UseConfettiOptions` (optional) - Configuration options

**Options:**
- `autoTrigger`: `AutoTriggerOptions` (optional) - Auto-trigger configuration
  - `enabled`: `boolean` - Whether to auto-trigger confetti
  - `direction`: `Direction` (optional, default: 'center') - Direction to shoot
  - `count`: `number` (optional, default: 50) - Number of particles
  - `delay`: `number` (optional, default: 0) - Delay in milliseconds before triggering

Returns an object with the following properties:

#### `triggerConfetti(direction, count?, sourceX?, sourceY?)`

Triggers a confetti burst.

**Parameters:**
- `direction`: `'left' | 'right' | 'top' | 'center'` - Direction to shoot confetti
- `count`: `number` (optional, default: 50) - Number of particles to create
- `sourceX`: `number` (optional, default: center X) - X coordinate of confetti source
- `sourceY`: `number` (optional, default: center Y) - Y coordinate of confetti source

**Example:**
```tsx
// Basic usage
triggerConfetti('center');

// Custom particle count
triggerConfetti('left', 100);

// Custom source position
triggerConfetti('right', 50, 200, 300);
```

#### `ConfettiRenderer`

React component that renders the confetti particles. Must be included in your JSX.

**Example:**
```tsx
<ConfettiRenderer />
```

#### `isAnimating`

Boolean indicating if confetti animation is currently running.

#### `particleCount`

Number of active confetti particles currently on screen.

## ⚡ Auto-Trigger Examples

### Immediate Welcome Effect
```tsx
const { ConfettiRenderer } = useConfetti({
  autoTrigger: {
    enabled: true,
    direction: 'center',
    count: 75
  }
});
```

### Delayed Celebration
```tsx
const { ConfettiRenderer } = useConfetti({
  autoTrigger: {
    enabled: true,
    direction: 'top',
    count: 100,
    delay: 2000 // Wait 2 seconds
  }
});
```

### Directional Auto-Burst
```tsx
const { ConfettiRenderer } = useConfetti({
  autoTrigger: {
    enabled: true,
    direction: 'left',
    count: 30,
    delay: 500
  }
});
```

## 🎨 Customization

### Directions

- **`left`**: Shoots confetti toward the left
- **`right`**: Shoots confetti toward the right  
- **`top`**: Shoots confetti upward
- **`center`**: Explodes confetti in all directions

### Colors

The library includes a predefined set of vibrant colors:
- `#ff6b6b` (Red)
- `#4ecdc4` (Teal) 
- `#45b7d1` (Blue)
- `#ffd93d` (Yellow)
- `#ff8c42` (Orange)
- `#a8e6cf` (Green)
- `#ff6f91` (Pink)

## 🎭 Examples

### Celebration Button

```tsx
function CelebrationButton() {
  const { triggerConfetti, ConfettiRenderer } = useConfetti();
  
  return (
    <div>
      <ConfettiRenderer />
      <button 
        onClick={() => triggerConfetti('center', 100)}
        className="bg-purple-500 text-white px-6 py-3 rounded-lg"
      >
        🎉 Celebrate!
      </button>
    </div>
  );
}
```

### Auto-Loading Celebration

```tsx
function AutoCelebration() {
  const { ConfettiRenderer } = useConfetti({
    autoTrigger: {
      enabled: true,
      direction: 'center',
      count: 150,
      delay: 800
    }
  });
  
  return (
    <div>
      <ConfettiRenderer />
      <div className="text-center p-8">
        <h2>🎊 Success! 🎊</h2>
        <p>Your action was completed!</p>
      </div>
    </div>
  );
}
```

### Interactive Confetti Grid

```tsx
function ConfettiGrid() {
  const { triggerConfetti, ConfettiRenderer, particleCount } = useConfetti();
  
  const handleClick = (dir, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    triggerConfetti(dir, 30, x, y);
  };
  
  return (
    <div>
      <ConfettiRenderer />
      
      <div className="grid grid-cols-2 gap-4">
        {['left', 'right', 'top', 'center'].map(direction => (
          <button
            key={direction}
            onClick={(e) => handleClick(direction, e)}
            className="w-20 h-20 rounded-full bg-blue-500 text-white"
          >
            {direction}
          </button>
        ))}
      </div>
      
      <p>Active particles: {particleCount}</p>
    </div>
  );
}
```

## 📱 Responsive Design

The confetti system automatically adapts to screen size and viewport changes. Particles are positioned relative to the viewport and will animate correctly on all device sizes.

## 🎯 Performance

- Particles are automatically cleaned up when they leave the screen
- Animation uses `requestAnimationFrame` for smooth performance
- No memory leaks - all animations are properly disposed

## 🔄 TypeScript Support

Full TypeScript support is included with proper type definitions:

```tsx
import { 
  useConfetti, 
  Direction, 
  UseConfettiOptions, 
  AutoTriggerOptions 
} from 'react-confetti-shooter';

const direction: Direction = 'center'; // Type-safe

const options: UseConfettiOptions = {
  autoTrigger: {
    enabled: true,
    direction: 'center',
    count: 50,
    delay: 1000
  }
}; // Fully typed

const { triggerConfetti, ConfettiRenderer } = useConfetti(options);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for the React community. Perfect for adding joy and celebration to your applications!

---

**Happy confetti shooting! 🎊**