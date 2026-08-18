// src/theme/components.js

import palette from "./palette";
import shadows from "./shadows";

const components = {

  /*
  |--------------------------------------------------------------------------
  | Button
  |--------------------------------------------------------------------------
  */

  MuiButton: {

    defaultProps: {

      disableElevation: true,

    },

    styleOverrides: {

      root: {

        borderRadius: 12,

        textTransform: "none",

        fontWeight: 600,

        padding: "10px 22px",

        transition: "all .25s ease",

      },

      contained: {

        background: palette.primary.main,

        color: "#fff",

        boxShadow: shadows.button,

        "&:hover": {

          background: palette.primary.dark,

          boxShadow: shadows.buttonHover,

          transform: "translateY(-2px)",

        },

      },

      outlined: {

        borderWidth: 1.5,

        "&:hover": {

          borderWidth: 1.5,

        },

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | Card
  |--------------------------------------------------------------------------
  */

  MuiCard: {

    styleOverrides: {

      root: {

        borderRadius: 18,

        boxShadow: shadows.card,

        border: `1px solid ${palette.card.border}`,

        transition: "all .3s ease",

        "&:hover": {

          boxShadow: shadows.cardHover,

          transform: "translateY(-4px)",

        },

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | Paper
  |--------------------------------------------------------------------------
  */

  MuiPaper: {

    styleOverrides: {

      root: {

        borderRadius: 18,

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | TextField
  |--------------------------------------------------------------------------
  */

  MuiOutlinedInput: {

    styleOverrides: {

      root: {

        borderRadius: 12,

        backgroundColor: "#FFFFFF",

        "&:hover .MuiOutlinedInput-notchedOutline": {

          borderColor: palette.primary.main,

        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {

          borderWidth: 2,

          borderColor: palette.primary.main,

        },

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | Table
  |--------------------------------------------------------------------------
  */

  MuiTableHead: {

    styleOverrides: {

      root: {

        background: palette.grey[100],

      },

    },

  },

  MuiTableCell: {

    styleOverrides: {

      head: {

        fontWeight: 700,

        color: palette.text.primary,

      },

      root: {

        borderBottom: `1px solid ${palette.divider}`,

      },

    },

  },

  MuiTableRow: {

    styleOverrides: {

      root: {

        transition: ".2s",

        "&:hover": {

          background: palette.grey[50],

        },

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | Dialog
  |--------------------------------------------------------------------------
  */

  MuiDialog: {

    styleOverrides: {

      paper: {

        borderRadius: 20,

        boxShadow: shadows.dialog,

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | Chip
  |--------------------------------------------------------------------------
  */

  MuiChip: {

    styleOverrides: {

      root: {

        borderRadius: 10,

        fontWeight: 600,

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | Avatar
  |--------------------------------------------------------------------------
  */

  MuiAvatar: {

    styleOverrides: {

      root: {

        fontWeight: 700,

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | Drawer
  |--------------------------------------------------------------------------
  */

  MuiDrawer: {

    styleOverrides: {

      paper: {

        background: palette.sidebar.background,

        color: palette.sidebar.text,

        borderRight: "none",

        boxShadow: shadows.sidebar,

      },

    },

  },

  /*
  |--------------------------------------------------------------------------
  | AppBar
  |--------------------------------------------------------------------------
  */

  MuiAppBar: {

    styleOverrides: {

      root: {

        background: palette.navbar.background,

        color: palette.text.primary,

        boxShadow: shadows.navbar,

      },

    },

  },

};

export default components;