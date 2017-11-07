---
title: '使用 HTML5 接口实现上传进度条'
layout: post
tags:
    - javascript
---

XHR2(XMLHttpRequest level 2) 在 XHR 上做了扩展，使其更强大，严格讲
它不属于 HTML5 ，但却在 HTML5 App 中举足轻重，这里记录一下如何[摒弃
Flash](http://occupyflash.org/)实现上传进度条，其中还会涉及 CORS。

XHR.upload
-----------

XHR 2 新增 upload 属性引用着一个 XMLHttpRequestUpload 对象，可以在
这个对象上添加 progress 事件，来监听上传进度。

var xhr = new XMLHttpRequest();
xhr.upload.onprogress = function (event) {
     if (event.lengthComputable) {
          console.info(event.loaded / event.total);
     }
}

// xhr.open()
// xhr.onload = ...
// xhr.send()

event.lengthComputable 判断是否可以获得文件大小。 event.loaded / .total
分别为已上传大小和总大小。

FormData
--------

监听上传事件后，还需要把本地文件上传到服务器，XHR2 除了上传文本外，
还可以上传多种数据类型(ArrayBuffer, Blob, FormData). 用这三种类型
都可以上传本地文件，但 FormData 最为方便。

var formdata = new FormDate(formElement);
formdata.append('username', 'dexter');
formdata.append('userfile', input.file[0])

如上面的例子，FormData 接受一个 HTMLForm 对象做为可选参数，FormData
会自动添加 Form 内所有字段，除此之外，还可以通过 append() 方法添加
更多字段。字段值可以是文本也可以是 File 对象（通过 input.files 属性
获得）。综合一下上面两段代码。

var xhr = new XMLHttpRequest();
var formdata = new FormData();

xhr.upload.onprogress = function (event) {
     if (event.lengthComputable) {
          console.info(event.loaded / event.total);
     }
}

xhr.open('POST', 'url', true);
xhr.onload = function() {
     console.info(xhr.response)
}

formdata.append('username', 'dexter');
formdata.append('userfile',
     document.querySelector('input[type=file]').files[0])

xhr.send(formdata)

CORS (Cross-Orgin Resource Sharing)
------------------------------------

如果是在同域名下上传，上面的代码就足够了，但很多时候文件都会
上传到单独的服务器上(比如upload.example.com)。这种时候就需要
使用 CORS 协议。有两种 CORS 请求：简单请求和需要预请求的请求
(preflighted request 或者直接称作*非简单请求*).

简单请求与普通的 XHR 请求没有两样，只要服务器返回头部包含
Access-Control-Allow-Orgin: * 或者使用具体的域名替换 * 就
会返回数据，否则浏览器会报跨域错误。

非简单请求会首先发送一个 OPTIONS 请求，等服务器返回并允许后，
再发送真正的请求。OPTIONS 预请求可以缓存，也就是说并不是每次
非简单请求都需要预发送一个 OPTIONS 请求。

哪些情况浏览器会发出简单请求，哪些又会是非简单请求？我搜索
了 HTML ROCKS, W3C specification 和 MDN 上面的教程和规范,
内容上虽然大致相同，但细节并不同，按 MDN 的说法，只要满足以下
两个条件，便发送非简单请求，其他情况发送简单请求：

>*    It uses methods other than GET or POST.  Also, if POST is used to
>     send request data with a Content-Type other than application/x-www-form-urlencoded,
>     multipart/form-data, or text/plain, e.g. if the POST request sends
>     an XML payload to the server using application/xml or text/xml,
>     then the request is preflighted.
>
>*    It sets custom headers in the request (e.g. the request uses a header
>     such as X-PINGOTHER)

换做 W3C 更详细的说法是：如果请求方法是 GET / HEAD / POST ,同时请求
header 内只包含 Accept / Accept-Language / Content-Language /
Content-Type(Content-Type 的值只能为 appplication/x-www-from-urlencoded
,multipart/form-data 或 text/plain)，并且未设置 force preflight
flag 参数。或者已经发送过 preflight 请求并且结果被缓存。以上情况
发送简单请求，否则会先发送 preflight 请求。

但实际情况并不总是这样，比如在 Chrome 中即使满足发送简单请求的
条件，但是 POST 请求中发送了数据，比如 xhr.send('string')
就会触发 preflight 请求。我想不是 Chrome 对 W3C 规范做了优化，
就是我对原规范理解上有错误。不管怎样，如果服务器提供跨域资源，
那么最好支持 preflight 请求，做到万无一失。

一个非简单请求的例子，下面的代码会产生一个非简单请求（因为它
有一个自定义 header 头，并且也发送了数据）。

var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://upload.example.com:8000', true);
xhr.setRequestHeader('custom-header', 'dexbol');
xhr.onload = function() {
     console.info(this.response);
}
xhr.send('xx');

抓包可以看到下面的 HTTP 请求 ：

OPTIONS / HTTP/1.1
Host: upload.example.com:8000
Connection: keep-alive
Access-Control-Request-Method: POST
Origin: http://example.com:8000
User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36
Access-Control-Request-Headers: origin, custom-header, content-type
Accept: */*
Referer: http://example.com:8000/
Accept-Encoding: gzip,deflate,sdch
Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4

其中 `Origin` 表示来源（任何 CORS 请求中都会有这个头，即使是简单请求）。
`Access-Control-Request-Method: POST` 表示浏览器需要发送一个 POST 请求。
`Access-Control-Request-Headers: origin, coustom-header, content-type`
表示实际请求中会带有如下自定义头部。然后服务器返回：

HTTP/1.0 200 OK
Date: Thu, 04 Jul 2013 03:23:04 GMT
Server: WSGIServer/0.1 Python/2.7.3
Access-Control-Allow-Origin: http://example.com:8000
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: origin, custom-header, content-type
Access-Control-Allow-Max-Age: 60
Content-Length: 0

其中 `Access-Control-Allow-Origin` 表示允许请求的域，可以使用通配符 *
表示允许任何域请求资源。`Allow-Control-Allow-Methods` 表示允许实际请求
的类型。`Access-Control-Allow-Headers` 允许实际请求发送的自定义头部。
`Access-Control-Allow-Max-Age` preflight 请求缓存时间，由于每次请求
资源前都预发送 OPTIONS 请求会消耗很多资源，因此浏览器可以把返回
缓存，这样下次就可以直接发送实际请求了，单位为秒，因此这里的过期
时间是一分钟。通过返回可以看到，实际请求使用的 POST 方法，和自定义头
`custom-header`, 以及来源都是被允许的，所以接下来浏览器会发送实际的
请求（否则浏览器会报错并终止接下来的操作）。

POST / HTTP/1.1
Host: upload.example.com:8000
Connection: keep-alive
Content-Length: 2
Origin: http://example.com:8000
User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36
custom-header: dexbol
Content-Type: application/xml
Accept: */*
Referer: http://example.com:8000/
Accept-Encoding: gzip,deflate,sdch
Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4

     xx

返回:

HTTP/1.0 200 OK
Date: Thu, 04 Jul 2013 03:56:39 GMT
Server: WSGIServer/0.1 Python/2.7.3
Content-Type: text/plain
Access-Control-Allow-Origin: *

Congratulation! you got it.

这次我把 `Access-Control-Allow-Origin` 设为通配符，可以看到与
直接设置域名的效果是相同的。到此我们讲都是服务应该实现的逻辑
客户端的 CROS 逻辑主要由浏览器完成，上传进度条的 JS 不用做任
何改动就可以跨域上传了。

Cookie 呢？
-----------

大多数服务器是不允许游客上传文件的，一般需要进行身份验证，最
常用的验证方式就是验证cookie是否合法 ，如果直接使用上面的JS
上传文件，即使用户合法登录也不会成功，因为 CROS 默认是不会发送
cookie 信息的（Authorization header 也不会被发送）。解决办法是
设置 xhr 属性 withCredentials 为 true

     xhr.withCredentilas = true;

只需一条语句前端的任务就完成了，唯一需要注意的是*IE10 中此语句
必须在调用 .open() 方法后执行* 否则会报错。

服务器如果允许接收 cookie 只需添加 `Access-Control-Allow-Credentials: true`
头部信息。但有两点需要注意：

*    如果服务器端需要接收 cookie ， 那么 `Access-Control-Allow-Origin`
     不能为通配符，只能指定具体的域名。如果服务器想接收任何域下的 cookie
     可以从 request header 获得 origin ,并设为它的值

*    不管在 preflighted request 中还是在实际请求中，返回头部都需要包含
     `Access-Control-Allow-Credentials: true`

完整实例
--------

把上面的示例代码整合一下，提供一个完整实例，逻辑很简单：上传一个
文件，服务器会验证 cookie 后返回文件名，上传过程中会更新进度条。
一共两个文件：

*    [index.html](https://gist.github.com/dexbol/5926944#file-index-html)
*    [server.py](https://gist.github.com/dexbol/5926944#file-server-py)

下载上面两个文件，放到同一目录中，然后添加 hosts :

     127.0.0.1 example.com
     127.0.0.1 upload.example.com

打开 cmd.exe 或者 shell , 在当前目录下输入：

     >>python server.py

打开一个现代浏览器，打开控制台，输入地址 exmaple.com:8000 , Good Luck。

Reference
----------

*    <https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest>
*    <https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS>
*    <http://www.html5rocks.com/en/tutorials/cors/>
*    <http://www.html5rocks.com/en/tutorials/file/xhr2/>
*    <http://www.w3.org/TR/cors/>
