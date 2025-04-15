기존까지 서버를 실행시키는 동안 만 데이터가 유지되고 종료후 재 실행시에는 데이터가 날라갔다.
그럼 실제 서비스에서는 데이터가 남아 있어야하는데 이럴땐 어떻게 하면 될까? 그리고 어디에 저장을 할까?

# 1. 데이터베이스

### MySQL 관계형 데이터베이스를 사용

- 데이터베이스 : 관련성을 가지며 중복이 없는 데이터들의 집합
- DBMS : 데이터베이스를 관리하는 시스템
- RDBMS : 관계형 데이터베이스를 관리하는 시스템
- 서버의 하드디스크나 SSD 등의 저장 매체에 데이터를 저장
- 여러사람이 동시에 접근가능하고, 권한도 부여가 가능하다.

<br>

> **비관계형 데이터베이스나 noSQL은 언제 쓸까?** <br>
> 단순히 로그나 데이터를 구조적으로 정리하기 쉽지 않은 내용을 저장한다

<br>

# 2. 시퀄라이즈 ORM

### MySQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리

ORM : Ojbect Relational Mapping : 객체와 데이터를 매핑(1대1 짝지음)
MySQL 외에도 다른 RDB와도 호환됨
자바스크립트 문법으로 데이터베이스 조작 가능

```shell
npm i express morgan nunjucks sequelize sequelize-cli mysql2
npm i -D nodemon
```

mysqli2는 node와 mysql을 연결하는 드라이버이다!

### sequelize init으로 시퀄라이즈 구조 생성

```shell
npx sequelize init
```

### models/index.js 에서 파일의 내용을 변경합니다.

mysql2를 이용해서 mysql와 node와 시퀄라이즈를 연결해준다.

```javascript
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

# 3. 관계 정의하기

### user 모델과 comments 모델 간의 관계를 정의

## 1:N 관계(사용자 한명이 댓글 여러 개 작성)

- 시퀄라이즈에서는 1:N 관계를 hasMany로 표현(사용자.hasmany(댓글))
- 반대 입장에서는 belongsTo(댓글.belongsTo(사용자))
- belongsTo가 있는 테이블에 컬럼이 생김(댓글 테이블에 commenter 컬럼)

## 1:1 관계

**사용자 테이블과 사용자 정보테이블**

- 주로 사용되는 정보는 사용자 테이블에, 자주 사용되지 않거나 덜 중요한 정보는 사용자 정보테이블에 저장
- 누가 hasone이 되고 누가 belongsTo가 되어야하는지 정해야한다. -> foreignKey를 지정할 테이블에 belongsTo

```javascript
db.User.hasOne(db.Info, { foreignKey: "UserId", sourceKey: "id" });
db.Info.belongsTo(db.User, { foreignKey: "UserId", targetKey: "id" });
```

## N:M (다대다) 관계를

- 예) 게시글과 해시태그 테이블
- 하나의 게시글이 여러 개의 해시태그를 가질 수 있고 하나의 해시태극 여러 개의 게시글을 가질 수 있음
- DB 특성상 다대다 관계는 중간 테이블이 생김.

## 시퀄라이즈 쿼리 알아보기

```javascript
// INSERT INTO nodejs.users(name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');

const { User } = require("../models");
User.create({
  name: "zero",
  age: 24,
  married: false,
  comment: "자기소개1",
});
```

```javascript
// SELECT * FROM nodejs.users;
User.findAll({});
```

```javascript
// SELECT name, married FROM nodejs.users;
User.findAll({
  attributes: ["name", "married"],
});
```

```javascript
// SELECT name, married FROM nodejs.users WHERE married = 1 AND age > 30;
// gt : > , lt : < , gte : >= , lte : <=
const { Op } = require("sequelize"); // Operator 객체 : Op
const { User } = require("../models");
User.findAll({
  attributes: ["name", "age"],
  where: {
    married: false,
    age: { [Op.gt]: 30 },
  },
});
```

### 수정

```javascript
// UPDATE nodejs.users SET comment = '바꿀내용' WHERE id = 2;
User.update(
  {
    comment: " 바꿀내용",
  },
  {
    where: { id: 2 },
  }
);
```

### 삭제

```javascript
// DELETE FROM nodejs.users WHERE id = 2;
User.destory({
  where: { id: 2 },
});
```

더 자세한 가이드는 [Sequelize 공식문서](https://sequelize.org/)를 확인하면 좋다.

## 관계 쿼리

### 결과 값은 자바스크립트 객체이다.

```javascript
const user = await User.findOne({});
console.log(user.nick); // 사용자 닉네임
```

### include로 JOIN과 비슷한 기능 수행 가능(관계 있는 것 엮을 수 있음)

```javascript
const user = await User.FindOne({
  include: [
    {
      model: Comment,
    },
  ],
});
console.log(user.Comments); // 사용자의 모든 댓글(s를 붙혀 복수형으로 모든 댓글을 의미한다.)
```

### 다대다 모델은 다음과 같이 접근 가능하다

```javascript
db.sequelize.models.PostHashtag;
```

### get+ 모델명으로 관계있는 데이터 로딩 가능하다

```javascript
// 위의 include와 비슷하다.
const user = await User.findOne({});
const comments = await user.getComments();
console.log(comments); // 사용자 댓글
```

> **as**로 모델명 변경 가능

### include나 관계 쿼리 메서드에도 where나 attributes

```javascript
const user = await User.findOne({
  include: [
    {
      model: Comment,
      where: {
        id: 1, // Comment의 id가 1 이다!(user에 where가 아니다.)
      },
      attributes: ["id"],
    },
  ],
});
// 또는
const comments = await user.getComments({
  where: {
    id: 1,
  },
  attributes: ["id"],
});
```

### 생성 쿼리

```javascript
const user = await User.findOne({});
const comment = await Comment.create();
await user.addComment(comment);
// 또는
await user.addComment(comment.id);
```

여러개를 추가할 때는 배열로 추가 가능

```javascript
await user.addComment([comment1, comment2]);
```
