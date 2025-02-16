import type { Config } from "tailwindcss"

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				main: "var(--main)",
				overlay: "var(--overlay)",
				bg: "var(--bg)",
				bw: "var(--bw)",
				blank: "var(--blank)",
				text: "var(--text)",
				mtext: "var(--mtext)",
				border: "hsl(var(--border))",
				ring: "hsl(var(--ring))",
				ringOffset: "var(--ring-offset)",
				secondaryBlack: "#212121",
				input: "hsl(var(--input))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				base: "var(--border-radius)",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			boxShadow: {
				shadow: "var(--shadow)",
				"shadow-reverse": "var(--reverse-box-shadow-x) var(--reverse-box-shadow-y) 0px 0px var(--border)",
			},
			translate: {
				boxShadowX: "var(--box-shadow-x)",
				boxShadowY: "var(--box-shadow-y)",
				reverseBoxShadowX: "var(--reverse-box-shadow-x)",
				reverseBoxShadowY: "var(--reverse-box-shadow-y)",
			},
			fontWeight: {
				base: "var(--base-font-weight)",
				heading: "var(--heading-font-weight)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config

