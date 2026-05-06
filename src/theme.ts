import { createTheme } from '@mui/material/styles';

// ── LogicBPM UI Kit — design tokens ──────────────────────────
// Source: @logicbpm/logicbpm-ui-kit variables.scss + _theme-light.scss

export const kit = {
  // Purple scale
  purple1: '#f3effc',
  purple2: '#e1d8f7',
  purple3: '#cab9f0',
  purple4: '#b298ea',
  purple5: '#9a79e3',
  purple6: '#845cdd',   // primary
  purple7: '#704ebc',   // primary hover
  purple8: '#5e419d',

  // Gray scale
  gray1:  '#fff',
  gray2:  '#f9fbfc',
  gray3:  '#f3f4f5',   // page background
  gray4:  '#e8eaeb',   // border-low / border-primary-medium
  gray5:  '#d7d8d9',   // border-high
  gray6:  '#bdbebf',   // text-inactive
  gray7:  '#8c8c8c',   // text-secondary
  gray8:  '#575859',
  gray9:  '#333333',
  gray10: '#242526',   // text-primary

  // Semantic
  red6:    '#b91e5a',  // error
  green6:  '#039855',  // success / accept
  green1:  '#eefbf1',
  orange6: '#f79009',  // warning
  orange1: '#fffaef',
  yellow6: '#ffcc5f',

  // Shadows (from theme-light)
  shadowXs: '0px 1px 2px 0px rgb(16 24 40 / 5%)',
  shadowSm: '0px 1px 2px 0px rgb(16 24 40 / 6%), 0px 1px 3px 0px rgb(16 24 40 / 10%)',
  shadowMd: '0px 2px 4px -2px rgb(16 24 40 / 6%), 0px 4px 8px -2px rgb(16 24 40 / 10%)',
  shadowLg: '0px 4px 6px -2px rgb(16 24 40 / 3%), 0px 12px 16px -4px rgb(16 24 40 / 8%)',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:         kit.purple6,
      light:        kit.purple1,
      dark:         kit.purple7,
      contrastText: '#fff',
    },
    error:   { main: kit.red6,    light: '#f8e9ef' },
    success: { main: kit.green6,  light: kit.green1 },
    warning: { main: kit.orange6, light: kit.orange1 },
    background: {
      default: kit.gray3,
      paper:   kit.gray1,
    },
    text: {
      primary:   kit.gray10,
      secondary: kit.gray7,
      disabled:  kit.gray6,
    },
    divider: kit.gray4,
  },

  typography: {
    fontFamily: '"Inter", "Inter Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 14,
    button: {
      textTransform: 'none',
      fontWeight: 400,
      fontSize: '1rem',       // 16px — kit button font
      lineHeight: '1.25rem',  // 20px
    },
    body1:    { fontSize: '0.875rem', lineHeight: 1.5 },
    body2:    { fontSize: '0.8125rem', lineHeight: 1.46 },
    caption:  { fontSize: '0.75rem', lineHeight: 1.33 },
    subtitle2:{ fontWeight: 500, fontSize: '0.875rem' },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: kit.gray3, color: kit.gray10 },
        '*': { boxSizing: 'border-box' },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: kit.gray1,
          color: kit.gray10,
          boxShadow: `0 0 0 1px ${kit.gray4}`,
        },
      },
    },

    // Kit Button: height 40, radius 16, font 16/20
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: '1.25rem',
          borderRadius: '16px',
          height: 40,
          padding: '8px 20px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          backgroundColor: kit.purple6,
          color: '#fff',
          '&:hover': { backgroundColor: kit.purple7 },
          '&:disabled': { backgroundColor: kit.gray4, color: kit.gray6 },
        },
        outlined: {
          borderColor: kit.gray4,
          color: kit.gray10,
          backgroundColor: kit.gray1,
          '&:hover': { backgroundColor: kit.gray3, borderColor: kit.gray5 },
        },
        text: {
          color: kit.purple6,
          '&:hover': { backgroundColor: kit.purple1 },
        },
      },
    },

    // Chip: smaller radius
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 400,
          fontSize: '0.8125rem',
        },
      },
    },

    // Card: kit CardBlock — radius 28, white bg, shadow-xs
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',   // slightly less than CardBlock's 28 for ticket density
          backgroundColor: kit.gray1,
          boxShadow: kit.shadowXs,
          border: `1px solid ${kit.gray4}`,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: '16px' },
        elevation6: { boxShadow: kit.shadowMd },
        elevation8: { boxShadow: kit.shadowLg },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '0.9375rem',
          color: kit.gray7,
          '&.Mui-selected': { color: kit.gray10, fontWeight: 500 },
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: kit.purple2,
          borderRadius: 4,
          height: 3,
        },
        bar: {
          backgroundColor: kit.purple6,
          borderRadius: 4,
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: kit.gray4 },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: kit.gray4 },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: { fontSize: '0.65rem' },
      },
    },
  },
});

export default theme;
