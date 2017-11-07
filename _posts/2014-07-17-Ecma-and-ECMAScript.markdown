---
title: '八卦一下 Ecma 和它的 ECMAScript'
layout: post
tags:
    - javascript
---

几乎所有讲 JavaScript 的书籍都以“什么是JavaScript”开篇，其中
必会提到 ECMAScript 和 Java 。不过都是简单介绍，这里详细的记录
一下他们的历史，与技术无关，纯属娱乐，To Long Don't Read.

名词及历史
----------

*JavaScript* - Java 是 Sun(Oracle) 的商标，因此 JavaScript 也是
Sun 的商标，从它的写法 JavaScript 就能体现出这点。JavaScript
由 Netscape 工程师 Brendan Eich 开发，最初的名字是 Mocha 后来改
名为 LiveScript。最后 Netscape 为了营销与 Sun 达成商标使用协议，
于是就有了现在的名字，不过 Java 与 JavaScript 的关系也就仅此而已。
95年12月，Netscape 与 Sun 联合发布了 JavaScript，Navigator 2.0
开始支持 JavaScript, 不久后 Mirosoft 开发与 JavaScript 兼容的脚本，
为了避免商标纠纷，取名为JScript。96年，Mirosoft 发布的 Internet Explorer
3.0 中开始支持 JScript。同年 Netscape 将 JavaScirpt 提交给 Ecma
进行标准化。

*Ecma* - 最初的写法应该是 ECMA (European Computer Manufactures
Association) 欧洲计算机制造协会，是一个会员制的标准化组织。后来
Ecma 为了走出欧洲迈向世界，不再使用首字符缩写的 ECMA，更名为
Ecma International.

*ECMAScript* - 96年，当 Netscape 将 JavaScript 提交给 Ecam 后需要给
这个语言起一个标准化后的名字，但当时各方没有达成共识，最后无奈，Ecma
发明了这个名字，可以说 ECMAScript 是一个各方妥协的产物，Brendan 甚至
认为这个名字听起来像是皮肤病（"Which sounds a little like a skin disease.
Nobody really wants it"），非常不利于市场营销。

*ECMA-262* - 262是 Ecma 的规范文档编号，类似 ISO900x 之类的东西。这个
文档描述了 ECMAScript 规范。

*TC39 (Ecma's Technical Committee 39)* - 一个实现 ECMA-262 规范的技术
小组，成员来自各大 IT 公司，包括 Brendan Eich等。

ECMAScript 版本历史
-------------------

*ECMAScript 3* - 99年12月发布， ECMAScript 第三版，或者可以称为第三版
ECMA-262 标准文档。几乎所有浏览器都实现了它，可以大胆使用，而不用担心浏
览器兼容问题。

*ECMAScript 4* - Ecma 的一次大胆尝试，08年已被抛弃。第四版加入很多新的
特征，但 TC93 并不同意加入这些新特征，TC39 觉得这这样太过激进，不能更
好的兼容上一版本。最后为了不让会议陷入僵局，Ecma 与 TC39 达成了以下四
点共识：

*    开发下一版本（ECMAScript 5）。
*    开发一个新的发布版，没有 ECMAScript 4 那么激进，但范围更广，不仅
     包括 ECMAScript 的下一版还包括以后所有版本可能出现的特征，代号
     Harmorny，这个版本用来应对和实现会议中的构想。
*    去掉 ES4 中一些新特征，包括：package, namesapce, early binding.
*    其他想法 Emca 与 TC39 达成一致。

也就是说：ES4 同意让 Harmorny 更加保守些，而 TC39 也同意让事情继续
向前发展。Adobe 的 ActionScript 可能是唯一的一个实现了 ES4 新特征
的语言。

*ECMAScript 5* - 09年12月发布，增强了标准库。甚至在 "strict mode"
下更新了语言本身。

*ECMAScript.Next* - 由于 Harmoney 野心太大，Ecma 将它的特征分为
两组：一组只考虑 ES5 的下一版本，称它为 ECMAScript.next, 其中
一些特征很可能出现在 ECMAScript 6中。余下的特征归为第二组（ECMAScript Harmony），
它们不急于出现在下一个 ECMASCript 版本中，但是依然有可能出现在
以后的版本中，比如：ECMASciprt.Next.Next 或者 ECMAScript 7。

Parting Words
-------------

Ecma 经过了 ES4 失败的教训，现在并不急于推出正式的新版本。
因此才会有 ECMAScript.Next 和 Harmoney 这样的项目。文档
规范很重要，事实上的标准同样重要。

Referrece
---------

*    <http://www.2ality.com/2011/06/ecmascript.html>
*    <http://en.wikipedia.org/wiki/Ecma>
*    <http://en.wikipedia.org/wiki/ECMAScript>
*    <http://www.infoworld.com/d/developer-world/javascript-creator-ponders-past-future-704>
*    <http://web.archive.org/web/20070916144913/http://wp.netscape.com/newsref/pr/newsrelease67.html>
