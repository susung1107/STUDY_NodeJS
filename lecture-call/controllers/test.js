const axios = require("axios");

exports.test = async (req, res, next) => {
  try {
    const tokenResult = await axios.post("http://localhost:8002/v1/token", {
      clientSecret: process.env.CLIENT_SECRET,
    });

    if (tokenResult.data?.code === 200) {
      // 토큰 발급 성공
      req.session.jwt = tokenResult.data.token; // 세션에 저장 : 매번 토큰을 발급받으면 불필요한 과정이라서 세션에 저장함
    } else {
      // 토큰 발급 실패
      return res.status(tokenResult.data.code).json(tokenResult.data);
    }

    // 토큰을 테스트하는 요청
    const result = await axios.get("http://localhost:8002/v1/test", {
      headers: { authorization: req.session.jwt },
    });

    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response?.data?.code === 419) {
      return res.json(error.response.data);
    }
    return next(error);
  }
};
