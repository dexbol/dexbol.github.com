---
title: 'Javascript 中的二进制数据'
thumb: '/ass/img/binary-data-in-javascript.png'
layout: post
---

## ArrayBuffer 类

表示连续的，固定长度的，一块内存区域，存储着原始二进制数据，
类似其他语言中的 "bytes array"。

```javascript
// 创建一块长度为 8 bytes 的内存区域。
var buff = new ArrayBuffer(8);
console.log(buff.byteLength); // 8
```

你无法直接通过 ArrayBuffer 类访问或修改它的数据，
如果需要读取/修改 ArrayBuffer 中的数据，需要是一个「视图」即 ArrayBufferView :

## ArrayBufferView 概念

ArrayBufferView 不是一个真实的类，而是对 ArrayBuffer 视图的总称。
ArrayBufferView 包含 TypedArray 和 DataView。

### TypedArray 类

TypedArray 为 ArrayBuffer 提供与数组类似的视图。你不能直接实例化 TypedArray 类，
它只为各种格式的 TypedArray 对象提供原型，即公用的属性和方法。
如果在浏览器执行 `new TypedArray()` 会看到 TypedArray 未定义的报错。

```javascript
new TypedArray(); // TypedArray is not defined
```

创建一个 TypedArray 对象需要通过实例化 TypedArray 的某个子类，它们有：
`Uint8Array Int8Array Uint16Array Int16Array` 等等。
其中 `Uint8Array` 比较常见。

```javascript
// Uint8Array 继承了 TypedArray 的原型链。
Object.getPrototypeOf(Uint8Array); // TypedArray

// 创建一个 6 bytes 长度的视图。
// 这个过程中，会自动创建一个 6 bytes 的 ArrayBuffer。
// 视图是不能单独存在的。
var arr8 = new Uint8Array(6);
// 也就是说以上代码相当于：
var buff = new ArrayBuffer(6);
var arr8 = new Uint8Array(buff);

var arr16 = new Uint16Array(6);
// 相当于：
var buff = new ArrayBuffer(12);
var arr16 = new Uint16Array(buff);
// 上面之所以需要创建一个 12 bytes 的 ArrayBuffer
// 是因为一个 Uint16Array 元素会占用 2 个 bytes
new ArrayBuffer(12).byteLength === new Uint16Array(6).byteLength; // true

// 有了「视图」后就可以修改数据了。
arr8[0] = 258;
console.log(arr8); // [2, 0, 0, 0, 0, 0]
// 之所以第一个元素是 2 而不是 258，
// 是因为 258 超出了 1 个 byte 能表示的整数范围。
// 258 的二进制是：
Number(258).toString(2); // 100000010
// Uint8Array 会取最后 8 位即：00000010
// 10进制表示为：
parseInt('00000010', 2); // 2
```

`Uint8Array` 中的 Uint 是指 "unsigned int" ，它只能表示正数，
表示范围从 `00000000` 到 `11111111` 即 0 ～ 255 共 256 个数字。
相对应的是 `Int8Array`，它的元素可以表示负数，由于需要用第一位表示正负，
因此只能用余下的 7 位表示数值，表示的范围为 -128 ~ 127 。

TypedArray 的方法与普通数组基本一致，比如都有 `slice` `find` `reduce` 等。
但没有 `splice` 方法，因为 TypedArray 背后的 ArrayBuffer 长度是固定的。
除此之外 TypedArray 也没有 `concat` 方法。

TypedArray 有 2 个普通数组没有的方法：`set` 和 `subarray`

-   `arr.set(fromArr, [offset])` 复制 fromArr 中所有元素到 arr ，
    arr 的开始位置为 offset，默认为 0.

-   `arr.subarray([begin, end])` 与 `slice` 方法类似，但是只复制视图，
    复制出来的视图与 arr 对应同一 ArrayBuffer。

### DataView 类

DataView 是一种比 TypedArray 更灵活的 ArrayBufferView。
它与 TypedArray 有 2 点最大的不同：

-   实例化 DataView 时，不会像 TypedArray 那样自动创建一个对应的 ArrayBuffer，
    DataView 的 buffer 必须在实例化时以参数的形式指定。

```javascript
var buffer = new ArrayBuffer(16);
var dv = new DataView(buffer);
```

-   DataView 不需要在实例化时指定格式，而是在读取时。

