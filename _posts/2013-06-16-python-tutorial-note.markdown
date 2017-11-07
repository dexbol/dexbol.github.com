---
title: '「Python基础教程」笔记'
layout: post
tags:
    - python
---

我的 Python 入门书籍。第一次看本书时有些不习惯。以往的经验，一本
牛逼的书像 XXX权威指南之类的肯定会从语言本身数据类型讲起，并且层
次分明，按部就班内容详细。但此书却不走寻常路。读第一遍时觉得很乱
，等有一些实际编码经验后，再读此书觉得其实它的内容很详实，不输于
XXX权威指南。

很松散的记录一下我再次读本书时比较有用而又易忘的知识点（对我来说）。

*    repr() 返回值的字符串表达形式，调试打印信息很实用。

*    两个相邻字符串会自动拼接 （一个或多个空格隔开）。

*    反斜杠不仅可以转义换行来支持多行字符串，还支持表达式和语句。

*    assert 断言，if 的近亲，如果条件不为真会终止程序产生 AssertionError

*    条件表达式 a if b else c

*    callable 用来判断函数是否能被调用，python 3 中取消 callable ,
     用 hasattr(object, '__call__')代替。

*    函数参数反转过程，函数这样收集参数：

     def foo(*args, **kwargs):
          print args
          print kwargs

     foo(1, 2, 3, a='a', b='b')
     # (1,2,3)
     # {"a":"a","b":"b"}

     反转过程如下：

     def foo(x, y, z, m=0, n=1):
          print x,yz,m,n
     foo(*('x','y','z'), **{"m":"M","n":"M"})

     # x y z M N

*    globals() 返回全局变量字典，vars([object]) 返回 module class
     instance 或者其他对象的 __dict__ 属性。locals() 返回局部变量字典。

*    类的定义其实就是执行代码 - 在类的命名空间内执行，instance.method()
     相当于 Class.method(instance) 相同。

*    __bases__ 属性引用父类，issubclass() 检查是否是子类，isinstance()
     是否是某类的实例。实例的 __class__ 属性指向他的类。

*    调用超类构造方法的两个途径：调用超类方法的未绑定版本
     Class.__init__(self) . 使用 super 函数。super(Class, self).__init__()

*    属性(property) - 通过访问器访问的特征(attribute)称为属性.
     通过 property() 函数创造属性.

class Foo(object):

     def __init__(self):
          self._name = ''

     def getName(self):
          print 'get'
          return self._name

     def setName(self, name):
          print 'set'
          self._name = name

     name = property(getName, setName)

foo = Foo()

foo.name = 'xx'
print foo.name

# set
# get
# xx

*    静态方法和类成员方法 - staticmethod() classmethod()

class Foo(object):

     @staticmethod
     def say():
          print 'say'

     @classmethod
     def saywithcls(cls):
          print 'say: ' + repr(cls)

Foo.say()
Foo.saywithcls()

# say
# say: <class '__main__.Foo'>

*    一个实现了 __iter__ 方法的对象是可迭代的，一个实现了 next 方法的对象则是迭代器。
     一个自定义的可迭代的fibs数列对象：

class Fibs(object):

     def __init__(self):
          self.a = 0
          self.b = 1

     def next(self):
          self.a, self.b = self.b, self.a + self.b
          if self.a > 10:
               raise StopIteration
          return self.a

     def __iter__(self):
          return self

fibs = Fibs()

for num in fibs:
     print num

*    生成器是一种普通函数定义的迭代器，任何包含 yeild 语句的函数都是生成器。

生成器是一个包含 yield 关键字的函数。当它被调用时，在函数体内的代码不
会被执行，而是会返回一个迭代器。每次请求一个值，就会执行生成器的代码，
知道遇到一个 yield 或者 return 语句。yield 语句意味着应该生成一个值，
而 return 意味着生成器停止执行，不在生成任何东西。

     换句话说生成器由两部分组成：生成器函数和它返回的迭代器。

*    路径配置文件以 .pth 为扩展名，将配置文件放到 site-packages 目录下便可
     生效。这样可以更加方便的管理 package. 不会让 site-packages 下零散文件太多。

*    module.__all__ 可以很方便的查看模块下的主要内容。

*    module.__file__ 返回模块文件所在路径。

*    os.environ 映射包含操作系统的环境变量。

*    open() 函数的二进制模式 b 的作用是可以原样的给出内容，否则会根据不同平台
     转换换行符。

*    使用 with 语句操作文件，避免文件无法关闭造成资源浪费。Python 中的 with
     语句与 JavaScript 中的类似，是一个上下文管理器。

*    文件对象是可迭代的迭代器。

*    低于1024的端口号都属于标准服务。

*    When in doubt, use brute force - Ken Thompson
