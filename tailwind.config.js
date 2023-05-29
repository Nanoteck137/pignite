/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";

export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {},
};
export const plugins = [forms];
