const Post = require("../models/post");

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  // req.body.content, req.body.url
  try {
    const post = await post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
