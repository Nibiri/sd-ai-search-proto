interface LoaderProps {
  size?: number;
  color?: string;
}

export function Loader({ size = 24, color = '#7c3aed' }: LoaderProps) {
  return (
    <span
      style={{
        display:      'inline-block',
        width:        size,
        height:       size,
        borderRadius: '50%',
        border:       `2px solid ${color}30`,
        borderTop:    `2px solid ${color}`,
        animation:    'spin 0.7s linear infinite',
        flexShrink:   0,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
