// In-Memory Production Rate Limiter Middleware
const requestCounts = new Map();

const apiLimiter = (maxRequests = 150, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
        const now = Date.now();

        if (!requestCounts.has(ip)) {
            requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
            return next();
        }

        const tracker = requestCounts.get(ip);
        if (now > tracker.resetTime) {
            tracker.count = 1;
            tracker.resetTime = now + windowMs;
            return next();
        }

        tracker.count += 1;
        if (tracker.count > maxRequests) {
            return res.status(429).json({
                message: "Too many requests from this IP. Please try again after 15 minutes."
            });
        }

        next();
    };
};

module.exports = apiLimiter;
