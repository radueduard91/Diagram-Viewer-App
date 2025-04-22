// src/styles/theme.ts

export const theme = {
  colors: {
    // System colors
    eam: {
      primary: '#22c55e', // Green
      secondary: '#16a34a',
      light: '#dcfce7',
      border: '#15803d',
    },
    ipen: {
      primary: '#3b82f6', // Blue
      secondary: '#2563eb',
      light: '#dbeafe',
      border: '#1d4ed8',
    },
    both: {
      primary: '#f97316', // Orange
      secondary: '#ea580c',
      light: '#ffedd5',
      border: '#c2410c',
    },
    // UI colors
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      light: '#9ca3af',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f3f4f6',
      hover: '#f9fafb',
    },
    border: {
      default: '#e5e7eb',
      focus: '#3b82f6',
    },
    status: {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  transitions: {
    default: 'all 0.3s ease',
  },
};

export type Theme = typeof theme;

// Export the theme for use in components
export default theme;