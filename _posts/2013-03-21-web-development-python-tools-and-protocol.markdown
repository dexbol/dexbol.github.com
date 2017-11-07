---
title: 'Python Web Development 相关工具和概念'
layout: post
tags:
    - python
---

作为一名 web 新兵或是一名 PHP 开发人员，使用 Python 开发 website 可能面临
很多选择和迷惑。使用 PHP 开发时不仅有 Apache httpd + mod_php 这对极其方便
的组合，还有 [XAMMP](http://www.apachefriends.org/en/index.html) 这种更加
方便的集成环境。可惜在 Python 世界里没有如此方便开发和部署的组合，开始时
必须面对一些古老熟悉或者陌生的概念和工具： CGI FCGI SCGI WSGI mod_wsgi
mod_python flup uwsgi 等。下面简单记录一下这些协议和工具。

CGI
---

Common Gateway Interface 的缩写。CGI描述了 web server 软件与可以生成内容
的可执行文件（CGI script）通讯标准或协议。早期CGI script 以 perl 为主。
目前几乎所有的 web server 软件和脚本语言都支持CGI，所以 CGI 是与具体语言
无关的。当浏览器通过HTTP协议请求一个 CGI 地址时(通常是 /cgi-bin/ 目录
下某文件或者带有某一特定后缀的文件比如 .cgi ，具体规则会根据 web server
的配置），web server 会将相关信息比如 HTTP 头信息，DOCUMENT_ROOT PATH 等
传递给对应的 CGI 脚本 ，CGI接受信息并生成动态内容返回给 web server 最后发送
回浏览器。

Python 的标准库中包含模块 cgi cgitb 可以支持CGI，一个简单的 hello world :

     #! /usr/bin/evn python
     # coding=utf-8

     import cgitb
     cgitb.enable()

     print 'Content-Type: text/plain;charset=utf-8'
     print

     print 'Hello World'

CGI 作为一种最古老的协议有不少缺点，所以它不是首选方案。其中最重要的弊端
就是每遇到一个请求服务器都会开启一个新的进程，开启新进程的过程会消耗很多
资源和时间，尤其是当程序还需要开启解释器或编译时。所以一但频繁请求服务器
很快就会被压垮。

FastCGI(FCGI) SCGI
------------------

FCGI 是为了克服 CGI 的缺点制定的新协议，属于CGI的变种。与 CGI 不同，FCGI
使用一个或多个常驻进程监听请求，而不是每次请求都启用一个新进程。当客户端
发出一个请求后，web server 会把环境信息以及请求信息通过 scoket 链接（或者
TCP 链接）一起发给FCGI 进程，FCGI 处理后再通过相同的链接把结果传回
web server .最后由 web server 返回给最终用户。这时 socket 链接可能会关闭但
是 FCGI 进程和 web server 都不会结束。

SCGI - Simple Common Gateway Interface 与 FastCGI 很类似，本质上就是一个简
化版的 FCGI ，由于 web sever 对 SCGI 的支持有限，因此一般使用 FCGI 代替它。

mod_python mod_perl 等 Apache modlue
-------------------------------------

在 FastCGI 的面世的同时，Aapche 等 web server 用另外一种方式解决了 CGI 的
效率问题。Apache 通过扩展把脚本语言解释器嵌入到了 httpd server 中。于是有了
mod_python 等内嵌解释器的 module。这样就不用每次请求时新建一个进程取而代之的
是通过 web server 内部子进程（带第三方解释器）来处理。需要注意的
是虽然这些 module 的名字像兄弟一样 mod_xxx ，但他们的功能细节是完全不同的，比
如 mod_php 和 mod_python 。所以也不可能像使用 php 那样来使用 python .

这种方案有个瑕疵：Apache 通过启用子进程来处理请求，不幸的是所有的子进程都会加
载解释器而不管是否会使用到它。也就是说即使是处理静态文件(图片 样式表)的子进程也
依然内嵌解释器，这样会占用更多的内存。因此对于大中型 website 一般都是用 nginx
处理静态文件，然后把脚本转给 FastCGI 进程处理，即使是 PHP。

WSGI
----

Web Server Gateway Interface, WSGI 是 web server 与应用程序或框架之间的通用接口，
它定义了 web server 与应用程序之间的通讯规范。WSGI 包括两方面：“服务器”（或
网关）和“应用程序”（或框架）。当“服务器”接收到一个请求时，“服务器”会提供
环境信息以及一个回调函数给“应用程序”，“应用程序”处理请求后，通过“服务器”
提供的回调函数把结果返回。也就是说 WSGI 定义了两方面的 API 。对于普通开发者只
需要了解”应用程序“的 API 即可，或者直接选择一个支持 WSGI 的框架。一个最简单的
WSGI 应用：

     def application(environ, start_response):
          start_response('200 OK', [('Content-Type', 'text/plain')])
          return ['hello world']

其中 environ 就是“WSGI 服务器”提供的环境信息， start_response 就是那个回调函数。
WSGI 最大的好处就是它提供了一个通用的中间层，如果不使用 WSGI，就需要直接面对各种
底层协议进行编码，CGI FCGI SCGI mod_python 等。这样程序的移植性会非常差。如果使用
WSGI，开发人员便不必关心底层使用了什么协议，只要 web server 支持 WSGI 就可以。所以
WSGI 是目前 Python Web 开发的首选。

WSGI Server
-----------

WSGI Server 就是上面提到的 “服务器”。WSGI server 用来连接底层协议（CGI FCGI），
对于 WSGI “应用程序”它充当“服务器”的角色。主流的底层协议或 web 服务器都
有对应的 WSGI Server 或者叫 Wrapper 。比如支持 CGI FCGI SCGI 的
[flup](https://pypi.python.org/pypi/flup/1.0)，直接作为 Apache 模块的
[mod_wsgi](https://code.google.com/p/modwsgi/)，以及[这些](http://www.wsgi.org/en/latest/servers.html)。

uWSGI
-----

它类似 FastCGI 但实现了自己的一套协议 UWSGI 。从名字就可以
看出它支持 WSGI，但不仅如此，它还支持 PHP 等其他语言，目前主流 web server 也
对它有相应的原生支持或扩展。

Reference
---------

*    <http://en.wikipedia.org/wiki/Common_Gateway_Interface>
*    <http://en.wikipedia.org/wiki/FastCGI#cite_note-FastCGI_Specification-1>
*    <http://en.wikipedia.org/wiki/Web_Server_Gateway_Interface>
*    <http://stackoverflow.com/questions/219110/how-python-web-frameworks-wsgi-and-cgi-fit-together>
*    <http://docs.python.org/2/howto/webservers.html>
*    <http://2bits.com/articles/apache-fcgid-acceptable-performance-and-better-resource-utilization.html>
