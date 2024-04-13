import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { RATE_LIMITER_SECRET } from '$env/static/private';

export const getLimiter = (limiterId: string) => {
	return new RateLimiter({
		// A rate is defined as [number, unit]
		IP: [3, 'm'], // IP address limiter
		IPUA: [3, 'm'], // IP + User Agent limiter
		cookie: {
			// Cookie limiter
			name: limiterId, // Unique cookie name for this limiter
			secret: RATE_LIMITER_SECRET,
			rate: [3, 'm'],
			preflight: true // Require preflight call (see load function)
		}
	});
};
