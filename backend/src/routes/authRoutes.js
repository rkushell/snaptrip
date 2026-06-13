const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/rateLimiter");

const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register",authLimiter,registerUser);
router.post("/login",authLimiter,loginUser);

router.get("/profile",authMiddleware, function(req,res){
    res.json({
        message:"protected route accessed",
        user: req.user,
    });
});

module.exports = router;