# 3장 Javascript 복습하기

## 1. 호출 스택

```javascript
function first() {
  second();
  console.log("첫 번째");
}

function seconde() {
  third();
  console.log("두 번째");
}

function third() {
  console.log("세 번째");
}

first();
```

실행순서는 세 번째 -> 두 번째 -> 첫 번째
이유는 함수가 먼저 실행되기 때문이다!

쉽게 파악하기 위해서는 호출 스택을 그리면 된다!

### 호출 스택(함수의 호출, 자료구조의 스택), 동기(순서대로)

- anonymous는 가상의 전역 컨텍스트(항상 있다고 생각하는게 좋음)
- 함수 호출 순서대로 쌓이고, 역순으로 실행됨
- 함수 실행이 완료되면 스택에서 빠짐
- LIFO 구조라서 스택이라고 불림

**비동기를 설명하기 위해서는 이벤트 루프가 나와야함**
<br>
<br>

## 2. 이벤트 루프

자바스크립트의 이벤트 루프를 모르면 자바스크립트를 모르는거다.

**호출스택 -> 백그라운드 -> task 큐 -> 호출스택**
으로 반복되면서 코드가 실행된다.

<br>

### 이벤트 루프

이벤트 발생 시 호출할 콜백 함수들을 관리하고, 호출된 콜백 함수의 실행 순서를 결정하는 역할을 담당, 노드(js)가 종료될 때까지 이벤트 처리를 위한 작업을 반복하여 루프(loop)라고 부름

### 백그라운드

이벤트 리스너들이 대기하는 곳, 다른 언어로 작성된 다른 프로그램이라고 보면될듯. 여러작업이 동시에 실행될 수 있다.

### 태스크 큐

이벤트 발생 후, 백그라운드에서 태스크 큐로 타이머나 이벤트 리스너의 콜백 함수를 보낸다. 정해진 순서대로 콜백들이 줄을 서 있으므로 콜백 큐라고도 부름. 보통 완료된 순서대로 줄을 서지만, 특정한 경우에는 순서가 바뀌기도 한다.

<br>

## 3. const, let, var

### ES2015 이전에는 var(variable)로 변수를 선언

- ES2015부터는 const와 let이 대체
- 가장 큰 차이점: 블록 스코프(var은 함수 스코프)

```javascript
if (true) {
  var X = 3;
}
console.log(X); // 3

if (true) {
  const Y = 3;
}
console.log(Y); // Uncaught ReferenceError : Y is not defined
```

### 기존: 함수 스코프(function() {} 이 스코프의 기준점)

- 다른 언어와는 달리 if나 for, while이 영향을 미치지 못함
- const와 let은 함수 및 블록({})에도 별도의 스코프를 가짐

### 참고

여기서 const는 상수라는 개념보다는 값을 한번만 대입할 수 있다!(const b = 3) 라고 이해하면 더 좋을듯함.

```javascript
const a = 3;
a = "5"; // 에러

const b = { name: "kang" };
b.name = "kim"; // 가능
```

<br>

## 4. 템플릿 문자열, 객체 리터럴

### 템플릿 문자열

```javascript
const result = `이 과자는 ${won}원 입니다.`;
```

이 형태를 템플릿 문자열이라고 부릅니다.

> `(백틱)으로 함수 호출도 가능하다. a() => a`` (태그드 템플릿 리터럴이라고 부름)

### 객체 리터럴

ES5 시절의 객체 표현

```javascript
var sayNode = function () {
  console.log("Node");
};

var es = "ES";
var oldObject = {
  sayJS: function () {
    console.log("JS");
  },
  sayNode: sayNode,
};
oldObject[es + 6] = "Fantastic";
oldObject.sayNode(); // Node
oldObject.sayJS(); // JS
console.log(oldObject.ES6); // Fantastic
```

<br>

**이후 최신에서는 훨씬 간결한 문법으로 객체 리터럴 표현 가능**

- 객체의 메서드에: function을 붙이지 않아도 됨
- { sayNode: sayNode }와 같은 것을 {sayNode}로 축약 가능
- [변수 + 값] 등으로 동적 속성명을 객체 속성 명으로 사용 가능

```javascript
const newObject = {
  sayJS() {
    console.log("JS");
  },
  sayNode,
  [es + 6]: "Fantastic",
};
newObject.sayNode(); // Node
newObject.sayJS(); // JS
console.log(newObject.ES6); // Fantastic
```

<br>

## 5. 화살표 함수

시작하기전에: 화살표함수는 function함수를 완벽하게 대체할 수 없다.

```javascript
function add(x, y) {
  return x + y;
}

const add2 = (x, y) => {
  return x + y;
};

// add2처럼 중괄호 다음 바로 return이 오면 add3처럼 생략이 가능하다
const add3 = (x, y) => x + y;
```

주의할 점

- 객체를 return 할 때는 소괄호() 가 필수 이다.
  - 왜냐하면 자바스크립트 엔진이 {}를 객체인지 스코프인지 구분읆 못하기 때문이다.

### function 함수

function 함수가 사라지지 않은 이유는 this 때문이다.
<br>
function 함수는 기본적으로 자기자신의 this를 갖지만, 화살표 함수에서의 this는 부모의 this값을 가지고 있다.

> this가 필요하면 function을 쓰지만 아니면 왠만하면 화살표 함수로 사용해라

<br>

## 6. 구조분해 할당

```javascript
// 기존방식
cont example = {a : 123, b : {c: 135, d: 146}}
const a = example.a;
const d = example.b.d;
```

위 코드처럼 작성하면 코드가 지저분해지고 가독성이 엄청 떨어진다.

```javascript
cont example = {a : 123, b : {c: 135, d: 146}}
const {a, b:{d}} = example;

console.log(a) // 123
console.log(d) // 146
```

이렇게 구조분해할당을 통해 간략하게 코드를 작성할 수 있다.
객체뿐만 아니라 배열도 가능합니다.

```javascript
// 기존방식
arr = [1, 2, 3, 4, 5];
const x = arr[0];
const y = arr[1];
const z = arr[2];
```

구조분해할당을 통해 간편하게 가능하다.

```javascript
// 구조분해할당 적용
arr = [1, 2, 3, 4, 5];
const [x, y, , , z] = arr;
```

이렇게 변경이 가능하다. 하지만 주의해야할 점은 자리수를 맞춰줘야한다.

<br>

## 7. 클래스

자바스크립트는 클래스 기반이 아니라 프로토타입 기반으로 동작하지만, 보기 좋게 클래스로 바꾼 것이라고 이해하면 된다.
