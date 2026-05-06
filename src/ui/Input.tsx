import { useState } from 'react';

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function Input({
  value = '',
  onChange,
  onKeyDown,
  placeholder,
  type = 'text',
  disabled = false,
  autoFocus,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      style={{
        width:           '100%',
        height:          36,
        paddingLeft:     12,
        paddingRight:    12,
        borderRadius:    8,
        border:          `1.5px solid ${focused ? '#7c3aed' : '#d1d5db'}`,
        boxShadow:       focused ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
        backgroundColor: disabled ? '#f9fafb' : '#ffffff',
        color:           '#111827',
        fontSize:        '0.875rem',
        fontFamily:      'Inter, sans-serif',
        outline:         'none',
        transition:      'border-color 0.15s, box-shadow 0.15s',
        boxSizing:       'border-box',
      }}
    />
  );
}
