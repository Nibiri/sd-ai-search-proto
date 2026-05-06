export type BadgeColor =
  | 'red' | 'orange' | 'yellow' | 'green' | 'blue'
  | 'lightBlue' | 'purple' | 'gray' | 'black' | 'white';

export type IconName = string;

export enum TypographySize {
  Micro = 'micro',
  XS    = 'xs',
  S     = 's',
  M     = 'm',
  L     = 'l',
  XL    = 'xl',
}

export enum TypographyRole {
  Text    = 'text',
  Heading = 'heading',
  Label   = 'label',
}

export enum TypographyColor {
  Primary   = 'primary',
  Secondary = 'secondary',
  Inactive  = 'inactive',
  Warning   = 'warning',
  Error     = 'error',
  Success   = 'success',
  White     = 'white',
}
