/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />
import { build, files, version } from "$service-worker"

const sw = self as unknown as ServiceWorkerGlobalScope

const CACHE = `cache-${version}`
const ASSETS = [...build, ...files]

sw.addEventListener("install", (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE)
		await cache.addAll(ASSETS)
	}

	event.waitUntil(addFilesToCache())
})

sw.addEventListener("activate", (event) => {
	async function clearOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key)
		}
	}

	event.waitUntil(clearOldCaches())
})

sw.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") return

	async function respond() {
		const url = new URL(event.request.url)
		const cache = await caches.open(CACHE)

		if (ASSETS.includes(url.pathname)) {
			const cachedResponse = await cache.match(url.pathname)
			if (cachedResponse) return cachedResponse
		}

		try {
			const response = await fetch(event.request)

			if (!(response instanceof Response)) {
				throw new Error("invalid response from fetch")
			}

			const isNotExtension = url.protocol === "http:" || url.protocol === "https:"
			const isSuccessful = response.status === 200

			if (isNotExtension && isSuccessful) {
				cache.put(event.request, response.clone())
			}

			return response
		} catch (err) {
			const cachedResponse = await cache.match(event.request)

			if (cachedResponse) {
				return cachedResponse
			}

			throw err
		}
	}

	event.respondWith(respond())
})

sw.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") sw.skipWaiting()
})
