# 1. express 시작

### morgan

요청했을때 어떤 응답값을 보내주는지 알 수 있다.(요청과 응답을 기록하는 용도)
<br>
'dev' : 개발할때 자주 사용한다.
<br>
'combined' : 배포할때 자주 사용하며, 조금 더 자세한 정보를 알려준다.

### cookie-parser

복잡했던 쿠키를 파싱하는 과정을 편하게 해주는 용도

```javascript
app.use(cookieParser("rkdtntjdPW"));

// 쿠키 파싱
req.cookies; // { mycookie: "test" }

// 쿠키 서명 (암호화)
req.signedCookies;

// 쿠키 설정
// 원래 코드 : 'Set-Cookie' : 'name=${encodeURIComponent(name)}; expires=${expires.toUTCString()}; httpOnly; path=/'
// 쿠키 설정 예시
res.cookie("name", encodeURIComponent(name), {
  expires: new Date(),
  httpOnly: true,
  path: "/",
});

// 쿠키 삭제
res.clearCookie("name", encodeURIComponent(name), {
  httpOnly: true,
  path: "/",
});
```

### static

정적파일을 보내줄 때 주로 사용합니다. 이미지, 동영상, pdf ...을 제공한다.
요청경로와 실제 경로를 다르게 설정해서 보안성을 높인다.

```javascript
app.use("요청 경로", express.static("실제경로"));
// 요청 경로 : localhost:3000/hello.html
// 실제 경로 : learn-express/public-3030/hello.html
```

### 미들 웨어 간에도 순서가 중요하다!

- 대부분의 미들웨어는 next를 포함하고 있다.
- 주로 아래와 같은 순서로 작성하고 있다.
- 정해진건 없지만 서비스에 맞게 순서를 조정한다.
- 순서에 따라 성능 차이도 있기 때문에 잘 생각해야함

```javascript
app.use(morgan("dev"));
app.use("/", express.static(__dirname, "public"));
app.use(cookieParser("rkdtntjdPW"));
app.use(express.json()); // json data를 파싱해서 req.body에 넣어줌
app.use(express.urlencoded({ extended: true })); // true면 qs, false면 querystring 모듈 사용
app.use(session);
app.use(multer().array());
```

### 미들웨어 확장법

```javascript
app.use("/", (req, res, next) => {
  if (req.session.id) {
    express.static(__dirname, "public")(req, res, next);
  } else {
    next();
  }
});
```

## multer, 멀티파트 데이터 형식

### form 태그의 enctype이 multipart/form-data인 경우

- body-parser로는 요청 본문을 해석할 수 없음
- nulter 패키지 필요

```javascript
const multer = require("multer");

// 서버가 실행되고 있을때는 Sync를 사용하면 안되지만, 이 코드는 서버가 실행되기 전에 실행하는 코드라 Sync를 사용해도 무방하다.
// 폴더를 찾고 없으면 만드는 코드임
try {
  fs.readdirSync("uploads");
} catch (err) {
  console.error("uploads 폴더가 없어서 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  // storage : 업로드한 파일을 어디에 저장을 할 것인가?
  storage: multer.diskStorage({
    // 어디다가 저장할지? uploads 폴더에!
    destination(req, file, done) {
      // done(에러발생시, 성공시)
      done(null, "uploads/");
    },
    filename(req, file, done) {
      // 이름이 같으면 덮어씌워짐 그래서 date와 같은 방법은 사용해서 구분함
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
```

# dotenv

- 미들웨어는 아님, 비밀키나 설정 등 이런 내용들을 저장할 수 있음
- 중요한 값을 보안을 위해 따로 저장함
- 최대한 위에서 import한다.
- 소스코드에 비밀코드를 넣지마라!!!

```shell
npm i dotenv

process.env.COOKIE_SECRET
```

### 그러면 혹시 dotenv가 털리면????

- 깃헙이나 사이트에는 절때 올리지 않는다!
- 개개인 마다 권한마다 코드를 다르게 설정한다.

# Router 분리하기

## 라우트 매개변수

**: id를 넣으면 req.params.id로 받을 수 있다.**
<br>

- 동적으로 변하는 부분을 라우트 매개변수로 만들 수 있다.
- 일반 라우터보다 뒤에 위치해야 한다.

**query string 같은 경우에는 req.query로 받을 수 있다.**
<br>

## 404 미들웨어

**요청과 일치하는 라우터가 없는 경우를 대비해 40라우터 만들기**
<br>
모든 라우터 뒤에 작성하면 걸리는게 없을때 실행된다.

```javascript
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
```

## 라우터 그룹화

### router.route로 묶음

사실 잘 사용하지 않은 방식이긴 하다.

```javascript
router.route('/abc').get(req,res) => {
  res.send('GET /abc');
}).post((req, res) => {
  res.send('POST /abc');
});
```

# 템플릿 엔진

### html의 정적인 단점을 개선

- 동적인 페이지 작성가능
- 반복문, 조건문, 변수 등을 사용할 수 있음

## 넌적스

### 기존 Html 문법과 거의 동일한듯함.

## Pug(구 Jade)

### 문법이 Ruby와 비슷해 코드 양이 많이 줄어듦.

코드는 상단에 port와 morgan 사이에 추가 해주면 된다.

```javascript
app.set("views", path.join(__dirname, "views"));
app.set("views engine", "pug");
```
