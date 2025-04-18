export const theme = {
  colors: {
    // Primary color (red)
    primary: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',  // Main primary color
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
      950: '#450A0A',
    },
    // Secondary color (blue)
    secondary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',  // Main secondary color
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
      950: '#172554',
    },
    // Accent color (gold)
    accent: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',  // Main accent color
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03',
    },
    // Success color (green)
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',  // Main success color
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
      950: '#022C22',
    },
    // Warning color (amber)
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',  // Main warning color
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03',
    },
    // Error color (red)
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',  // Main error color
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
      950: '#450A0A',
    },
    // Neutral colors (gray)
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#030712',
    },
    white: '#FFFFFF',
    black: '#000000',
    
    // Special colors for medals
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  },
  
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  },
  
  borderRadius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 36,
    '6xl': 48,
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Typography styles
  textStyles: {
    h1: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      lineHeight: 33.6, // 1.2 line height
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      lineHeight: 28.8, // 1.2 line height
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      lineHeight: 24, // 1.2 line height
    },
    body: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      lineHeight: 24, // 1.5 line height
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      lineHeight: 21, // 1.5 line height
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      lineHeight: 18, // 1.5 line height
    },
  },
  
  // Shadow styles
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};