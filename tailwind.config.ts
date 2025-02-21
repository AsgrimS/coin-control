import type { Config } from "tailwindcss"
import { contentPath, skeleton } from "@skeletonlabs/skeleton/plugin"
import * as themes from "@skeletonlabs/skeleton/themes"

const config = {
  darkMode: "selector",
  content: ["./src/**/*.{html,js,svelte,ts}", contentPath(import.meta.url, "svelte")],
  theme: {
    extend: {},
  },
  plugins: [
    skeleton({
      themes: [themes.vintage],
    }),
  ],
} satisfies Config

export default config
