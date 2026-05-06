import { Close } from '@mui/icons-material';
import type { BadgeColor } from './types';

const COLOR_MAP: Record<BadgeColor, { bg: string; text: string; border: string }> = {
  red:       { bg: '#fde8ef', text: '#b91e5a', border: '#f9b8ce' },
  orange:    { bg: '#fff4e0', text: '#b45309', border: '#fcd89a' },
  yellow:    { bg: '#fefce8', text: '#854d0e', border: '#fde047' },
  green:     { bg: '#eefbf1', text: '#039855', border: '#6ee7b7' },
  blue:      { bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd' },
  lightBlue: { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
  purple:    { bg: '#f3effc', text: '#7c3aed', border: '#c4b5f4' },
  gray:      { bg: '#f3f4f5', text: '#575859', border: '#d1d5db' },
  black:     { bg: '#1f2937', text: '#ffffff', border: '#374151' },
  white:     { bg: '#ffffff', text: '#111827', border: '#e5e7eb' },
};

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  size?: number;
  onClickCross?: () => void;
  className?: string;
}

export function Badge({ label, color = 'gray', size = 28, onClickCross }: BadgeProps) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.gray;
  const fontSize = size <= 24 ? '0.68rem' : size <= 28 ? '0.75rem' : '0.8125rem';
  const height   = size;
  const px       = size <= 24 ? 6 : 10;

  return (
    <span style={{
      display:        'inline-flex',
      alignItems:     'center',
      gap:            4,
      height,
      paddingLeft:    px,
      paddingRight:   onClickCross ? 4 : px,
      borderRadius:   height / 2,
      border:         `1px solid ${c.border}`,
      backgroundColor: c.bg,
      color:          c.text,
      fontSize,
      fontWeight:     600,
      fontFamily:     'Inter, sans-serif',
      lineHeight:     1,
      whiteSpace:     'nowrap',
      flexShrink:     0,
    }}>
      {label}
      {onClickCross && (
        <span
          onClick={(e) => { e.stopPropagation(); onClickCross(); }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: c.text, opacity: 0.6 }}
        >
          <Close sx={{ fontSize: 10 }} />
        </span>
      )}
    </span>
  );
}
