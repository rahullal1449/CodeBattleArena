const express = require("express");

const {
    getProblems,
    getProblemById
} = require("../controllers/problemController");

const router = express.Router();

router.get("/", getProblems);

router.get("/:id", getProblemById);

module.exports = router;