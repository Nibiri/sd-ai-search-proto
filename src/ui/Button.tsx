import { Icon } from './Icon';
import type { IconName } from './types';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  isDisabled?: boolean;
  iconName?: IconName;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const STYLES = {
  primary: {
    bg:         '#7c3aed',
    bgHover:    '#6d28d9',
    color:      '#ffffff',
    border:     'transparent',
  },
  secondary: {
    bg:         'var(--button-operation, #f3f4f5)',
    bgHover:    'var(--button-operation-hover, #e5e7eb)',
    color:      'var(--text-primary, #111827)',
    border:     '#d1d5db',
  },
  ghost: {
    bg:         'transparent',
    bgHover:    '#f3f4f5',
    color:      '#374151',
    border:     'transparent',
  },
  danger: {
    bg:         '#fee2e2',
    bgHover:    '#fecaca',
    color:      '#b91c1c',
    border:     '#fca5a5',
  },
};

const SIZE_STYLES = {
  sm: { height: 28, px: 10, fontSize: '0.75rem',   iconSize: 13, borderRadius: 8 },
  md: { height: 36, px: 14, fontSize: '0.875rem',  iconSize: 15, borderRadius: 10 },
  lg: { height: 42, px: 18, fontSize: '0.9375rem', iconSize: 17, borderRadius: 12 },
};

export function Button({
  text,
  variant = 'primary',
  onClick,
  isDisabled = false,
  iconName,
  iconPosition = 'left',
  size = 'md',
  type = 'button',
}: ButtonProps) {
  const s  = STYLES[variant];
  const sz = SIZE_STYLES[size];

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             6,
        height:          sz.height,
        paddingLeft:     sz.px,
        paddingRight:    sz.px,
        borderRadius:    sz.borderRadius,
        border:          `1px solid ${s.border}`,
        backgroundColor: isDisabled ? '#e5e7eb' : s.bg,
        color:           isDisabled ? '#9ca3af' : s.color,
        fontSize:        sz.fontSize,
        fontWeight:      600,
        fontFamily:      'Inter, sans-serif',
        lineHeight:      1,
        cursor:          isDisabled ? 'not-allowed' : 'pointer',
        transition:      'background-color 0.15s, opacity 0.15s',
        whiteSpace:      'nowrap',
        flexShrink:      0,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = s.bgHover;
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = s.bg;
      }}
    >
      {iconName && iconPosition === 'left' && (
        <Icon name={iconName} size={sz.iconSize} color="currentColor" />
      )}
      {text}
      {iconName && iconPosition === 'right' && (
        <Icon name={iconName} size={sz.iconSize} color="currentColor" />
      )}
    </button>
  );
}
