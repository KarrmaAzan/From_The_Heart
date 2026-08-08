import { alpha, createTheme } from "@mui/material/styles";

const gold = "#D5A85A";
const ink = "#09090B";
const paper = "#151416";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: gold,
      light: "#F1D49B",
      dark: "#9D7335",
      contrastText: ink,
    },
    secondary: {
      main: "#F5EFE5",
      contrastText: ink,
    },
    background: {
      default: ink,
      paper,
    },
    text: {
      primary: "#F7F3EC",
      secondary: "#A9A39B",
    },
    divider: alpha("#FFFFFF", 0.09),
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: "clamp(3.25rem, 8vw, 7.5rem)",
      fontWeight: 500,
      lineHeight: 0.9,
      letterSpacing: "-0.055em",
    },
    h2: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: "clamp(2.15rem, 4vw, 4.25rem)",
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: "-0.035em",
    },
    h3: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: "clamp(1.8rem, 3vw, 3rem)",
      fontWeight: 500,
      lineHeight: 1.08,
    },
    h4: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)",
      fontWeight: 500,
      lineHeight: 1.1,
    },
    h5: { fontWeight: 650, letterSpacing: "-0.02em" },
    h6: { fontWeight: 650, letterSpacing: "-0.015em" },
    button: { fontWeight: 700, letterSpacing: "0.01em", textTransform: "none" },
    overline: { fontWeight: 800, letterSpacing: "0.2em", lineHeight: 1.5 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 46,
          padding: "10px 20px",
          borderRadius: 999,
          transition: "transform 180ms ease, background-color 180ms ease, border-color 180ms ease",
          "&:hover": { transform: "translateY(-1px)" },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${gold}, #B57D36)`,
          color: ink,
          "&:hover": { background: "linear-gradient(135deg, #E4BD73, #C18A42)" },
        },
        outlined: {
          borderColor: alpha("#FFFFFF", 0.18),
          "&:hover": { borderColor: alpha(gold, 0.65), backgroundColor: alpha(gold, 0.06) },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: paper,
          border: `1px solid ${alpha("#FFFFFF", 0.08)}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: alpha("#FFFFFF", 0.035),
          "& fieldset": { borderColor: alpha("#FFFFFF", 0.12) },
          "&:hover fieldset": { borderColor: alpha(gold, 0.48) },
          "&.Mui-focused fieldset": { borderColor: gold },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 8, backgroundColor: "#252225" },
      },
    },
  },
});

export default theme;
