const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");


const {
    signup,
    login,
    getMyStats
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Protected profile route",
        user: req.user
    });
});
router.get("/stats", authMiddleware, getMyStats);

module.exports = router;