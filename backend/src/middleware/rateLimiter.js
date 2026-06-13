const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15*60*1000, // 15 mins
    max: 10,
    message: {
        message: "too many reqs, please try again later",
    },
});

module.exports = authLimiter;