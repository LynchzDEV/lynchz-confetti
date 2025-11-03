# Local Testing Guide for React Confetti Shooter

This guide shows you how to test your confetti library locally before publishing to npm.

## 🎯 Testing Methods

### Method 1: npm link (Recommended)

This creates a symlink to your library for testing in other projects.

#### Step 1: Link your library
```bash
# In your confetti library folder
cd confetti
npm link
```

#### Step 2: Create a test React app
```bash
# Go to parent directory
cd ..

# Create new React app with Vite
bun create vite test-confetti-app --template react-ts
cd test-confetti-app
bun install
```

#### Step 3: Link the library to your test app
```bash
# In your test app folder
npm link react-confetti-shooter
```

#### Step 4: Use in your test app
```tsx
// src/App.tsx
import React from 'react';
import { useConfetti } from 'react-confetti-shooter';

function App() {
  const { triggerConfetti, ConfettiRenderer } = useConfetti();

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <ConfettiRenderer />
      <h1>Testing Confetti Library</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxWidth: '300px', margin: '20px auto' }}>
        <button onClick={() => triggerConfetti('left')}>Left</button>
        <button onClick={() => triggerConfetti('right')}>Right</button>
        <button onClick={() => triggerConfetti('top')}>Top</button>
        <button onClick={() => triggerConfetti('center')}>Center</button>
      </div>
    </div>
  );
}

export default App;
```

#### Step 5: Run the test
```bash
bun dev
```

### Method 2: npm pack

This creates a tarball (.tgz file) that you can install like a real npm package.

#### Step 1: Build and pack your library
```bash
# In your confetti library folder
bun run build
npm pack
# This creates react-confetti-shooter-1.1.0.tgz
```

#### Step 2: Install in test project
```bash
# In your test app folder
npm install ../confetti/react-confetti-shooter-1.1.0.tgz
```

#### Step 3: Use normally
```tsx
import { useConfetti } from 'react-confetti-shooter';
```

### Method 3: Local file import (Development)

For quick testing during development.

#### Step 1: Copy files to test project
```bash
# Copy your built files
cp -r confetti/dist test-app/src/confetti-lib
```

#### Step 2: Import directly
```tsx
// src/App.tsx
import { useConfetti } from './confetti-lib/index.js';
```

## 🧪 Test Scenarios

### Basic Manual Trigger Test
```tsx
function BasicTest() {
  const { triggerConfetti, ConfettiRenderer } = useConfetti();

  return (
    <div>
      <ConfettiRenderer />
      <button onClick={() => triggerConfetti('center')}>
        🎉 Test Confetti
      </button>
    </div>
  );
}
```

### Auto-Trigger Test
```tsx
function AutoTriggerTest() {
  const { ConfettiRenderer } = useConfetti({
    autoTrigger: {
      enabled: true,
      direction: 'center',
      count: 100,
      delay: 1000
    }
  });

  return (
    <div>
      <ConfettiRenderer />
      <h2>Auto-confetti will start in 1 second!</h2>
    </div>
  );
}
```

### Position-Based Trigger Test
```tsx
function PositionTest() {
  const { triggerConfetti, ConfettiRenderer } = useConfetti();

  const handleClick = (direction, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const sourceX = rect.left + rect.width / 2;
    const sourceY = rect.top + rect.height / 2;
    triggerConfetti(direction, 50, sourceX, sourceY);
  };

  return (
    <div>
      <ConfettiRenderer />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <button onClick={(e) => handleClick('left', e)}>Left</button>
        <button onClick={(e) => handleClick('right', e)}>Right</button>
        <button onClick={(e) => handleClick('top', e)}>Top</button>
        <button onClick={(e) => handleClick('center', e)}>Center</button>
      </div>
    </div>
  );
}
```

### Complete Test Suite
```tsx
import React, { useState } from 'react';
import { useConfetti } from 'react-confetti-shooter';

function TestSuite() {
  const [autoEnabled, setAutoEnabled] = useState(false);

  const { triggerConfetti, ConfettiRenderer, isAnimating, particleCount } = useConfetti({
    autoTrigger: {
      enabled: autoEnabled,
      direction: 'center',
      count: 75,
      delay: 500
    }
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <ConfettiRenderer />

      <h1>🎉 Confetti Library Test Suite</h1>

      {/* Manual Triggers */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Manual Triggers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxWidth: '300px' }}>
          <button onClick={() => triggerConfetti('left')} disabled={isAnimating}>Left</button>
          <button onClick={() => triggerConfetti('right')} disabled={isAnimating}>Right</button>
          <button onClick={() => triggerConfetti('top')} disabled={isAnimating}>Top</button>
          <button onClick={() => triggerConfetti('center')} disabled={isAnimating}>Center</button>
        </div>
      </section>

      {/* Auto Trigger */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Auto Trigger</h2>
        <button onClick={() => setAutoEnabled(true)} disabled={autoEnabled}>
          Enable Auto Confetti
        </button>
        {autoEnabled && <p>Auto-confetti enabled! Will trigger in 0.5s</p>}
      </section>

      {/* Status */}
      <section style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Status</h3>
        <p>Is Animating: {isAnimating ? 'Yes' : 'No'}</p>
        <p>Active Particles: {particleCount}</p>
      </section>
    </div>
  );
}

export default TestSuite;
```

## 🔍 What to Test

### ✅ Core Functionality
- [ ] Manual trigger works for all directions (left, right, top, center)
- [ ] Auto-trigger works on component mount
- [ ] Auto-trigger respects delay setting
- [ ] Particles animate smoothly and disappear
- [ ] Multiple triggers don't interfere with each other

### ✅ TypeScript Support
- [ ] All types are exported correctly
- [ ] IntelliSense works in your editor
- [ ] No TypeScript compilation errors

### ✅ Performance
- [ ] No memory leaks (particles clean up properly)
- [ ] Smooth animation at 60fps
- [ ] Doesn't block UI during animation

### ✅ Props & Options
- [ ] `count` parameter controls particle number
- [ ] `direction` parameter affects particle trajectory
- [ ] `sourceX`/`sourceY` parameters position confetti origin
- [ ] `autoTrigger.delay` works correctly

## 🛠 Debugging Tips

### Common Issues

1. **"Module not found"**
   ```bash
   # Make sure you linked correctly
   npm ls react-confetti-shooter
   ```

2. **TypeScript errors**
   ```bash
   # Rebuild the library
   bun run build
   ```

3. **React version conflicts**
   ```bash
   # Use the same React version
   npm ls react
   ```

4. **Confetti not appearing**
   - Check that `<ConfettiRenderer />` is included
   - Verify z-index isn't blocking particles
   - Check browser console for errors

### Debug Mode
Add console logs to track confetti state:
```tsx
const { triggerConfetti, ConfettiRenderer, particleCount } = useConfetti();

console.log('Particle count:', particleCount);

const handleTrigger = (direction) => {
  console.log('Triggering confetti:', direction);
  triggerConfetti(direction);
};
```

## 🚀 Ready to Publish?

Once all tests pass:

1. **Update version**
   ```bash
   npm version patch  # or minor/major
   ```

2. **Final build**
   ```bash
   bun run build
   ```

3. **Publish**
   ```bash
   npm publish
   ```

## 🔧 Cleanup

### Unlink when done testing
```bash
# In test app
npm unlink react-confetti-shooter

# In library folder
npm unlink
```

### Remove test files
```bash
rm -rf test-confetti-app
rm react-confetti-shooter-*.tgz
```

Happy testing! 🎊
