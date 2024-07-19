import { sveltekit } from "@sveltejs/kit/vite"
import Icons from "unplugin-icons/vite"
import { purgeCss } from "vite-plugin-tailwind-purgecss"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss(),
		Icons({
			compiler: "svelte"
		})
	],
	test: {
		environment: "node",
		globals: true
	}
})
