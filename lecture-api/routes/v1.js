const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares");
const { createToken, tokenTest } = require("../controllers/v1");

router.use("/token", createToken);
router.use("/test", verifyToken, tokenTest);

module.exports = router;
