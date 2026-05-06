type ViewMode = 'avatarOnly' | 'avatarRightText' | 'avatarLeftText';

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  size?: number;
  viewMode?: ViewMode;
  backgroundColor?: string;
}

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#111827' : '#ffffff';
}

export function UserAvatar({
  firstName,
  lastName,
  size = 32,
  viewMode = 'avatarOnly',
  backgroundColor = '#7c3aed',
}: UserAvatarProps) {
  const initials = getInitials(firstName, lastName);
  const textColor = backgroundColor.startsWith('#')
    ? getContrastColor(backgroundColor)
    : '#ffffff';

  const avatar = (
    <span style={{
      display:         'inline-flex',
      alignItems:      'center',
      justifyContent:  'center',
      width:           size,
      height:          size,
      borderRadius:    '50%',
      backgroundColor,
      color:           textColor,
      fontSize:        size * 0.35,
      fontWeight:      700,
      fontFamily:      'Inter, sans-serif',
      flexShrink:      0,
      userSelect:      'none',
    }}>
      {initials}
    </span>
  );

  if (viewMode === 'avatarOnly') return avatar;

  const name = `${firstName} ${lastName}`;

  if (viewMode === 'avatarRightText') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {avatar}
        <span style={{ fontSize: '0.8125rem', color: '#374151', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: '0.8125rem', color: '#374151', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </span>
      {avatar}
    </span>
  );
}
