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
