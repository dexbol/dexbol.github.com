---
title: 'ES6 函数参数'
layout: post
tags:
    - javascript
    - es6

---

## 形式参数（Parameters）与实际参数（Arguments）

形式参数（parameters or formal parameters or 「形参」）是指定义函数时申明的参数。
实际参数（arguments or actual parameters or 「实参」）是指调用函数时传递的参数。比如：

```javascript
function foo(param1, param2) {
    // do something
}
foo(10, 20);
```

其中`param1`与`param2`是形参，`10`和`20` 是实参。

## 展开运算符（Spread Operator ... ）

ES5 中, 通常使用 apply 方法将数组中的各个元素作为独立的实参传给函数，比如传给
Math.max()：

```javascript
var myArray = [5, 10, 50];
/*
    Math.max() 接收任意数量的数字作为实参，并返回最大的数字。
    这里直接传递了数组，所以无法返回正确的结果。
*/
Math.max(myArray); // Error: NaN
/*
    通过 apply 将数组中各个数组作为独立的实参传递给 Math.max()
    后，得到了正确的结果。
*/
Math.max.apply(Math, myArray); // 50
```

在 ES6 中可以方便的使用展开运算符来完成类似的工作。

```javascript
var myArray = [5, 10, 50];
// 使用展开运算符将数组中的元素展开，形成多个独立的数字作为实参。
Math.max(... myArray); // 50
```

除了上面的场景，扩展运算符还有更高级的用法，比如：

```javascript
function myFunction() {
    for (let i in arguments) {
        console.log(arguments[i]);
    }
}
var param = [10, 15];
// 在一个函数调用中，可以使用多次。
myFunction(5, ...param, 30, ...[25]); // 5, 10, 15, 20

// 还可以在对象实例化中使用
new Date(...[2018, 0, 26]); // Fri Jan 26 2018 00:00:00 GMT+0800 (CST)

// 如果在实例化对象中，使用 apply 代替扩展运算符就没有那么简单了

// TypeError: Date.apply is not a constructor
new Date.apply(null, [2018, 0, 26]);

new (Function.prototype.bind.apply(Date, [null].concat([2018, 0, 26])));
// Fri Jan 26 2018 00:00:00 GMT+0800 (CST)
```

## 剩余形参（Rest Parameters）

收集剩余形参的语法与展开运算符语法完全一样，但行为却完全相反。它可以收集形参并把他们保存
在一个数组中。

```javascript
function myFunction(...options) {
    return options;
}
myFunction('a', 'b', 'c'); // ["a", "b", "c"]

// 如果不传实参会返回一个空数组
myFunction(); // []
```

在声明可变参数函数（Variadic Functions 可以接收任意数量实参的函数）时，
剩余形参可以用来代替`arguments`对象。下面使用 es5 申明一个 Variadic Function ：

```javascript
function checkSubstrings(string) {
    for (var i = 1; i < arguments.length; i++) {
        if (string.indexOf(arguments[i]) === -1) {
            return false;
        }
    }
    return true;
}
checkSubstrings('this is a string', 'is', 'this'); // true
```

使用 `arguments` 对象有两个问题，一是形参欠缺可读性，需要查看函数体才能知道如何传参。
二是 `arguments` 对象收集所有的形参，所以上面的循环从 1 开始，假如在 `string` 和
和子字符串中间再加一个参数，这时还需要修改循环，让它从 2 开始。使用剩余形参可以避免这
两个问题：

```javascript
// 形参 string 会被第一个实参填充，剩余的实参会合并成一个数组赋值给 keys
function checkSubstrings(string, ...keys) {
    for (let i = 0; i < keys.length; i++) {
        if (string.indexOf(keys[i]) === -1) {
            return false;
        }
    }
    return true;
}

checkSubstrings('this is a string', 'is', 'this'); // true
```

剩余形参有两个限制，一是每个函数只能有一个剩余形参, 二是它必须声明为最后一个形参:

```javascript
function logArguments(a, ...params, b) {
    console.log(a, params, b);
}
logArguments(5, 10, 15); // SyntaxError: parameter after reset parameter.

function logArguments(...param1, ...param2) {
}
logArguments(5, 10, 15); // SyntaxError: parameter after reset parameter.
```

## 默认参数

默认参数允许形参有一个初始值。

### es5 中的默认参数

es5 中并不支持默认参数，但是可以通过逻辑与操作符 `||` 实现类似的效果。
逻辑与会先判断第一个值是否为真（或者说是否可以转换为真），如果可以就返回第一个值，
否则返回第二个值。在函数中，如果某个形参没有被传参，那么它会被自动赋值 `undefined`，
因此：

