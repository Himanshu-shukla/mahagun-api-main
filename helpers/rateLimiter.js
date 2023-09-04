import rateLimit from "express-rate-limit";

const limiterBaseData = {
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
};

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: "Too many requests from this IP, please try again after one hour",
  ...limiterBaseData,
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
  ...limiterBaseData,
});

const passowrdLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: "Too many requests from this IP, please try again after 5 minutes",
  ...limiterBaseData,
});

export { inquiryLimiter, otpLimiter, passowrdLimiter };
