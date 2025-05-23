const express = require("express");

const { verifyToken, deprecated } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
  getMyFollowers,
  getMyFollowings,
} = require("../controllers/v1");

const router = express.Router();
// router.use(deprecated); // 모든 라우터에 적용

// POST /v1/token
router.post("/token", createToken);

// POST /v1/test
router.get("/test", verifyToken, tokenTest);

router.get("/posts/my", verifyToken, getMyPosts);
router.get("/posts/hashtag/:title", verifyToken, getPostsByHashtag);
router.get("/user/followers/:id", verifyToken, getMyFollowers);
router.get("/user/followings/:id", verifyToken, getMyFollowings);

module.exports = router;
