import ratelimiter from "express-rate-limit";

/** Strict limiter for submitting new jobs — prevents abuse */
export const compilerRateLimiter = ratelimiter({
  windowMs: 1 * 60 * 1000,
  max: 5, // 5 job submissions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many code submissions. Please wait a moment." },
});

/** Lenient limiter for polling job status — must accommodate frequent polling */
export const compilerStatusRateLimiter = ratelimiter({
  windowMs: 1 * 60 * 1000,
  max: 120, // 120 status polls per minute (~2/sec for up to 60s)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many status requests. Please slow down." },
});

