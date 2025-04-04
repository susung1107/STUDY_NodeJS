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

# 4. 노드 내장 객체

내장 객체 같은 경우는 굳이 외울 필요 없음. 주로 사용하는것만 설명함.

## 1. global

브라우저의 window와 같은 전역객체이다. 전역객체이기 때문에 모든 파일에서 접근이 가능하다. 또한 global을 생락할 수 도 있다.
전에 사용했던 require 함수도 사실 global.require에서 global이 생략된 것이다.<br>
global 객체 내부에는 매우 많은 속성이 들어 있습니다. 내부를 보려면 REPL을 이용해야합니다.

```bash
$node
> global
> global.console;
```

노드 버전에 따라 콘솔내용이 다를 수 있다. 실제로 실행해보면 global 객체 안에는 수십가지의 속성이 담겨져 있다. 다 알 필요는 없고 자주 사용하는 속성만 알아두면 좋을듯 하다.
전역 객체라는 점을 이용하여 파일 간에 간단한 데이터를 공유할 때 사용하기도 한다.

```javascript
// globalA.js
module.exports = () => global.message;
```

```javascript
// globalA.js
const A = require("./globalA");

global.message = "안녕하세요";
console.log(A());
```

globalA 모듈의 함수는 global.message 값을 반환합니다. globalB.js에서는 global 객체에 속성명이 message인 값을 대입하고 globalA 모듈의 함수를 호출합니다. 콘솔 결과는 globaB에서 넣은 global.message 값을 globalA에서도 접근할 수 있음을 보여줍니다.

```bash
$node globalB
안녕하세요
```

> ### global 객체의 남용
>
> global 객체의 속성에 값을 대입하여 파일 간에 데이터를 공유할 수 있지만, 남용은 하지마세요. 프로그램의 규모가 커질수록 어떤 파일에서 global 객체에 값을 대입했는지 찾기 어려워 유지보수에서 어려움을 겪게됩니다. 다른 파일의 값을 사용하고 싶다면 모듈 형식으로 만들어서 명시적으로 값을 불러와 사용하는 것이 좋습니다.

## 2. console

지금까지 사용했던 console도 노드에서는 window 대신 global 객체 안에 들어 있으며, 브라우저에서의 console과 거의 비슷합니다.
<br>
console 객체는 보통 디버깅을 위해 사용합니다. 대표적으로 console.log 메서드가 있다. console.log는 지금껏 계속 사용했으므로 익숙하다.

### console.time(레이블)

console.timeEnd(레이블)과 대응되어 같은 레이블을 가진 time과 timeEnd 사이의 시간을 측정합니다.

### console.log(내용)

평범한 로그를 콘솔에 표시합니다. console.log(내용, 내용, ...) 처럼 여러 내용을 동시에 표시할 수 도 있습니다.

### console.error(에러 내용)

에러를 콘솔에 표시합니다.

### console.table(배열)

배열의 요소로 객체 리터럴을 넣으면, 객체의 속성들이 테이블 형식으로 표현됩니다.

### console.dir(객체, 옵션)

객체를 콘솔에 표시할 때 사용합니다. 첫 번째 인수로 표시할 객체를 넣고, 두 번째 인수로 옵션을 넣습니다. 옵션의 colors를 true로 하면 콘솔에 색이 추가되어 보기가 한결 편해집니다. depth는 객체 안의 객체를 몇 단계까지 보여줄지를 결정합니다. 기본값을 2입니다.

### console.trace(레이블)

에러가 어디서 발생했는지 추적할 수 있습니다. 일반적으로 에러 발생 시 에러 위치를 알려주므로 자주 사용하지는 않지만, 위치가 나오지 않는다면 사용할 만 합니다.

```javascript
// 결과는 직접 해보시길 ^^

console.time("전체시간");
console.log(string, number, boolean);
console.error("에러 메시지는 여기에");

console.table([
  { name: "susung", birth: 1999 },
  { name: "kim", birth: 1999 },
]);

console.dir(Obj, { color: false, depth: 2 });
console.dir(Obj, { color: true, depth: 1 });

function b() {
  console.trace("에러 위치 추적");
}

function a() {
  b();
}
a();

console.timeEnd("전체시간");
```

## 3. 타이머

setTimeout, setInterval, setImmdiate는 노드에서 window 대신 global 객체에 있습니다. 웹을 했다면 setTimeout, setInterval 두개는 익숙 할 겁니다.

### setTimeout(콜백 함수, 밀리초)

주어진 밀리초(1,000분의 1초) 이후에 콜백 함수를 실행합니다.

### setInterval(콜백 함수, 밀리초)

주어진 밀리초마다 콜백 함수를 반복 실행합니다.

### setImmediate(콜백 함수)

콜백함수를 즉시 실행합니다.

이 모든 타이머함수들은 <span style="color : yellow;">**clear함수(아이디)**</span> 로 타이머를 취소할 수 있습니다.

<br>

# 4. \_ _filename, _ \_dirname

> 언더바 2개는 Double underscore라고 불리며 줄여서 '던더' 라고 많이들 부름 ㅋㅋ

노드에서는 파일 사이에 모듈 관계가 있는 경우가 많으므로 때로는 현재 파일의 경로나 파일명을 알아야합니다. 노드는 **filename, **dirname이라는 키워드로 경로에 대한 정보를 제공합니다.

```javascript
console.log(__filename);
console.log(__dirname);
```

```bash
$node filename.js
C:\Users\kangs\filename.js
C:\Users\kangs
```

# 5. 프로세스

노드는 운영체제에 접근할 수 있다.<br>
process 객체는 현재 실행되고 있는 노드 프로세스에 대한 정보를 담고 있습니다. 하나씩 REPL에 따라 입력합니다.

## process.env

시스템의 환경변수를 알 수 있다.

# 6. OS

os.cups() -> cpu 에 대한 정보
cpu 코어의 개수를 알 수 있다.

# 7. URL, DNS module

WHATWG 웹표준을 정하는 단체
최근에는 WHATWG 표준을 사용

URLSearchParams는 이터레이터 객체이다. -> 이터레이터에 대해 한번 보는게 좋을듯
쿼리스트링을 요즘엔 서치파람을 더 많이 쓴다 서치파람만 보면 될듯

# 8. crypto 와 util

crypto 암호화

# 9. worker_thread

노드에서 멀티 스레드 방식으로 작업할 수 있게 함. 모듈임. <br>
멀티 스레드 방식을 사용하는건 극히 드물긴하다.

- 메인 스레드
- 워커 스레드

로 분기하여 작업을 구현함
메인 -> 워커 스레드로 일을분해 후 -> 다시 메인에 합쳐 실행되는 구조

# 10. child process

다른 언어 프로그램을 가지고 올 수 있다.
