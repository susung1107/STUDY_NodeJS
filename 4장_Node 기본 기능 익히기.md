# 1. REPL

### 자바 스크립트는 스크립트 언어라서 즉석에서 코드를 실행할 수 있음

- REPL이라는 콘솔 제공
- R(Read), E(Evaluate), P(Print), L(Loop)
- 코드를 읽고, 해석하고, 결과를 반환하고 종료할때 까지 반복한다고해서 REPL라고 부름.

<br>

# 2. 모듈로 만들기

## exports

### 노드는 자바스크립트 코드를 모듈로 만들 수 있음

- 모듈 : 특정한 기능을 하는 함수나 변수들의 집합
- 모듈로 만들면 여러 프로그램에서 재사용 가능

```javascript
// var.js
var odd = "홀수";
var even = "짝수";

module.exports = {
  odd,
  even,
};
// 배열로 export로도 가능, 일반적으로는 객채로 export
```

```javascript
// func.js
const value = require("./var");
console.log(value);

// 구조분해할당
//const { odd, even } = require("./var");

function checkOddOrEven(number) {
  if (number % 2) {
    return odd;
  } else {
    return even;
  }
}

// 파일에서 단 한번만 사용
module.exports = {
  checkOddOrEven,
  // odd,
  // even
  // 가져온 값을 다시 export도 가능함
};
```

module.exports는 단축이 가능하다

```javascript
// var.js
var odd = "홀수";
var even = "짝수";

// module.exports = {
//   odd,
//   even,
// };

exports.odd = odd;
exports.even = even;
// module.exports === exports === {}
// 객체형태이다.
```

만약에 함수를 exports 한다면?

```javascript
function checkOddOrEven(number) {
  ...
}

module.exports = checkOddOrEven;
// module.exports !== exports === {};
// 성립되지 않음
```

## this

많이 헷갈린다
<br>

```javascript
console.log(this); // global 아님, 결과는 {}
console.log(this === module.exports); // true

function a() {
  console.log(this === global); // true, 함수내부에서 사용하면 global임.
}
```

## require

- require는 파일 및 모듈을 불러오는 데 사용됩니다. 예를 들어, 내장 모듈, 사용자 정의 모듈, 또는 외부 패키지를 불러올 수 있습니다.
- require로 불러온 모듈은 하드웨어에 캐싱되어 다시 사용할때 메모리로 불러와 사용함 -> 성능 향상

<br>

## 순환참조

- require를 서로하여 무한반복이 일어나면 빈객체로 바꿔버림(자동으로 해줌)
- 최대한 피하라

<br>

# 3. ECMAScript 모듈

해당 모듈은 표준은 아니다. 그치만 표준이 없어서 해당 모듈이 표준으로 자리 잡고 있다.
노드에서 아직 commonJS 모듈을 많이 사용하지만, ES모듈도 알고 있어야한다.
<br>
확장자 : .mjs

### 코드

```javascript
// var.mjs
// named export 방식(이름이 정확한 export)
export const odd = "MJS 홀수";
export const even = "MJS 짝수";
```

```javascript
// func.mjs
// default export 방식
import { even, odd } from "./var.mjs";

function checkOddOrEven(num) {
  if (num & 2) {
    return odd;
  } else {
    return even;
  }
}

export default checkOddOrEven;
```

기존에 comminJS 모듈에서는 reqiure를 사용해서 가져왔지만 es 모듈에서는 import를 사용해서 모듈을 가져옵니다.

### 다이나믹 임포트

```javascript
// dynamic.js
if (a) {
  require("./func");
}
console.log("성공"); // 성공
```

이렇게 조건부로 모듈을 불러오는 것을 다이내믹 임포트라고 한다.
하지만 조건문에서 impor를 사용해서 모듈을 부르는것은 불가능하다.
import 문은 항상 최상단에 존재해야한다.

그렇지만 import로 사용할 수 가 있다.

```javascript
// dynamic.js
const a = true;
if (a) {
  const m1 = await import("./func.mjs");
  console.log(m1); //
  const m2 = await import("./var.mjs");
  console.log(m2);
}
```

import 함수를 사용하여 사용할 수 있다. import 함수는 promise라서 await를 사용해주어야한다.
결과에서 default에 담겨서 들어오는건 func.mjs에서 export default에 담아서 export 를 했지 때문이다.
