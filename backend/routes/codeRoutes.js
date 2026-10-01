
const express = require("express");

const {
    runCode,
    submitCode
} = require("../controllers/codeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/run", runCode);

//router.post("/submit", submitCode);
router.post(
    "/submit",
    authMiddleware,
    submitCode
);

module.exports = router;



// const express = require("express");

// const { runCode } = require("../controllers/codeController");

// const router = express.Router();

// router.post("/run", runCode);

// module.exports = router;