const { Domain, User } = require("../models");
const jwt = require("jsonwebtoken");

exports.createToken = async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: [{ model: User, attributes: ["id", "nick"] }],
    });

    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요",
      });
    }

    const token = jwt.sign(
      {
        // 토큰 내용을 삽입
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
        issuer: "nodebird",
      }
    );

    return res.json({
      code: 200,
      message: "토큰 발급되었습니다.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
};

exports.tokenTest = async (req, res) => {
  // 토큰내용을 프론트에 출력시키기 위한 코드
  res.json(res.locals.decoded);
};