```javascript
function foo (param1, param2) {
    param1 = param1 || 10;
    param2 = param2 || 10;
    console.log(param1, param2);
}
foo(5, 5); // 5 5 
foo(5); // 5 10
foo(); // 10 10

/*
这种实现方式有一个缺点就是：假如实参为 0 或者 null，由于 0 ，null 不为真，所以会使用
后面的默认值。 
*/
foo(5, 0) // 5 10

// 可以通过使用全等于运算符避免
function foo(param1, param2) {
    if (param1 === undefined) {
        param1 = 10;
    }
    if (param2 === undefined) {
        param2 = 10;
    }
    console.log(param1, param2);
}
foo(0, null); // 0 null
foo(); // 10 10
```

### es6 中的默认参数

es6 中可以直接在函数申明中设置形参初始值，不再需要检查是否为 `undefined` ：

```javascript
function foo(a = 10, b = 10) {
    console.log(a, b);
}
foo(5); // 5 10
foo(0, null); // 0 null

// 不仅如此，在函数声明中设置初始值时还可以引用其他参数
function bar(a = 10, b = a) {
    console.log('a = ' + a + '; b = ' + b);
}
bar() // a = 10; b = 10
bar(22) // a = 22; b = 22
bar(2, 4) // a = 2; b = 4

// 甚至，还可以使用运算符
function myFunction(a, b = ++a, c = a * b) {
    console.log(c);
}
myFunction(5) // 36

// 不仅如此，还可以通过函数调用返回初始值。
function getPrama() {
    alert('getParam was called');
    return 3;
}
function multiply(param1, param2 = getParam()) {
    return param1 * param2;
}
multiply(2, 5) // 10
multiply(2); // 6 (同时会 alert)
```

对于函数 `multiply` ，之所以只传一个参数时才会 `alert` 是由于 es6 不像其他语言一样
在申明函数时就设置初始值，而是在调用函数时才会设置初始值。比如 python 中：

```python
def get_param():
    print('get param')
    return 5


def foo(param=get_param()):
    print(param)


# print('get param')
foo() # 5
foo(10) # 10
```

可以看到在调用函数 foo 之前就打印了 `get param` ，而 es6 中，只有调用 `multiply(2)`
时才弹 alert。

## 解构（Destructuring）

解构是 es6 引进的新特征。解构可以将数组和对象中的元素或属性赋值给一组类似数组或对象
字面量的变量中。

```javascript
var obj = {
    a: 1,
    b: 2
};
var ar = [3, 4];

var {a, b} = obj;
var [item1, item2] = ar;

console.log(a); // 1
console.log(b); // 2
console.log(item1); // 3
console.log(item2); // 4
```

在 es5 中，当需要申明一个有很多可选形参的函数时，经常会使用一个配置对象代替那些单独的形参。
这种方式的弊端是必须查看函数体，才能知道配置对象中需要设置哪些属性。es6 中，可以使用
解构清晰明了的申明配置对象参数。

```javascript
// es5
function initiateTransfer(options) {
    var protocol = options.protocol;
    var port = options.port;
    var delay = options.delay;
    var retries = options.retries;
    var timeout = options.timeout;

    console.log(portocol);
    // ...
}
initiateTransfer({
    portocol: 'http',
    port: 8080,
    delay: 150,
    timeout: 10
});

// es6
function initiateTransfer({protocol, port, delay, retries, timeout}) {
    console.log(protocol);
    // ...
}
initiateTransfer({
    portocol: 'http',
    port: 8080,
    delay: 150,
    timeout: 10
});
```

不仅如此，es6 中解构形参和普通形参可以混合使用。

```javascript
// 混用解构和普通形参
function initiateTransfer(param1, {protocol, port, delay, retries, timeout}) {
    // do something
}

var options = {
    protocal: 'https',
    // ...
};
initiateTransfer('some value', options);
```

解构形参还可以设置为必选或可选，
并且可以为解构中各个元素分别设置默认值。

```javascript
function initiateTransform({protocol, port, delay, retries, timeout}) {
    // ...
}
// 如果申明函数时，设置了解构形参。调用函数时没有传入对应的对象就会报错。
initiateTransform(); // TypeError: Cannot match against 'undefined' or 'null';

// 通过设置解构形参的默认值，使其变为可选。
function initiateTransform({protocol, port, delay, retries, timeout} = {}) {
    // ...
}
initiateTransform(); // no error.

// 单独设置每个元素的默认值
function initiateTransform({
        protocol = 'http',
        port = 8080,
        delay = 150,
        retries = 10,
        timeout = 50
    }) {
    // ... 
}
```

## 参考链接

- [How to user arguments and parameters in eamascript 6](https://www.smashingmagazine.com/2016/07/how-to-use-arguments-and-parameters-in-ecmascript-6/)
