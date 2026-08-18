// src/theme/typography.js

const typography = {
  fontFamily: [
    "Inter",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ].join(","),

  h1: {
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },

  h2: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
  },

  h3: {
    fontSize: "1.75rem",
    fontWeight: 600,
    lineHeight: 1.3,
  },

  h4: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  h5: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  h6: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.5,
  },

  subtitle1: {
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },

  subtitle2: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },

  body1: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.7,
  },

  body2: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.6,
  },

  button: {
    fontSize: "0.95rem",
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.02em",
  },

  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    color: "#64748B",
  },

  overline: {
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
};

export default typography;