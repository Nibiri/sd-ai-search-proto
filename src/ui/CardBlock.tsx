import type { ReactNode, CSSProperties } from 'react';

interface CardBlockProps {
  children?: ReactNode;
  title?: string;
  style?: CSSProperties;
  className?: string;
}

export function CardBlock({ children, title, style, className }: CardBlockProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: '#ffffff',
        borderRadius:    12,
        border:          '1px solid #e5e7eb',
        padding:         16,
        ...style,
      }}
    >
      {title && (
        <div style={{
          fontSize:     '0.875rem',
          fontWeight:   600,
          color:        '#111827',
          fontFamily:   'Inter, sans-serif',
          marginBottom: 12,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
