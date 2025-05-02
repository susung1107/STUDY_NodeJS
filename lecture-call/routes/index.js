const express = require("express");
const {
  getMyPosts,
  searchByHashtag,
  renderMain,
  getMyFollowers,
  getMyFollowings,
} = require("../controllers");
const router = express.Router();

// router.get("/test", test);
router.get("/myposts", getMyPosts);
router.get("/search/:hashtag", searchByHashtag);
router.get("/followers/:id", getMyFollowers);
router.get("/followings/:id", getMyFollowings);
router.get("/", renderMain);

module.exports = router;
