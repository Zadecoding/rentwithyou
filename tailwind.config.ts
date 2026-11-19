import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1B2A4A',
        'primary-navy': '#1E2E48',
        'accent-gold': '#E59A38',
        'accent-amber': '#F59E0B',
        'surface-cream': '#F4EFEA',
        'surface-beige': '#FAF8F5',
        'whatsapp-green': '#1F8A5B',
      },
    },
  },
  plugins: [],
};
export default config;
