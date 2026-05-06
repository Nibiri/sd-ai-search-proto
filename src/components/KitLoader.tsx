/**
 * LogicBPM UI Kit — Loader
 * Exact replica of loader.svg from @logicbpm/logicbpm-ui-kit
 * 8 tick marks, staggered opacity animation (0.2→1→0.2), 1.2s cycle
 */
interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export default function KitLoader({ size = 20, color = '#845cdd', className }: Props) {
  const ticks = Array.from({ length: 8 }, (_, i) => ({
    angle: i * 45,
    delay: `${i * 0.15}s`,
  }));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      {ticks.map(({ angle, delay }) => (
        <line
          key={angle}
          x1="25" y1="5" x2="25" y2="13"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${angle} 25 25)`}
        >
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="1.2s"
            begin={delay}
            repeatCount="indefinite"
          />
        </line>
      ))}
    </svg>
  );
}
