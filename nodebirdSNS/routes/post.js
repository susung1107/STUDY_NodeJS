const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { afterUploadImage, uploadPost } = require("../controllers/post");

const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

// 이미지 업로드 폴더 생성
try {
  fs.readdirSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없어 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 확장자 추출
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // basename : 파일 이름 추출
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage);

// 설정이 다르면 multer를 새로 생성해야 함
const upload2 = multer();
router.post("/", isLoggedIn, uploadPost);

module.exports = router;
