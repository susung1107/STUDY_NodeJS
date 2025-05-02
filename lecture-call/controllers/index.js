const axios = require("axios");

// exports.test = async (req, res, next) => {
//   // 토큰 테스트 라우터
//   try {
//     if (!req.session.jwt) {
//       // 세션에 토큰이 없으면 토큰 발급 시도
//       const tokenResult = await axios.post("http://localhost:8002/v1/token", {
//         clientSecret: process.env.CLIENT_SECRET,
//       });
//       if (tokenResult.data?.code === 200) {
//         // 토큰 발급 성공
//         req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
//       } else {
//         // 토큰 발급 실패
//         return res.json(tokenResult.data); // 발급 실패 사유 응답
//       }
//     }
//     // 발급받은 토큰 테스트
//     const result = await axios.get("http://localhost:8002/v1/test", {
//       headers: { authorization: req.session.jwt },
//     });
//     return res.json(result.data);
//   } catch (error) {
//     console.error(error);
//     if (error.response?.status === 419) {
//       // 토큰 만료 시
//       return res.json(error.response.data);
//     }
//     return next(error);
//   }
// };

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;

// 공통 함수
const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token;
    }
    // 결과 반환
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    });
  } catch (error) {
    if (error.response?.status === 419) {
      delete req.session.jwt;
      return request(req, api); // 토큰 만료 시 토큰 삭제 후 다시 요청
    }
    return error.response;
  }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const result = await request(req, "/posts/my");
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.searchByHashtag = async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
    );
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
