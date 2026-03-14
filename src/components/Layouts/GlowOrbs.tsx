import { useMemo } from "react";

const ORB_COLOR = '#3b82f6';

export default function GlowOrbs({ count = 12 }: { count?: number }) {
  const glowOrbs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${Math.random() * 85 + 5}%`,
        left: `${Math.random() * 85 + 5}%`,
        size: Math.floor(Math.random() * 300 + 250),
        delay: `${(Math.random() * 7).toFixed(2)}s`,
        duration: `${(Math.random() * 4 + 3).toFixed(2)}s`,
        color: ORB_COLOR,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {glowOrbs.map((orb) => (
        <div
          key={orb.id}
          className="glow-orb absolute rounded-full"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            filter: 'blur(70px)',
            '--orb-delay': orb.delay,
            '--orb-duration': orb.duration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
