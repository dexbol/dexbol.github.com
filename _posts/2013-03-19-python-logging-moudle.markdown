---
title: 'Python Logging Module'
layout: post
tags:
    - python
---

所谓 logging 就是在软件运行期间跟踪记录特定的 events，开发者可以在代码中调用
logging 提供的方法来标识出某个特定 event。这里的 event 被描述为包含一些变量的
消息，也就说根据 event 不同消息中的变量也不同。它的功能远比函数 `print()` 那样
只是在 console 中输出一段信息强大。最重要的是开发人员可以自己控制某 events 是
否被记录，这也被称作等级(level)或者严重度(severity)

何时使用 logging
----------------

logging 提供了一些很方便的函数： `debug(), info(), warning(), error(), critical()`.
需要在特定的情况下分别使用上面的函数：

*    简单向控制台输出一些信息：直接使用 `print()` 函数

*    记录程序中的某个普通操作：`logging.info()` ，如果为了调试而记录还可以使用
     `logging.debug()`

*    发出一个警告：`logging.warning()`

*    发出一个错误信息：使用 `raise` 抛出一个异常

*    记录一个错误信息但不抛出异常： `logging.error()`, `logging.exception()` 或者
     `logging.critical()`

logging 的方法在指定等级或者严重性之后才被定义，默认的等级是 WARNING ，下面按照
等级严重性升序进行说明：

*    DEBUG: 调试时输出感兴趣的详细信息。

*    INFO: 确认代码按照预期执行。

*    WARNING: 指出一些代码没有按照预期执行，但整个程序不受影响。

*    ERROR: 遇到更严重的问题，程序不能执行某些函数。

*    CRITICAL: 非常严重的错误，整个程序可能不能继续执行。

由于默认等级是 WARNING 所以说只有比 WARNING 严重的 events 才会被记录。不过我们可以
修改 logging 的默认等级。有多中方式可以记录 logging 其中就常见的就是输出到控制台
或者写入一个磁盘文件。

例子
----

     import logging
     # will print a message to console
     logging.warning('Watch out!')
     # will not print anything
     logging.info('I told you so')

     # you will see:
     # WARNING:root:Watch out!

由于默认等级是 WARNING 所以 `logging.info()` 并没有打印出来。在打印出来的信息中包括
event 等级以及描述 event 的信息，比如 Watch out! 另外有一个 root ，这个表示在这个
event 发生在程序包的最顶层。

记录到文件
----------

     import logging
     logging.basicConfig(filename='example.log', level=logging.DEBUG)
     logging.debug('This message should go to the log file')
     logging.info('So should this')
     logging.warning('And this, too')

     # your will see in example.log
     # DEBUG:root:This message should go to the log file
     # INFO:root:So should this
     # WARNING:root:And this, too

之所以所有消息都出现在文件中，是因为设置了 `level=logging.DEBUG` 所以所有 DEBUG 等级以上
消息都会出现，也就是所有消息。需要注意的是 `logging.basicConfig()` 必须在其他方法调用之
前调用。而且它就像一个一次性的设置装置一样，只有第一次调用才有效，后续调用将会被忽略。
如果多次运行上面的代码会发现，新的消息会添加到文件尾部，如果想每次运行都清除上次的内容
可以像下面这样修改 filemod

     logging.basicConfig(filename='example.log', filemod='w', level=logging.DEBUG)

在多个模块中记录
---------------

     # myapp.py
     import logging
     import mylib

     def main():
          logging.basicConfig(filename='myapp.log', level=logging.INFO)
          logging.info('Started')
          mylib.do_something()
          logging.info('Finished')

     if __name__ == '__main__':
          main()


     # mylib.py
     import logging

     def do_something():
          logging.info('Doing something')

     # you will see
     # INFO:root:Started
     # INFO:root:Doing something
     # INFO:root:Finished

结果跟预想的一样，不过上面的例子中，通过查看 log 信息无法得知信息来自哪个文件的。
有两个方案来解决这个问题：

*    使用 logger 对象。logger 是logging模块中提供的一个类，其实 logging 上记录 log
     的函数是通过调用 logger 的实例方法来实现的。每个 logger 对象都一个名字,
     logger 的名字是由点号隔开的字符串，从而表示一个多级的命名空间。比如一个 logger
     的名字是 scan 那么它就是名字为 scan.text scan.pdf 的父对象。按照惯例一般使用
     `__name__` 作为 logger 的名字： `logger = logging.getLogger(__name__)` 这样相当于
     使 logger 名字具有 package/module 的层级。例子：

          # myapp.py
     import logging
     from xx import mylib
     def main():
          logging.basicConfig(filename='myapp.log', level=logging.INFO, filemode='w')
          logger = logging.getLogger(__name__)
          logger.info('Started')
          mylib.do_something()
          logger.info('Finished')

     if __name__ == '__main__':
          main()

     # xx/mylib.py
     import logging
     def do_something():
          logger = logging.getLogger(__name__)
          logger.info('Doing something')
     # in myapp.log
     # INFO:__main__:Started
     # INFO:xx.mylib:Doing something
     # INFO:__main__:Fin


*    使用 `LogRecord` 的属性 `pathname`。

# myapp.py
import logging
from xx import mylib
def main():
     logging.basicConfig(filename='myapp.log', level=logging.INFO, filemode='w', format='%(levelname)s:%(name)s:%(pathname)s:%(message)s')
     logging.info('Started')
     mylib.do_something()
     logging.info('Finished')
if __name__ == '__main__':
     main()

# xx/mylib.py
import logging
def do_something():
     logging.info('Doing something')
# in myapp.log
# INFO:root:myapp.py:Started
# INFO:root:C:\Users\dexbol\Desktop\tt\xx\mylib.py:Doing something
# INFO:root:myapp.py:Finished

修改消息显示格式
----------------

可以使用 format 属性来定义消息格式，比如：

     import logging
     logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)
     logging.debug('This message should appear on the console')
     logging.info('So should this')
     logging.warning('And this, too')

     # will show
     # DEBUG:This message should appear on the console
     # INFO:So should this
     # WARNING:And this, too

levelname message 这些为 LogRecord 的属性，除了这些外还有：

*    %(asctime)s log 时间，一般以这种方式出现： 2012-1-1 12:12:12,890 逗号后面
     为毫秒数
*    %(created)f log 时间戳，浮点型。
*    %(filename)s %(pathname)s 的文件名部分
*    %(funcName)s 调用logging时所在的函数名
*    %(levelname)s 等级
*    %(levelno)d 等级对应的数字
*    %(module)s 模块名
*    %(msecs)d log 时间的毫秒部分
*    %(message)s 消息
*    %(name)s logger name
*    %(pathname)s 调用logging时所在源码的全路径
*    %(process)d 进程id
*    %(processName)s 进程名称
*    %(relativeCreated)d 从模块加载到记录log的毫秒数
*    %(thread)d 线程id
*    %(threadName) 进程名称

此外还有 args 与 exc_info 不过这两个属性不需要格式化

修改时间显示格式
----------------

首先需要设置 format，使得 format 中包含 %(asctime)s .默认下 asctime 这样显示：
2012-1-1 12:12:12,890 如果要格式这个日期需要设置另外一个属性 datefmt 想这样：

     import logging
     logging.basicConfig(format='%(asctime)s : %(message)', datefmt='%m/%d/%Y')
     logging.warning('is when this event was logged.')

     # will show
     # 12/12/12 is when this event was logged

Reference
---------

*    <http://docs.python.org/2/howto/logging.html>
