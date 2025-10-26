import ratelimiter from "express-rate-limit"


export const routeratelimiter = ratelimiter({
  windowMs : 1 * 60 * 1000, 
  max : 1000, 
  standardHeaders : true,
  legacyHeaders : false 
})

export const OtpRateLimiter = ratelimiter({
    windowMs : 1 * 60 * 1000,
    max : 10 ,
    standardHeaders : true,
    legacyHeaders : false
})

export const ComilerRateLimiter = ratelimiter({
  windowMs : 1 * 60 * 1000,
  max : 10,
  standardHeaders : true,
  legacyHeaders : false
})