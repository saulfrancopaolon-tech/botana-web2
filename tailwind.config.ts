import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        head: ["'Bebas Neue'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      colors: {
        brand: {
          /* Fondos caldos — NOT pure black */
          bg:    "#0D0907",
          bg2:   "#130E09",
          bg3:   "#1A1209",
          bg4:   "#231608",
          /* Rojo chile vivo */
          red:   "#E8341A",
          red2:  "#FF4D2E",
          /* Ambar-naranja ancho */
          orange:"#F5820A",
          gold:  "#D4A017",
          /* Texto calido */
          white: "#FAF6F2",
          gray:  "#A89E96",
          gray2: "#6B5E55",
        },
      },
      /* Replaces Tailwind defaults used heavily in the project */
      backgroundColor: {
        "botana-bg":  "#0D0907",
        "botana-bg2": "#130E09",
        "botana-bg3": "#1A1209",
      },
      textColor: {
        "botana-red":    "#E8341A",
        "botana-orange": "#F5820A",
      },
      borderColor: {
        "botana": "rgba(232,52,26,0.10)",
      },
      animation: {
        marquee:    "marquee 28s linear infinite",
        "slide-up": "slideUp 0.45s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in":  "fadeIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
        "fade-in-up":"fadeInUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-pop":"scalePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        float:      "float 3s ease-in-out infinite",
      },
      keyframes: {
        marquee:    { from:{transform:"translateX(0)"}, to:{transform:"translateX(-50%)"} },
        slideUp:    { "0%":{transform:"translateY(48px) scale(0.98)",opacity:"0"}, "60%":{opacity:"1"}, "100%":{transform:"translateY(0) scale(1)",opacity:"1"} },
        fadeIn:     { from:{opacity:"0"}, to:{opacity:"1"} },
        fadeInUp:   { from:{opacity:"0",transform:"translateY(24px)"}, to:{opacity:"1",transform:"translateY(0)"} },
        scalePop:   { "0%":{transform:"scale(0.7)",opacity:"0"}, "70%":{transform:"scale(1.08)"}, "100%":{transform:"scale(1)",opacity:"1"} },
        float:      { "0%,100%":{transform:"translateY(0)"}, "50%":{transform:"translateY(-8px)"} },
      },
      boxShadow: {
        "brand-sm": "0 4px 16px rgba(232,52,26,0.25)",
        "brand-md": "0 8px 28px rgba(232,52,26,0.32)",
        "brand-lg": "0 14px 40px rgba(232,52,26,0.40)",
      },
    },
  },
  plugins: [],
}

export default config
