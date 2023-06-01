/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";
import elevation from "tailwindcss-elevation";

export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      "neon-black": "#191825",
      "neon-purple": "#865DFF",
      "neon-dark-pink": "#E384FF",
      "neon-light-pink": "#FFA3FD",
    },
  },
};
export const plugins = [forms, elevation];
