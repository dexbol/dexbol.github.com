---
title: Python 异步编程
thumb: /ass/img/asynchronous-python.png
---


异步编程在 Python 中越来越流行，目前有很多库提供异步编程的能力，其中影响力最大的当属
asyncio。asyncio 在 Python 3.4 中也正式成为了标准库的一员。
本文会简单介绍这些库，并对比它们的不同。在这之前，先了解一下 Python 中异步编程的历史。

原文:
[Asynchronous Python](https://hackernoon.com/asynchronous-python-45df84b82434)

## 多线程
程序有个故有的特征就是逐行执行，比如，有一行代码请求远程服务器上的资源，
那么整个程序会等远程服务器返回后才继续执行下一行，
在这期间除了等待程序不会做任何事。消除等待时间的标准做法是线程。一个程序可以使用多线程，
每个线程在一个时间点只做一件事儿。多线程就可以让程序同一时间做多件事儿。
但是多线程会让程序更复杂，并带来一些问题，比如：死锁，竞态条件，资源枯竭。

## 上下文切换
异步编程可以避免上述所有问题，事实上，异步编程是为了解决另外一个问题而设计的：
CPU Context Switching，CPU 的上下文切换。当使用多线程时，每个 CPU
内核同一时间依然只能处理一个线程，为了让所有线程共享资源，
CPU 会不定期的保存当前线程的上下文环境，
然后切到下一个线程。CPU 内核频繁地，不定期地在线程之间切换。这个过程也会消耗资源。

异步编程事实上是一个软件（software/userpsace）线程。它是由程序控制何时进行上下文切换，
而不是 CPU 自己。在异步编程世界里，上下文切换只发生在程序定义的点上，而不是由 CPU
不定期切换。

## 勤奋的传达室老王
举例说明多线程与 CPU 上下文切换。假设有个看门儿大爷，人称老王，他是一个非常勤奋的人。
老王每时每刻都在做事情，不浪费任何一秒钟。
老王每天有5件事儿要做：1.代收快递，2.开大门（汽车来了需要开大门儿，平时人走小门儿），
3.烧锅炉，4.接电话，5.练书法。假设今天是周末，单位不忙，只有零星的客人和电话，
天气也不算冷，不用频繁地往炉子里填煤。经常做的就剩下两件事儿：练书法和收快递，
如果有送快递的，老王就放下毛笔，签收一下快递，快递员走后继续练字。
这在现实生活中很容易理解，下面咱们看看多线程版的老王：

在多线程的情况下，老王分身出5个一模一样的老王。每个老王只能干一种事儿，
并且同一时间只能有一个老王可以做事儿。假设有一个装置，它可以控制让哪个老王可以做事儿，
但是它并不知道具体某个老王要做的事儿是什么。于是，这个装置不断的来回切换这5个老王，
虽然其中3个老王几乎无事可做。比如，练书法的老王被终止，然后切到接电话的老王，
但这个时候并没有来电话，接电话的老王无事可做。在这样的切换过程中会浪费很多时间。
对应的，虽然现实中 CPU 的切换速度非常非常的快，但是也会浪费一些资源。

## 绿色线程
绿色线程是一种原始的异步编程方案，它看起来虽然像普通的线程，但是与普通线程不同的是：
绿色线程是由程序调度而不是由系统调度。`Gevent` 就是基于绿色线程实现无堵塞 IO
的 python 框架。使用 `Gevent` 同时请求多个服务器资源的例子：
```python
import gevent.monkey
from urllib.request import urlopen


gevent.monkey.patch_all()
urls = ['http://6.cn', 'http://baidu.com', 'http://dexbol.com']


def print_head(url):
    print('Staring {}'.format(url))
    data = urlopen(url).read()
    print('{}: {} bytes: {}'.format(url, len(data), data))


jobs = [gevent.spawn(print_head, _url) for _url in urls]
```
Gevent 的 API 很像传统线程，但内部却使用运行在事件环（event loop）
上的协同程序（coroutine）实现。这意味着你可以得到轻量进程
（light-weight threading）的好处，但又不需要了解协同程序。
Gevent 适合熟悉线程又想使用
[轻量进程](https://en.wikipedia.org/wiki/Light-weight_process)的程序员。

## 事件环（Event Loop），协同程序（Coroutines），傻傻分不清楚？
事件环是实现异步编程的途径。它是一个事件/任务列队，然后不断的从列队中取出任务执行。
这些任务称作协同程序。它们是一小撮指令，其中还包括需要放回列队的事件。

## 回调式异步编程
另外一个流行的框架是 Tornado ，它使用回调的方式提供无阻塞异步网络 I/O。
回调（callback）是一个函数，意思是「当这件事情处理完后就调用我」，
就好像你打一个繁忙的客服电话时，留下自己的电话号码后立即挂断，
当客服有时间的时候再打给你。而不是一直举着电话等着。
下面是 torando 的例子，与上面 gevent 完成相同功能的代码：
```python
import tornado.ioloop
from tornado.httpclient import AsyncHTTPClient


urls = ['http://6.cn', 'http://baidu.com', 'http://dexbol.com']


def handler_response(response):
    if response.error:
        print('Error: ', response.error)
    else:
        url = response.request.url
        data = reponse.body
        print('{}: {} bytes: {}'.format(url, len(data), data))


http_client = AsyncHTTPClient()
for url in urls:
    http_client.fetch(url, handler_response)
```
简单解释一下这段代码。`AsyncHTTPClient.fetch` 方法可以无阻塞的获取一个 url。
这个方法执行并立即返回，从而让程序可以继续执行而不是等待网络请求返回。
由于方法没有等到网络请求完成就立即返回了，
所以不能通过方法的返回值来获得请求后的资源对象（response），
而是通过回调（handler_response）的方式获得请求结果。

## 回调坑啊
上面的例子，你会注意到回调函数（handler_response）中第一行先判断是否有错误。
之所以这样做是因为回调函数中不能抛出异常。由于回调函数会在事件列队中执行，
因此如果回调函数抛出异常，我们没有对应的代码来处理这个异常。
当调用 `fetch` 方法时会发出一个 http 请求，然后将回调函数放到事件列队中。
如果回调函数中出现了异常，调用栈只有事件列队和回调函数，我们的代码无法捕捉这个错误。
因此只能把错误信息赋值到 response 对象上，而不是直接抛出。
熟悉 golang 的人对这种方式司空见惯，
就好像是语言的强制要求的，同时这也是 golang 最被诟病的一方便。

![callback hell](/ass/img/callback.jpg)

在这种方式下，不想堵塞的唯一方法就是回调。因此你可能会在回调中使用回调，
多个回调嵌套在一起。当你不能访问上下文变量时，只能将需要的上下文信息揉在一个大对象中，
然后传给所有的回调函数，更甚的是如果你用了第三方 API，
除了预先规定的数据，你无法传递任何东西给回调函数。
回调的另外一个问题是：每个回调都像一个线程，但是你无法把他们整合到一起。
比如，你现在需要调用3个 API，然后等3个 API 都有结果后，计算他们的平均值。
使用 Gevent 的话，这很容易实现，但回调却不行。
假如用回调的话，你必须将它们的结果保存在一个全局变量中，
而且在每个回调中判断其他两个是否已经有了结果。

## 对比绿色线程式与回调式
目前你如果想实现非阻塞 I/O，只有多线程和异步编程两种方案，
多线程有我们之前提到的很多问题，包括过于频繁的 CPU 上下文切换。
异步编程也有它固有的问题，下面对比一下 python 中绿色线程式和回调式异步编程的优劣。

### 绿色线程式
- 线程调度由程序控制，而不是系统。
- 看起来像传统多线程，适合已经熟悉多线程的人。
- 除了不用频繁切换 CPU 上下文环境外，依然存在传统多线程带来的其他问题。

### 回调式
- 看起来完全不像线程。
- 程序员不用直接接触线程/协同程序。
- 回调中不能抛出异常。
- 多个回调函数不方便很好的协同工作。
- 多层嵌套的回调函数不容易调试。

## 那应该怎么办呢？
在 python 3.3 之前上面两种异步编程的方式已经式最好的了，
想得到更好的方式就必须需要语言的支持了。
Python 需要某种方式可以先执行函数的某一部分，然后停止，同时可以保存调用栈，
进而可以抛出异常。如果你熟悉 python 一定会想到生成器（Generator）。
生成器可以生成一个列表，但是每次只返回一条项目，直到需要下一条项目前，
它都会暂停执行。但生成器的问题是没有办法用一个生成器产出另外一个生成器，
直到 python 3.3 新增了 `yield from` 语法。
虽然生成器并不是为异步编程而生，但是它具备所有让异步变得更便利的特征：
保存调用栈以及能够抛出异常。如果你能写一个可以执行生成器的事件环，
就能搞出一个不错的异步框架。于是 asyncoio 诞生了。
你只需要给生成器一个装饰符 `@coroutine` ，asyncoio 就可以把生成器包装成协同程序。
请看下面的例子：
```python
import asyncio
import aiohttp

urls = ['http://6.cn', 'http://baidu.com', 'http://dexbol.com']

@asyncio.coroutine
def call_url(url):
    print('Starting {}'.format(url))
    response = yield from aiohttp.get(url)
    data = yield from response.text()
    print('{}: {} bytes: {}'.format(url, len(data), data))
    return data

futures = [call_url(url) for url in urls]
```
需要注意的几件事儿：
1. 我们不用先判断是否有错误消息，因为异常可以沿着正确的调用栈抛出。
2. 我们可以返回一个对象。
3. 我们可以同时启动所有的协同程序，稍后还能将它们整合到一起。
4. 不需要回调。
5. 看起来更像是我们熟悉的同步执行。

这种方式到现在还不错，唯一遗憾可能就是 `yield from` 语法太像一个普通的生成器了。

## Async 和 Await
Asyncio 吸引了大量关注，于是 python 将它加到了标准库，不仅如此，
python 3.5 由此增加了两个新语法 `async` 和 `await` 。
这样可以让协同程序明显的与普通构造器区分出来。
`async` 用在函数定义 `def` 前面，表明这是一个异步函数。
`await` 用来代替 `field from` ，这样可以更明确的表示：这里等待一个协同程序的完成。
使用 `await` `async` 重写一下上面的例子：
```python
import asyncio
import aiohttp

urls = ['http://6.cn', 'http://baidu.com', 'http://dexbol.com']

async def call_url(url):
    print('Starting {}'.format(url))
    response = await aiohttp.get(url)
    data = await response.text()
    print('{}: {} bytes: {}'.format(url, len(data), data))
    return data

futures = [call_url(url) for url in urls]
```

## 这样大家都满足了吧
最终 asyncio 解决了所有这些问题：

- CPU 上下文切换：ayncio 使用事件环，而且允许程序控制上下文切换，
  这方面已经没有系统什么事儿了。

- 竞态条件：由于 ayncio 同一时间只运行一个协同程序，而且只在你定义的地方切换，
  因此也不存在这个问题。

- 死锁：由于不用担心竞态条件，也就没有锁的必要。除非你需要两个协同程序之间相互唤起，
  但这很少见，而且必须避免这样做。

- 资源枯竭：由于协同程序全都跑在一个单线程上，而且不需要额外的套接层或内存，
  因此很难把资源耗尽。不过 asyncio 提供了一个执行池（实际上是一个线程池），
  如果你在执行池中跑了太多工作，还是有可能把资源耗尽的。但这并不经常用，也不建议这样做。

公平地说，虽然 asyncio 已经很牛X了，但是它也有自己的问题。
首先由于它推出时间较短，可能还不太成熟。其次，如果你想用异步编程，
就必须让所有代码都变得异步，因为运行时间长的同步代码会阻塞事件环。
还是因为太新的原因，因此第三方库的支持度也不高。

## 🎉
即便如此，asyncio 依然是最好的选择，当做下一个项目的时候，强烈推荐使用 ayncio。
其实新版 Torando 也很不错。

