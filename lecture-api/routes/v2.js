const express = require("express");

const {
  verifyToken,
  apiLimiter,
  corsWhenDomainMatches,
} = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v2");
const cors = require("cors");

const router = express.Router();

router.use(corsWhenDomainMatches);

// POST /v2/token
router.post("/token", apiLimiter, createToken);

// POST /v2/test
router.get("/test", verifyToken, apiLimiter, tokenTest);

router.get("/posts/my", verifyToken, apiLimiter, getMyPosts);
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;
