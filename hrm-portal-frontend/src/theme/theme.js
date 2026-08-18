import {
  createTheme
} from "@mui/material/styles";


// ============================================================
// BRAND COLORS
// ============================================================

const brand = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  secondary: "#4F46E5",

  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
  info: "#0284C7",

  background: "#F8FAFC",
  surface: "#FFFFFF",

  textPrimary: "#0F172A",
  textSecondary: "#64748B",

  border: "#E2E8F0",

  sidebar: "#0F172A",
  sidebarHover: "#1E293B"
};


// ============================================================
// LIGHT THEME
// ============================================================

export const lightTheme = createTheme({

  palette: {

    mode: "light",

    primary: {
      main: brand.primary,
      dark: brand.primaryDark,
      contrastText: "#FFFFFF"
    },

    secondary: {
      main: brand.secondary,
      contrastText: "#FFFFFF"
    },

    success: {
      main: brand.success
    },

    warning: {
      main: brand.warning
    },

    error: {
      main: brand.error
    },

    info: {
      main: brand.info
    },

    background: {
      default: brand.background,
      paper: brand.surface
    },

    text: {
      primary: brand.textPrimary,
      secondary: brand.textSecondary
    },

    divider: brand.border
  },


  // ==========================================================
  // TYPOGRAPHY
  // ==========================================================

  typography: {

    fontFamily:
      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em"
    },

    h2: {
      fontWeight: 800,
      letterSpacing: "-0.025em"
    },

    h3: {
      fontWeight: 800,
      letterSpacing: "-0.02em"
    },

    h4: {
      fontWeight: 750,
      letterSpacing: "-0.02em"
    },

    h5: {
      fontWeight: 700
    },

    h6: {
      fontWeight: 700
    },

    subtitle1: {
      fontWeight: 600
    },

    button: {
      fontWeight: 700,
      textTransform: "none"
    }
  },


  // ==========================================================
  // SHAPE
  // ==========================================================

  shape: {
    borderRadius: 12
  },


  // ==========================================================
  // SHADOWS
  // ==========================================================

  shadows: [
    "none",

    "0px 1px 2px rgba(15, 23, 42, 0.05)",

    "0px 2px 6px rgba(15, 23, 42, 0.06)",

    "0px 4px 12px rgba(15, 23, 42, 0.08)",

    "0px 8px 20px rgba(15, 23, 42, 0.08)",

    "0px 12px 28px rgba(15, 23, 42, 0.10)",

    "0px 16px 36px rgba(15, 23, 42, 0.12)",

    "0px 20px 44px rgba(15, 23, 42, 0.14)",

    "0px 24px 52px rgba(15, 23, 42, 0.16)",

    "0px 28px 60px rgba(15, 23, 42, 0.18)",

    "0px 32px 68px rgba(15, 23, 42, 0.20)",

    "0px 36px 76px rgba(15, 23, 42, 0.22)",

    "0px 40px 84px rgba(15, 23, 42, 0.24)",

    "0px 44px 92px rgba(15, 23, 42, 0.26)",

    "0px 48px 100px rgba(15, 23, 42, 0.28)",

    "0px 52px 108px rgba(15, 23, 42, 0.30)",

    "0px 56px 116px rgba(15, 23, 42, 0.32)",

    "0px 60px 124px rgba(15, 23, 42, 0.34)",

    "0px 64px 132px rgba(15, 23, 42, 0.36)",

    "0px 68px 140px rgba(15, 23, 42, 0.38)",

    "0px 72px 148px rgba(15, 23, 42, 0.40)",

    "0px 76px 156px rgba(15, 23, 42, 0.42)",

    "0px 80px 164px rgba(15, 23, 42, 0.44)",

    "0px 84px 172px rgba(15, 23, 42, 0.46)",

    "0px 88px 180px rgba(15, 23, 42, 0.48)",

    "0px 92px 188px rgba(15, 23, 42, 0.50)"
  ],


  // ==========================================================
  // COMPONENT OVERRIDES
  // ==========================================================

  components: {

    // ----------------------------------------------------------
    // BUTTON
    // ----------------------------------------------------------

    MuiButton: {

      defaultProps: {
        disableElevation: true
      },

      styleOverrides: {

        root: {
          borderRadius: 10,
          minHeight: 42,
          paddingLeft: 18,
          paddingRight: 18
        }
      }
    },


    // ----------------------------------------------------------
    // PAPER
    // ----------------------------------------------------------

    MuiPaper: {

      styleOverrides: {

        root: {
          backgroundImage: "none"
        }
      }
    },


    // ----------------------------------------------------------
    // CARD
    // ----------------------------------------------------------

    MuiCard: {

      styleOverrides: {

        root: {
          borderRadius: 16,
          border: `1px solid ${brand.border}`,
          backgroundImage: "none",
          transition:
            "transform 180ms ease, box-shadow 180ms ease",

          "&:hover": {
            boxShadow:
              "0px 8px 24px rgba(15, 23, 42, 0.08)"
          }
        }
      }
    },


    // ----------------------------------------------------------
    // TEXT FIELD
    // ----------------------------------------------------------

    MuiTextField: {

      defaultProps: {
        variant: "outlined",
        size: "medium"
      }
    },


    // ----------------------------------------------------------
    // OUTLINED INPUT
    // ----------------------------------------------------------

    MuiOutlinedInput: {

      styleOverrides: {

        root: {

          borderRadius: 10,

          backgroundColor: "#FFFFFF",

          transition:
            "border-color 150ms ease, box-shadow 150ms ease",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94A3B8"
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
            borderColor: brand.primary
          },

          "&.Mui-focused": {
            boxShadow:
              "0 0 0 3px rgba(37, 99, 235, 0.10)"
          }
        }
      }
    },


    // ----------------------------------------------------------
    // CHIP
    // ----------------------------------------------------------

    MuiChip: {

      styleOverrides: {

        root: {
          borderRadius: 8,
          fontWeight: 700
        }
      }
    },


    // ----------------------------------------------------------
    // TABLE
    // ----------------------------------------------------------

    MuiTableCell: {

      styleOverrides: {

        head: {
          fontWeight: 700,
          color: brand.textPrimary,
          backgroundColor: "#F8FAFC"
        },

        root: {
          borderColor: brand.border
        }
      }
    },


    // ----------------------------------------------------------
    // TABLE ROW
    // ----------------------------------------------------------

    MuiTableRow: {

      styleOverrides: {

        root: {

          transition:
            "background-color 120ms ease",

          "&:hover": {
            backgroundColor: "#F8FAFC"
          }
        }
      }
    },


    // ----------------------------------------------------------
    // DIALOG
    // ----------------------------------------------------------

    MuiDialog: {

      styleOverrides: {

        paper: {
          borderRadius: 16,
          backgroundImage: "none"
        }
      }
    },


    // ----------------------------------------------------------
    // TOOLTIP
    // ----------------------------------------------------------

    MuiTooltip: {

      defaultProps: {
        arrow: true
      }
    },


    // ----------------------------------------------------------
    // ALERT
    // ----------------------------------------------------------

    MuiAlert: {

      styleOverrides: {

        root: {
          borderRadius: 10
        }
      }
    },


    // ----------------------------------------------------------
    // APP BAR
    // ----------------------------------------------------------

    MuiAppBar: {

      styleOverrides: {

        root: {
          boxShadow: "none",
          backgroundImage: "none"
        }
      }
    }
  }
});


// ============================================================
// DARK THEME — FOUNDATION
// ============================================================

export const darkTheme = createTheme({

  palette: {

    mode: "dark",

    primary: {
      main: "#60A5FA",
      dark: "#3B82F6",
      contrastText: "#0F172A"
    },

    secondary: {
      main: "#818CF8"
    },

    success: {
      main: "#4ADE80"
    },

    warning: {
      main: "#FBBF24"
    },

    error: {
      main: "#F87171"
    },

    info: {
      main: "#38BDF8"
    },

    background: {
      default: "#0B1120",
      paper: "#111827"
    },

    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8"
    },

    divider: "#1E293B"
  },

  typography: lightTheme.typography,

  shape: {
    borderRadius: 12
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border:
            "1px solid rgba(148, 163, 184, 0.14)"
        }
      }
    }
  }
});


export default lightTheme;