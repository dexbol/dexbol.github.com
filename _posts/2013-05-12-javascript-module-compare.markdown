---
title: 'Javascript 模块设计模式比较'
layout: post
tags:
    - javascript
---

Facebook 工程师 [Sebastian](https://github.com/sebmarkbage)
对当前几种 JS 模块化设计模式做了
相对客观的比较，比较在以下假设条件下进行：在生产环境中永远
使用合并，编译后的代码并且相应的编译工具已经开发完毕。

Introduction
------------

模块系统一般包括三个主要特征：

Module Isolation - 模块内的代码不能污染全局作用域。

Inter-module Dependency Definition - 定义模块间依赖关系的语法。

Script Loader - 加载器，一般情况下加载器会对开发环境和生产环境
使用不同的技术，在生产环境下注重加载速度，在开发环境下注重是否
方便调试。

除了以上三个主要特征，还有第四个 Sandboxing and Inversion of
Control - 沙箱和控制反向或称作依赖注入，起源于Java 的一种
[设计模式](http://www.martinfowler.com/articles/injection.html)。

The Traditional Javascript Library
----------------------------------

传统模式。使用立即执行的匿名函数（`;(function(){...})();`）
隔离模块，没有定义模块依赖关系的语法。模块之间通过定义在全局
作用域中的命名空间相互访问。在页面中，通过按依赖关系排列的
多个script 标签加载模块。在生产环境中一般会合并所有模块到一个
文件中。

传统模式的最大问题是没有可以定义多文件之前依赖关系的语法，这
样就很难确定需要哪些文件以及这些文件以什么样的顺序去执行。

Externally Defined Dependencies
-------------------------------

外部定义依赖关系。这种模式同样使用立即执行的匿名函数隔离模块，
但加载方式和生成依赖关系图的方式不同。我们可以在一个单独文件
内定义文件之前的依赖关系，比如在一个 package 中包含一个配置
文件定义 package 内所有文件的依赖关系：

``` javascript
{
     '/MyDependentModule.js': ['/lib/StandAloneModule.js'],
     '/lib/StanAloneMdule.js': []
}
```

加载器会首先加载这个配置文件，然后根据依赖关系按需加载文件。
这种模式比起传统模式可以更轻松的管理文件和执行顺序，但当
依赖关系和文件频繁改变时也会很不方便。

Inferred Dependencies
---------------------

推断依赖关系。通过静态解析代码推断全局变量进一步生成
依赖关系图。

```javascript
var MyGolableModule = (function() {
     var imported = MyOtherModule;
     ...
     return exports;
})();
```

像上面的代码，我们可以推断 `MyOtherModule` 是一个全局变量，
既然这里没有定义这个变量说明它是在其他模块中定义的。
有些模块不定义新的对象而是扩展已有对象（像 YUI 那样），
这种情况可以添加一个空对象来模拟一个模块产出的全局变量。

这种方案有一个问题：我们需要一个包含所有文件的列表，然后
逐个解析以建立依赖关系图。在客户端很容易做到这一点，只要
遍历目录中的所有文件即可，但在浏览器端无法遍历服务器上的
目录。解决办法就是将全局变量名与文件名对应起来，这样就可以
通过变量名推断出文件地址了。

这个方案麻烦的地方就是需要一个相应的编译工具，不过一旦编译
工具完成，这将不再是个问题。

Comment Defined Dependencies
----------------------------
注释推断依赖关系。与直接通过解析代码推断类似，只是把依赖关
系写到注释中，这样不但降低了编译工具的开发难度，而且更方便
在浏览器中解析。

```javascript
// @requires /lib/MyOtherModule.js
var MyGlobalModule = (function() {
     var imported = MyOtherModule;
     ...
     return exports;
})();
```

在浏览器中，加载器可以先通过 XHR 加载文件，解析注释生成依赖关系图后
通过将代码注入到 script 标签内执行。

Synchronous Module Definition (CommonJS)
----------------------------------------

同步模块定义。在非浏览器环境下 CommonJS 定义了可以同步加
载依赖文件的 API，并且内建模块隔离机制，每个文件自成一个
模块，文件内定义的变量并不会泄漏到全局变量中，只能通过
exports 属性共享变量。在模块内可以使用全局函数 `requires`
引入其他模块文件，`requires` 函数接受一个模块文件名做为
参数。

```javascript
var imported = requires('lib/MyOtherModule');
// ...
exports.MyExport = ...;
```

上面的代码可以在 Node.js 或与之兼容的环境下运行。如果
需要在浏览器端使用则需要加载器通过 XHR 加载文件内容，然
后解析代码建立依赖关系图。为了隔离模块（避免文件内变量泄漏到全局作用域）需
要将代码包裹在闭包中，然后通过注入到 script 标签内执行。

CommonJS Hybirds
----------------

此模式主要目的是兼容 CommonJS 和传统模式，在代码中检测
全局变量 requires 与 exports 是否可用，可用的话使用
CommonJS API 否则使用传统模式。

Define Block
------------

```javascript
define(function(require, exports, module) {
     var imported = require('lib/MyOtherModule');
     exports.myExport = ...;
});
```

通过 `define()` 包裹后便可以异步执行代码了。不过在代码
执行之前无法获得模块的依赖关系，因此在浏览器中需
要加载器解析代码并获得依赖关系图。Node.js 在 0.5.x 之
前支持这种方式，之后将不再支持。

需要说明的是国内知名的 seajs 便使用此模式，通过
toString.call(function)获得模块内容，然后解析得到
依赖关系，然后按顺序加载模块文件。

Asynchronous Module Definition (AMD)
------------------------------------

异步模块定义。它结合模块分离，定义依赖语法，加载器
为一体。从而更加方便在浏览器中使用。

```javascript
define(['MyOtherModule'], function(imported) {
     // ...
     return exports;
});
```

使用 AMD 模式的加载器比其他加载器效率都要高，因为它
不需要解析代码生成依赖关系图。当然 Externally Defined
Dependency 除外，因为完整的依赖关系图在本地就已经生成
好了。除了效率高外，AMD 的加载器还可以跨域加载模块文件。

使用 AMD 还有可能兼容 CommonJS 与 Tradition 模式，不过
这需要加载器做一些额外的补丁工作，事实上大名鼎鼎的 RequiresJS
就已经做到了兼容 AMD/CommonJS/Tradtion 。

ECMAScript.Next Modules
-----------------------

ECMAScript.Next 定义了新的语法用来定义模块。

```javascript
moudle importedModule from 'MyOtherModule.js'
// ...
export myExport;
```

与 CommonJS 类似，加载器需要先解析代码内容，重新生成后
注入 script 标签内执行。

对比
----

<table>
<tr>
<th></th>
<th>traditional</th>
<th>External</th>
<th>Comment</th>
<th>Inferred</th>
<th>CommonJS</th>
<th>Hybrid</th>
<th>Define Block</th>
<th>AMD</th>
<th>AMD Hybrid</th>
<th>ES.Next</th>
</tr>
<tr>
<th>Easily Maintained</th>
<td>No</td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Almost</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>Yes</td>
</tr>
<tr>
<th>Source Compatible with Traditional Model</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>Yes</td>
<td>No</td>
<td>No</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<th>Source Compatible with Node.js</th>
<td>No</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>No</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<th>Analysis/Completiion Tools in Current IDEs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>Almost</td>
<td>No</td>
<td>No</td>
<td>Almost</td>
<td>No</td>
</tr>
<tr>
<th>Debugging in Webkit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<th>Debugging in Other Browsers</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Almost</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Almost</td>
</tr>
<tr>
<th>XSS Development Loader useing CORS</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<th>XSS Development Loader without CORS</th>
<td>Yes</td>
<td>Almost</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<th>file:// Protocol Development Loader</th>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<th>Fast Development Loader</th>
<td>Yes</td>
<td>Yes</td>
<td>Almost</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
</tr>
</table>

Parting Words
-------------

作者的原文发表于两年前，虽然时间不短，但到目前还没有新的 JS
模块化解决方案。

在原文的评论中有一位 RequireJS 的开发者认为 AMD 是完美的解决
方案，可以适应各种情况，当然作者有不同的个人看法，所以这里仅
记录各种模式的特征，没有记录作者已经评论者的个人观点和喜好。

Referrens
---------

<http://blog.calyptus.eu/seb/2011/10/choosing-a-javascript-module-syntax/>
