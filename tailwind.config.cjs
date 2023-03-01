// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mygray: colors.slate,
        primary: colors.blue,
        mygreen: colors.emerald,
        myred: colors.red,
        mywhite: colors.neutral,
      },
    },
  },
  plugins: [require("daisyui")],
};
