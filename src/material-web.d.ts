import type { HTMLAttributes, DetailedHTMLProps } from 'react';

type MdEl = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

// Extend React's JSX IntrinsicElements with @material/web custom elements
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'md-linear-progress':   MdEl & { indeterminate?: boolean | ''; value?: number; buffer?: number };
      'md-circular-progress': MdEl & { indeterminate?: boolean | ''; value?: number };
      'md-chip-set':          MdEl;
      'md-filter-chip':       MdEl & { label?: string; selected?: boolean | '' };
      'md-suggestion-chip':   MdEl & { label?: string };
      'md-input-chip':        MdEl & { label?: string };
      'md-assist-chip':       MdEl & { label?: string };
      'md-filled-button':     MdEl & { disabled?: boolean | '' };
      'md-outlined-button':   MdEl & { disabled?: boolean | '' };
      'md-icon':              MdEl;
      'md-navigation-bar':    MdEl & { 'active-index'?: number };
      'md-navigation-tab':    MdEl & { label?: string; active?: boolean | '' };
    }
  }
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}

declare module '*?raw' {
  const content: string;
  export default content;
}
