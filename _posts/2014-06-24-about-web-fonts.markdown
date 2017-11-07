---
title: '漫谈web字体'
layout: post
tags:
    - web
    - design
---

现在，一款漂亮的字体已经成为一个潮站的标配。但在不久前网站开发者和设计师仅有大约5种字体可以选择，他们需要考虑各个平台默认安装的字体，小心翼翼的挑选合适的字体以及声明顺序。最近我才第一次真正接触到 web 字体，收集了一些有趣的东西。

先看一下目前比较流行的声明字体方案，接下来的内容都围绕着这几行代码展开。

          @font-face {
               font-family: "webfont";
               src: url('webfont.eot');
               src: url('webfont.eot?#iefix') format('embedded-opentype'),
                    url('webfont.woff') format('woff'),
                    url('webfont.ttf') format('truetype'),
                    url('webfont.svg#svnFontName') format('svg');
          }

@font-face 与 EOT 格式
---------------------

之所以把它们放到一起是因为首个实现 `@font-face` 和 EOT 的是同一家公司 - 微软。早在九十年代 CSS 就有了自定义字体的语法，IE4是首个实现此语法的浏览器，没错，就是IE。不过，字体格式只能是微软自己开发的 EOT(Embedded Open Type) 格式。EOT 允许字体的作者保护字体不被非法复制，微软不允许其他浏览器厂商使用该格式，因此它只能在 IE 下使用。

这对当时来说太超前了。还记得在 windows XP 下看使用了『微软雅黑』的网页吗？当时的系统用一种简单的灰阶反锯齿技术，对于系统的字体这足够了，但对于其他字体，由于缺少人工的优化，字体会变得很虚。因此，本来想改进网页的排版效果，结果却使文字都无法阅读。

于是，CSS2.1 中彻底去掉了 `@font-face` 语法也不足为奇了。

Safari 的一小步，浏览器的一大步
------------------------------

大约十年后，在2008年，Safari 3.1 重新支持了 `@font-face` , 并且可以使用最普遍的字体格式 ttf 以及 otf。其实这得益于液晶显示器（LCD）的普及，LCD 提供了更高的分辨率以及通过亚像素渲染(subpixel rending)的反锯齿(anti-aliasing)技术。这样，即使字体很小，也能看得很清楚。

微软称这种技术为 ClearType。在 Mac OS X 平台上 subpixel rending 是默认开启的，但在 windows 平台上只有 windows vista 以及之后的版本才会默认开启。因此回到上面的问题，由于『微软雅黑』不是 XP 的系统字体，XP 默认没有开启 ClearType，因此当在装有『微软雅黑』字体的 XP 上访问将字体设为『微软雅黑』的网页时，看起来会很模糊。不过，手动开启 ClearType 后便可以解决此问题。

一年后，Firefox Opera Chrome 等主流浏览器都开始支持 `@font-face`。

又过了一年，2010年，几乎所有主流浏览器都支持了 `@font-face` , 甚至是 IE，从 IE9 开始微软摒弃了自己的 EOT 字体开始支持 ttf otf 等主流字体格式。在移动端，iOS 从4.2开始也支持这些字体格式。

自此，`@font-face` 死而复生。 web字体时代来临。

truetype woff 以及 svg
----------------------

上面 CSS 声明中使用了 4 种字体格式，其中 EOT 格式前面已经提过，它是 IE 的专有格式，下面看一下余下的 3 种格式。

先说 svg 格式，iOS 在 4.2 之前仅支持 svg 格式的字体，由于 svg 格式不能压缩，通常会比较大，在上面的代码中 `#svnFontName` 可以看做 svg 字体的 ID，当一个 svg 文件包含多个字体时，这个 ID 是必须的，它用来标识特定字体的位置。鉴于 iOS 老版本渐渐被淘汰，因此可以考虑去掉此格式。

truetype(.ttf) 是目前最普遍的字体格式，早在八十年代就被苹果开发出来，当时它作为一种可伸缩的字体格式用来代替位图字体在屏幕上显示，不久微软也接受了这个格式，由于该格式可以针对特定大小做精准的微调，渐渐地成为系统字体的标准。

说到 truetype 不得不提一下 opentype，它在 CSS 中的出镜率也很高。opentype 可以看作是 truetype 的升级版，由微软和 Adobe 联合开发。opentype 采用不同于 truetype 的算法存储路径，单从这点来讲 opentype 有两个主要优势：1.平均比 truetype 小 20% 到 50%。2.需要较少的用于反锯齿的微调信息（详见下面的参考链接）。除此之外，opentype 除基本字符集外还提供了别的扩展，比如小号大写字符，老式的数字，以及其他一些图形。既然 opentype 有这么多优点，那为什么我们上面的代码中没用使用 opentype 呢？首先，[微软](http://windows.microsoft.com/en-us/windows/difference-truetype-postscript-opentype-fonts)建议如果只需要在屏幕上显示文字推荐用 truetype 格式。如果需要更大的字符集和更好的打印效果才推荐 opentype 。其次，支持 opentype 的浏览器都支持 truetype。

最后，也是最新出现的是 woff (web open type format)。woff 属于 W3C 的推荐标准。由两名字体设计师和两位 Mozilla 的开发者设计。最早在 firefox 3.6 上实现。事实上，woff 并不是一种新的字体格式，它只是包装 truetype 和 opentype 并进行压缩，压缩后可以使 truetype 减少 40% 。除此之外，它还允许添加元信息，比如字体作者的许可证，不过浏览器并不对这些许可做任何验证。

?#iefix WTF
-------------

IE9 之前的版本没有按照标准解析字体声明，当 src 属性包含多个 url 时，它无法正确的解析而返回 404 错误，而其他浏览器会自动采用自己适用的 url。因此把仅 IE9 之前支持的 EOT 格式放在第一位，然后在 url 后加上 `?`，这样 IE9 之前的版本会把问号之后的内容当作 url 的参数。至于 `#iefix` 的作用，一是起到了注释的作用，二是可以将 url 参数变为锚点，减少发送给服务器的字符。

为何有两个src
-------------

绝大多数情况下，第一个 `src` 是可以去掉的，除非需要支持 IE9 下的兼容模式。在 IE9 中可以使用 IE7 和 IE8 的模式渲染页面，微软修改了在兼容模式下的 CSS 解析器，导致使用 `?` 的方案失效。由于 CSS 解释器是从下往上解析的，所以在上面添加一个不带问号的 src 属性便可以解决此问题。

parting word
-------------

关于字体的知识可能一本书都说不完。我对很多字体的细节也是浅尝辄止，不过对于在 CSS 中使用 web 字体这篇笔记应该足够了。

参考
----

<http://blog.typekit.com/2010/12/02/the-benefits-of-opentypecff-over-truetype/>
<http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax>
<http://www.creativepro.com/article/what-you-need-know-about-webfonts-part-1>
<http://stackoverflow.com/questions/8050640/how-does-iefix-solve-web-fonts-loading-in-ie6-ie8>
<http://css-tricks.com/snippets/css/using-font-face/>
<http://www.smashingmagazine.com/2011/03/02/the-font-face-rule-revisited-and-useful-tricks/>
<http://www.zeldman.com/2010/11/26/web-type-news-iphone-and-ipad-now-support-truetype-font-embedding-this-is-huge/>
<http://windows.microsoft.com/en-us/windows/difference-truetype-postscript-opentype-fonts#1TC=windows-7>