```javascript
// 创建一个 4 bytes 每一位都是 1 的 ArrayBuffer。
var buffer = new Uint8Array([255, 255, 255, 255]).buffer;
var dv = new DataView(buffer);

// 获得第一个 byte
console.log(dv.getUint8(0)); // 255
// 获得前两个 bytes
console.log(dv.getUint16(0)); // 65535 Math.pow(2, 16)
// 将 4 个 bytes 全都设置为 0.
dv.setUint32(0, 0);
console.log(((dv.getUint8(0) == dv.getUint16(0)) == dv.getUint32()) == 0);
```

## BufferSource 概念

BufferSource 是 ArrayBuffer 以及它的视图的总称。
BufferSource = ArrayBuffer + ArrayBufferView

## Blob/File 类

BufferSource 是 javascript 标准的一部分，而 Blob 以及扩展出来的 File 是浏览器的原生对象，
是应用于 BufferSource 的高级接口。

Blob 是由 MIME 类型与 Blob 数据组成，Blob 数据可以是由字符串，Blob，或者 BufferSource
组成的数组。可以把 Blob 理解成标明数据类型的二进制数据。

```javascript
// 由字符串数组创建一个 html 类型的 Blob。
var blob = new Blob(['<html><body><h1>Blob</h1></body></html>'], {
    type: 'text/html'
});
```

```javascript
// 通过由 BufferSource和字符串组成的数组创建一个文本类型的 Blob
// [72, 101, 108, 108, 111] 是 Hello 的码位（code point）。
var blob = new Blob([new Uint8Array([72, 101, 108, 108, 111]), ' ', 'world'], {
    type: 'text/plain'
});
```

### 将 Blob 作为 URL 资源使用

Blob 可以作为 `a` 或 `img` 标签的 url 使用，在 http 协议传输中，Blob 对象的 type
属性将成为 http header 中 `Content-Type` 的值。下面的例子将上面生成的文本类型 Blob
作为 `a` 标签的 `href` 属性，用户通过点击链接可以将 Blob 作为文本类型文件下载到本地。

```html
<html>
    <body>
        <a download>Download a txt file</a>
        <script>
            var blob = new Blob(
                [new Uint8Array([72, 101, 108, 108, 111]), ' ', 'world'],
                {
                    type: 'text/plain'
                }
            );
            document.querySelector('a').href = URL.createObjectURL(blob);
        </script>
    </body>
</html>
```

`URL.createObjectUrl()` 会生成这种格式的 url：`blob:<origin>/<uuid>` ，
这个地址会映射到内存中的 blob 资源。就像变量一样，如果引用数不为 0 ，
变量引用的资源就不会被释放，除非网页关闭。因此如果我们使用 `URL.createObjectUrl`
生成的 url 不在需要时，需要手动调用 `URL.revokeURLObject()` 方法释放掉内存资源
（如果 blob 还被其他变量引用，则不会立即释放）。

除了通过 `URL.createObjectUrl` 方法将 Blob 转为 url 外，还可以通过 FileReader
类将 Blob 对象转为 `Data URLs`。Data URL 的格式为：
`data:[<meidiatype>][;base64],<data>`

```javascript
var blob = new Blob([new Uint8Array([72, 101, 108, 108, 111]), ' ', 'world'], {
    type: 'text/plain'
});
var reader = new FileReader();

reader.readAsDataURL(blob);
reader.onload = function () {
    // data:text/plain;base64,SGVsbG8gd29ybGQ=
    console.log(reader.result);
};
```

Data URLs 的优点是不需要手动释放内存，缺点是如果 Blob 数据量大，会有性能问题。

### 将 Canvas 转成 Blob 对象

`canvas.toBlob` 方法可以将 canvas 转为 Blob，类似给 canvas 截了一个屏，
并将截屏信息保存到 Blob 对象。

```html
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <canvas></canvas>
        <button>Canvas Shot</button>
        <script>
            var canvas = document.querySelector('canvas');
            var context = canvas.getContext('2d');
            var img = new Image();

            img.src = '/ass/img/binary-data-in-javascript.png';
            img.crossOrigin = 'anonymous';
            img.onload = function () {
                context.drawImage(img, 0, 0);
                context.font = '48px serif';
                context.fillText('zhangkai.pro', 0, 40);
            };
            document.querySelector('button').addEventListener(
                'click',
                function (event) {
                    canvas.toBlob((blob) => {
                        var url = URL.createObjectURL(blob);
                        var a = document.createElement('a');

                        a.download = '';
                        a.href = url;
                        a.click();
                    }, 'image/png');
                },
                false
            );
        </script>
    </body>
</html>
```

