import { RateLimiter, type Rate } from 'sveltekit-rate-limiter/server';
import { RATE_LIMITER_SECRET } from '$env/static/private';

export const getLimiter = (limiterId: string, rate: Rate = [3, 'm']) => {
	return new RateLimiter({
		// A rate is defined as [number, unit]
		IP: rate, // IP address limiter
		IPUA: rate, // IP + User Agent limiter
		cookie: {
			// Cookie limiter
			name: limiterId, // Unique cookie name for this limiter
			secret: RATE_LIMITER_SECRET,
			rate: rate,
			preflight: true // Require preflight call (see load function)
		}
	});
};
