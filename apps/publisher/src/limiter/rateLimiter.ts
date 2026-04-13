import ratelimiter from "express-rate-limit";

export const compilerRateLimiter = ratelimiter({
  windowMs: 1 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
