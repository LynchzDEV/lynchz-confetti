import { useState, useEffect, useRef, useCallback } from 'react';

export type Direction = 'left' | 'right' | 'top' | 'center';

export interface AutoTriggerOptions {
  enabled: boolean;
  direction?: Direction;
  count?: number;
  delay?: number;
}

export interface UseConfettiOptions {
  autoTrigger?: AutoTriggerOptions;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
}

const CONFETTI_COLORS = [
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#ffd93d',
  '#ff8c42',
  '#a8e6cf',
  '#ff6f91',
];

const GRAVITY = 0.5;

const getDirectionConfig = (
  sourceX: number,
  sourceY: number,
  direction: Direction,
) => {
  const configs = {
    left: {
      baseAngle: Math.PI, // Shoot left
      spread: Math.PI / 4,
    },
    right: {
      baseAngle: 0, // Shoot right
      spread: Math.PI / 4,
    },
    top: {
      baseAngle: -Math.PI / 2, // Shoot up
      spread: Math.PI / 4,
    },
    center: {
      baseAngle: -Math.PI / 2, // Shoot up from center
      spread: Math.PI * 2, // Full 360 degrees
    },
  };

  return {
    ...configs[direction],
    x: sourceX,
    y: sourceY,
  };
};

export const useConfetti = (options?: UseConfettiOptions) => {
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const confettiRef = useRef<ConfettiParticle[]>([]);

  const createParticles = (
    count: number,
    direction: Direction,
    sourceX: number = window.innerWidth / 2,
    sourceY: number = window.innerHeight / 2,
  ): ConfettiParticle[] => {
    const config = getDirectionConfig(sourceX, sourceY, direction);

    return Array.from({ length: count }, (_, i) => {
      const spreadAngle = (Math.random() - 0.5) * config.spread;
      const angle = config.baseAngle + spreadAngle;
      const speed = Math.random() * 15 + 10;

      return {
        id: Date.now() + i,
        x: config.x,
        y: config.y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 10 + 8,
      };
    });
  };

  const updateParticles = (
    particles: ConfettiParticle[],
  ): ConfettiParticle[] => {
    return particles
      .map(particle => ({
        ...particle,
        x: particle.x + particle.velocityX,
        y: particle.y + particle.velocityY,
        velocityY: particle.velocityY + GRAVITY,
        rotation: particle.rotation + particle.rotationSpeed,
      }))
      .filter(
        particle =>
          particle.y < window.innerHeight + 100 &&
          particle.x > -100 &&
          particle.x < window.innerWidth + 100,
      );
  };

  const animate = useCallback((): void => {
    confettiRef.current = updateParticles(confettiRef.current);
    setConfetti([...confettiRef.current]);

    if (confettiRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
    }
  }, []);

  const triggerConfetti = useCallback(
    (
      direction: Direction,
      count: number = 50,
      sourceX?: number,
      sourceY?: number,
    ): void => {
      if (isAnimating) return;

      const newConfetti = createParticles(count, direction, sourceX, sourceY);
      confettiRef.current = newConfetti;
      setConfetti(newConfetti);
      setIsAnimating(true);
    },
    [isAnimating],
  );

  useEffect(() => {
    if (isAnimating) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, animate]);

  const ConfettiRenderer = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((particle: ConfettiParticle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );

  // Auto-trigger effect
  useEffect(() => {
    if (options?.autoTrigger?.enabled) {
      const {
        direction = 'center',
        count = 50,
        delay = 0,
      } = options.autoTrigger;

      const timer = setTimeout(() => {
        triggerConfetti(direction, count);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [options?.autoTrigger, triggerConfetti]);

  return {
    triggerConfetti,
    ConfettiRenderer,
    isAnimating,
    particleCount: confetti.length,
  };
};
