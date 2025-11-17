import { Mode } from '@/contexts/mode-context'

export function getModeColors(mode: Mode) {
  switch (mode) {
    case 'chaos':
      return {
        bg: '#000000',
        text: '#ffffff',
        cardBg: '#18181b',
        cardBorder: '#3f3f46',
        primary: '#E8FF00',
        primaryText: '#000000',
        accent1: '#FFB84D',
        accent2: '#FF8A5C',
        accent3: '#FF6B9D',
        accent4: '#4A9BFF',
        accent5: '#C8D961',
        muted: '#71717a',
        border: '#3f3f46',
      }
    case 'chill':
      return {
        bg: '#F5E6D3',
        text: '#4A1818',
        cardBg: '#FFFFFF',
        cardBorder: 'rgba(74, 24, 24, 0.1)',
        primary: '#FFC043',
        primaryText: '#4A1818',
        accent1: '#FFB5D8',
        accent2: '#4A9BFF',
        accent3: '#C8D961',
        accent4: '#FF6B35',
        accent5: '#8B4444',
        muted: '#8B4444',
        border: 'rgba(74, 24, 24, 0.2)',
      }
    case 'dark-grey':
      return {
        bg: '#0a0a0a',
        text: '#fafafa',
        cardBg: '#1a1a1a',
        cardBorder: '#2a2a2a',
        primary: '#ffffff',
        primaryText: '#0a0a0a',
        accent1: '#d4d4d4',
        accent2: '#a3a3a3',
        accent3: '#737373',
        accent4: '#525252',
        accent5: '#404040',
        muted: '#737373',
        border: '#2a2a2a',
      }
    case 'light-grey':
      return {
        bg: '#fafafa',
        text: '#0a0a0a',
        cardBg: '#ffffff',
        cardBorder: '#e5e5e5',
        primary: '#0a0a0a',
        primaryText: '#fafafa',
        accent1: '#525252',
        accent2: '#737373',
        accent3: '#a3a3a3',
        accent4: '#d4d4d4',
        accent5: '#e5e5e5',
        muted: '#a3a3a3',
        border: '#e5e5e5',
      }
  }
}

export function getModeCardClasses(mode: Mode, variant: 'default' | 'colored' | 'outlined' = 'default') {
  const colors = getModeColors(mode)
  
  switch (variant) {
    case 'colored':
      return {
        className: '',
        style: {
          backgroundColor: colors.accent1,
          color: mode === 'chaos' || mode === 'dark-grey' ? colors.text : colors.text,
        }
      }
    case 'outlined':
      return {
        className: '',
        style: {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
          color: colors.text,
        }
      }
    default:
      return {
        className: '',
        style: {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
          color: colors.text,
        }
      }
  }
}

