import { createTheme } from '@mui/material/styles';

import typography from 'themes/typography';

import { borderInput, borderRadius } from './themes/border';
import customColors from './themes/custom-colors'; //NOTE: This is colors of our project
import { fontSize, fontSizeIcon, fontWeight } from './themes/font';
import mainColors from './themes/v1/mainColors'; //NOTE: This is colors of our project
import { default as openColors } from './themes/v1/open-color.json'; //NOTE: Use open color at https://yeun.github.io/open-color/
import { default as newColors } from './themes/v2/colors.json';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: newColors.gray[800],
      light: newColors.gray[500],
      dark: newColors.gray[900],
      contrastText: openColors.white,
    },
    secondary: {
      main: newColors.primary[500],
      light: newColors.primary[50],
      dark: newColors.primary[800],
      contrastText: openColors.white,
    },
    tertiary: {
      main: mainColors.primary3[0],
      light: mainColors.primary3[1],
      dark: mainColors.primary3[2],
      contrastText: openColors.white,
    },
    error: {
      main: mainColors.red[0],
      light: mainColors.red[1],
      dark: mainColors.red[2],
      contrastText: openColors.white,
    },
    background: {
      default: openColors.white,
      main: mainColors.primary1[0],
    },
  },

  typography: {
    fontFamily: ['"Source Sans 3"', 'sans-serif'].join(','),

    fontSize: 15,

    // new system
    ...typography,

    // old system
    h1: {
      fontSize: fontSize.xxLarge,
      fontWeight: fontWeight.bold,
    },
    h2: {
      fontSize: fontSize.xLarge,
      fontWeight: fontWeight.normal,
    },
    h3: {
      fontSize: fontSize.large,
      fontWeight: fontWeight.semi,
    },
    h4: {
      fontSize: fontSize.xMedium,
      fontWeight: fontWeight.normal,
    },
    h5: {
      fontSize: fontSize.medium,
      fontWeight: fontWeight.semi,
    },
    h6: {
      fontSize: fontSize.medium,
      fontWeight: fontWeight.normal,
    },
    caption: {
      fontSize: fontSize.small,
      fontWeight: fontWeight.bold,
    },
    subtitle1: {
      fontSize: fontSize.normal,
      color: newColors.gray[800],
    },
    subtitle2: {
      fontSize: fontSize.small,
      color: newColors.gray[800],
    },
    body1: {
      fontSize: fontSize.normal,
      fontWeight: fontWeight.normal,
      lineHeight: '24px',
    },
    body2: {
      color: newColors.gray[900],
      fontSize: fontSize.normal,
      fontWeight: fontWeight.normal,
      lineHeight: '20px',
    },
  },

  spacing: 8,
  sideBar: {
    openWidth: 300,
    width: 72,
  },
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },

  drawer: {
    width: 1200,
  },
  navbar: {
    gradebook: 120,
    default: 126,
  },

  breakpoints: {
    // Define custom breakpoint values.
    // These will apply to Material-UI components that use responsive
    // breakpoints, such as `Grid` and `Hidden`. You can also use the
    // theme breakpoint functions `up`, `down`, and `between` to create
    // media queries for these breakpoints
    values: {
      xs: 480,
      sm: 600,
      md: 960,
      lg: 1366,
      xl: 1920,
    },
  },

  // Provide default props
  props: {},

  // Default z-index scale in Material-UI that has been designed to properly layer drawers, modals, snackbars, tooltips, and more.
  zIndex: {},

  // Inject custom styles
  overrides: {},

  // ===COLORS===
  openColors,
  newColors, /// New color System
  mainColors,
  customColors,
  globalColors: {
    placeholderColor: newColors.gray[500],
  },

  // ===FONT SIZE===
  fontSize,

  // ===FONT SIZE ICON===
  fontSizeIcon,

  // ===FONT WEIGHT===
  fontWeight,

  // ===FONT WEIGHT===
  borderInput,
  borderRadius,

  // ===TRANSITION DEFAULT===
  transitionDefault: 'all 200ms ease-in-out',

  // ===BOX SHADOW DEFAULT===
  boxShadowDefault: 'rgba(235,241,249,1) 0 0 0 3px',
});

export default theme;
