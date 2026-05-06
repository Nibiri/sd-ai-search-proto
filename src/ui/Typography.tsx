import type { CSSProperties, ReactNode } from 'react';
import { TypographySize, TypographyRole, TypographyColor } from './types';

const SIZE_MAP: Record<TypographySize, string> = {
  [TypographySize.Micro]: '0.625rem',
  [TypographySize.XS]:    '0.75rem',
  [TypographySize.S]:     '0.875rem',
  [TypographySize.M]:     '1rem',
  [TypographySize.L]:     '1.125rem',
  [TypographySize.XL]:    '1.25rem',
};

const WEIGHT_MAP: Record<TypographyRole, number> = {
  [TypographyRole.Text]:    400,
  [TypographyRole.Label]:   500,
  [TypographyRole.Heading]: 600,
};

const COLOR_MAP: Record<TypographyColor, string> = {
  [TypographyColor.Primary]:   'var(--text-primary, #111827)',
  [TypographyColor.Secondary]: 'var(--text-secondary, #6b7280)',
  [TypographyColor.Inactive]:  '#9ca3af',
  [TypographyColor.Warning]:   '#b45309',
  [TypographyColor.Error]:     '#dc2626',
  [TypographyColor.Success]:   '#059669',
  [TypographyColor.White]:     '#ffffff',
};

interface TypographyProps {
  children?: ReactNode;
  size?: TypographySize;
  role?: TypographyRole;
  color?: TypographyColor;
  /** MUI sx-like style override (plain CSSProperties subset) */
  sx?: CSSProperties;
  className?: string;
}

export function Typography({
  children,
  size = TypographySize.S,
  role = TypographyRole.Text,
  color,
  sx,
  className,
}: TypographyProps) {
  const Tag = role === TypographyRole.Heading ? 'h6' : 'span';

  return (
    <Tag
      className={className}
      style={{
        fontSize:   SIZE_MAP[size],
        fontWeight: WEIGHT_MAP[role],
        color:      color ? COLOR_MAP[color] : undefined,
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.5,
        margin:     0,
        ...sx,
      }}
    >
      {children}
    </Tag>
  );
}

export { TypographySize, TypographyRole, TypographyColor };