### 将 Blob 对象转成 ArrayBuffer

可以将 Blob 转成 ArrayBuffer 后进行更底层的数据操作。
转换需要使用 FileReader 类。

```javascript
var blob = new Blob([]);
var reader = new FileReader();

reader.readAsArrayBuffer(blob);
reader.onload = function () {
    // the ArrayBuffer
    console.log(reader.result);
};
```

### File 类

File 类是 Blob 类的扩展。除了继承 Blob 所有属性方法外还有 2 个自己独有的属性：
`name` 和 `lastModified`。
File 对象除了直接实例化 File 类获得外，还能通过用户选取本地文件获得。

```javascript
document.querySelector('input[type=file]').addEventListener(
    'change',
    (event) => {
        var input = event.target;
        var theFile = input.files[0];

        console.log(theFile.name); // 松岛枫.avi
        console.log(theFile.lastModified); // 1599813257435
    },
    false
);
```

### FileReader 类

FileReader 类用于读取 Blob(File) 的二进制内容，
上面我们已经使用过 `readAsArrayBuffer` 和 `readAsDataURL` 方法，
这里介绍 FileReader 的更多方法。

```javascript
var reader = new FileReader();

// 读取内容作为 ArrayBuffer 对象
reader.readAsArrayBuffer(blob);
// 读取内容作为字符串
reader.readAsText(blob, encoding);
// 读取内容作为 Data URL
reader.readAsDataURL();

reader.onload = function () {
    console.log(reader.result);
};
```

## TextEncoder/TextDecoder Class

TextDecoder 将 BufferSource 转成字符串；
TextEncoder 将字符串转为 utf-8 编码的 BufferSource；
TextDecoder 与 `FileReader.readAsText` 作用类似。

```javascript
var utf8Decoder = new TextDecoder();
// 一个汉字「张」在 utf-8 编码中需要占用 3 个字节。
var utf8EncodedBytes = new Uint8Array([229, 188, 160]);

console.log(utf8Decoder.decode(utf8EncodedBytes)); // 张

var utf8Encoder = new TextEncoder();

utf8Encoder.encode('🌞'); // Uint8Array(4) [240, 159, 140, 158]

var blob = new Blob([utf8EncodedBytes], {
    type: 'text/plain'
});
var reader = new FileReader();

reader.readAsText(blob);
reader.addEventListener('load', (event) => {
    console.log(event.target.result); // 张
});
// 或者
reader.onload = function () {
    console.log(reader.result); // 张
};
```

## Binary String 概念

Binary String 与 Javascript 中普通的字符串无异，
都是使用 UTF-16 编码，每个字符至少占用 2 个字节。
唯一区别是 Binary String 中的字符码位（code point）不能超过 255 。
类似 ASCII，可以把 Binary String 理解为一个字符集，ASCII 码位不能超过 127，
而 Binary String 不能超过 255。

Binary String 并不是用来展示文字的，而是用来表示原始的二进制数据。
在 TypedArray 出现之前，人们使用 Binary String 作为二进制流，然后通过
`charCodeAt()` 将每个字符转成一个字节的值。除此以外，`btoa` 也会用到这个概念：

## btoa and atob

`btoa` 将 Binary String 转化为 Base64 ASCII 字符串。
`btoa` 可以接受任何字符串作为参数，但是字符串的范围不能超过 Binary String :

```javascript
console.log('H'.charCodeAt(0)); // 72 , 小于 255，范围内。
console.log('张'.charCodeAt(0)); // 24352，大于 255， 范围外。
btoa('H'); // SA==
btoa('张'); // Error!
```

如果需要编码 Binary String 范围以外的字符，需要先将一个字符拆分成多个 Binary String
字符：

```javascript
function toBinaryString(str) {
    var utf8Encoder = new TextEncoder();
    var buff = utf8Encoder.encode(str);
    var result = [];

    for (var i = 0 ; i < buff.byteLength; i++) {
        result.push(String.fromCharCode(buff[i]));
    }

    return result.join('');
}

function toNoramlString(bs) {
    var utf8Decoder = new TextDecoder();
    var buff = new Uint8Array(bs.split('').map((s) => s.charCodeAt(0)));

    return utf8Decoder.decode(buff);
}

btoa(toBinaryString('张')); // 5byg
toNoramlString(atob('5byg')); // 张
```

`atob` 做 `btoa` 的反向操作。
