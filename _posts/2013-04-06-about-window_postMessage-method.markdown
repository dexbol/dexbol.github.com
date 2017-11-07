---
title: 'window.postMessage and backward solution'
layout: post
tags:
    - javascript
---

window.postMessage 已被主流浏览器支持，所以再也不用
嵌套好几层 iframe 或者用其他蹩脚的方法 hack 了。这里记录
一下 API 的语法， IE 8/9 的问题以及骨灰级浏览器 IE6/7 的
解决方案。

Syntax
------

     otherWindow.postMessage(message, targetOrigin);

*    `otherWindow` -- 消息发送目标（window object）。通常为
     一个 iframe 内的
     window 对象（通过 `iframe.contentWindow` 获得）或通过
     `window.open()` 返回的新窗口对象，以及 `document.frames`
     中的某个 window 对象

*    `message` -- 要发送的消息，Firefox6 或之前比较老的浏览器
     只支持 string 类型，为了方便向后兼容就当它只能是字符串
     吧。

*    `targetOrigin` -- 字符串，指定 otherWindow 的源必须匹配
     此字符串时消息才能传递，值可以是一个 URI 或者通配符
     '*' . 如果是URI，URI的通讯协议，主机名，域名，端口号都要
     和 postMessage 被调用时 otherWindow 的源保持一致。否则信
     息无法传递。如果是通配符没有此限制。Mozilla 建议为了安全
     永远不要使用通配符。

接受消息
--------

在 otherWindow 中可以通过添加 message 事件监听由
postMessage 发送的消息：

     // 如果是 ie8 使用attachEvent 以及对应的IE那套事件规范
     window.addEventListener('message', function(event) {
          if (event.origin != 'http://dexbol.com') {
               return;
          }
          // ...
     }, false);

event 对象除了常规事件的通用属性还有几个 MessageEvent 的
特有属性：

*    data -- 就是发来的message

*    origin -- 消息来源 window 的源，其实就是一个URI。
     比如 http://example.com https://exmaple.com
     http://example.com:8080

*    source -- 消息来源 window 对象。

安全问题
--------

1.   如果不需要接收 postMessage 传递过来的信息，一定不要监听
     message 事件。这样可以彻底避免 postMessage 的安全隐患。

2.   targetOrigin 永远指定一个具体的URI，而不是一个通配符。
     假如指定的是通配符，搞不好就会被哪个预谋已久的第三方
     网站截获消息。

3.   如果知道具体的消息发送方信息，一定要验证 event.origin
     以及 event.source , 来避免未知网站发送恶心消息。并且
     一定要验证消息本身，不要上来就 `eval(event.data)` .

IE 8/9
------

IE 8/9 虽然支持 postMessage API, 但只限于 frame/iframe 之间的
传输，新窗口和tab之间无法通过 postMessage 通讯，还好这种使用
场景并不多。

IE 6/7
------

6/7 跟 postMessage 半毛钱关系都没有，它们根本就不支持。不过可以
通过老版本IE浏览器漏洞来实现类似的功能：iframe 与父窗口之间可以
访问同一对象 window.navigator。假如 a.com/test.html 内嵌入
b.com/test.html 。然后各个文件内有如下js：

     // a.com/test.html
     navigator['foo'] = function() {
          alert('cross domain');
     }

     // b.com/test.html
     navigator['foo']() // alert('cross domain')

如预期一样会看到 cross domain。利用这点便可以跨域通讯了。

例子
----

代码记录一下思路，并不能单独使用：
<https://gist.github.com/dexbol/5324980>

Reference
---------

*    <http://caniuse.com/#feat=x-doc-messaging>
*    <https://developer.mozilla.org/en-US/docs/DOM/window.postMessage>
*    <http://blogs.msdn.com/b/ieinternals/archive/2009/09/16/bugs-in-ie8-support-for-html5-postmessage-sessionstorage-and-localstorage.aspx>
