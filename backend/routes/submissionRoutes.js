const express = require("express");

const {
    getMySubmissions
} = require("../controllers/submissionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/my",
    authMiddleware,
    getMySubmissions
);

module.exports = router;