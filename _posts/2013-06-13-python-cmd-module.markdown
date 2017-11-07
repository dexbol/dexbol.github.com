---
title: 'Python cmd module'
layout: post
tags:
    - python
---

cmd 是一个用于命令行交互的框架。cmd 内包含一个基类 Cmd ,你需
要在它的基础上扩展自己的类，只实例化 Cmd 并不能完成实质性的工作。

*Cmd.cmdloop([intro])*

不断地提示用户输入，直到满足一定条件。方法会自动解析用户输入，将首个单词
作为命令，余下的部分当作参数。假如用户输入了命令 `foo` ,如果对象中定义了
do_foo 的方法，该方法就会被调用。

from cmd import Cmd

class MyCmd(Cmd):

     def do_foo(self, *args):
          print 'arguments is ' + repr(args)
          # do something
          return True

mycmd = MyCmd()
mycmd.cmdloop()

上面的例子，如果用户输入 `foo args` 将打印出 `arguments is ('args',)`
`return True` 表明命令执行完成，不再继续提示输入，否则会持续提示输入
直到用户关闭窗口。

Cmd 对象支持用户在命令开头加入 ! 或者 ? 来改变行为。

如果命令以 ! 开头，Cmd 对象会将输入分配给 do_shell() 方法（如果定义了该方法）。

from cmd import Cmd

class MyCmd(Cmd):

     def do_foo(self, *args):
          print 'arguments is ' + repr(args)
          # do something
          return True

     def do_shell(self, line):
          print 'with exclamation mark: ' + line
          return True

mycmd = MyCmd()
mycmd.cmdloop()

上面的代码如果用户输入 ! 后加任何字符，都会调用 `do_shell()` 方法，即使
是 `!foo` , 同时 `do_foo()` 方法会被屏蔽而不被调用。

如果用户命令以 ? 开头，那么 Cmd 对象会调用 `do_help()` 方法，`do_help()`
方法从 Cmd 中继承，一般不需要重写。如果用户输入了 `?foo` ,`do_help()`
会先调用 `help_foo()` 方法，如果 `help_foo()` 未定义，它会输出 `do_foo()`
的 docstrings, 如果`do_foo()` 也没有定义，`do_help()`会列出所有可能的帮
助主题。

回到第一个例子，如果用户输入 `foo` 以外的命令会报错，默认的提示是：
`*** Unknow syntax: command`，比如你输入 'bar' ,会提示 `*** Unknow
syntax: bar`. 可以通过重新 `default()` 方法改变这个提示。

*Cmd.default(line)*

在第一个例子的基础上修改一下：

from cmd import Cmd

class MyCmd(Cmd):

     def do_foo(self, *args):
          print 'arguments is ' + repr(args)
          # do something

     def default(self, line):
          print 'error: ' + line

mycmd = MyCmd()
mycmd.cmdloop()

这样如果你输入 `bar` 则会提示 `error: bar`.

如果你需要用户输入的不是一个特定的命令，而是一些不固定的字符（甚至没有字符），
比如需要用户输入用逗号隔开的数字做选择，这时就无法用过 `do_*()` 来处理了。
Cmd 提供了几个 hook 函数可以处理这种情况。

*Cmd.emptyline()*

用户输入为空时调用。

*Cmd.precmd(line)*

`precmd()` 在用户输入后，输入被分配之前调用。它的返回值会传给 `onecmd()`
方法。

from cmd import Cmd

class MyCmd(Cmd):

     def do_yes(self, *args):
          print 'yes, you do.'
          return True

     def precmd(self, line):
          if line == 'yep':
               return 'yes'
          else:
               return line

mycmd = MyCmd()
mycmd.cmdloop()

执行上面的代码，用户输入 yep 和 yes 会产生同样的效果。

*Cmd.postcmd(stop, line)*

`postcmd()` 在输入被分配之后调用，`line` 为用户输入（`precmd()` 的返回，因此不一定
是用户最初的输入）。 `stop` 用来标识是否需要终止提示输入（这个值其实是 `onecmd()`
的返回值）。此方法的返回值最终会决定提示是否结束，如果返回 False 会继续提示用户
输入。

*Cmd.onecmd()*

前面两个方法中都提到了 `onecmd()`, 因为它起到承上启下的作用，它接受 `precmd()` 的
返回作为参数，处理完后，将返回值作为 `stop` 参数传给 `postcmd()` 方法。将用户输入
解析并分配给相应 `do_*()` 方法的过程其实就是在这个方法中进行。

*Cmd.preloop()* / *Cmd.postloop()*

这两个无需多说，在 `loopcmd()` 调用之前和之后调用。

*Cmd.prompt*

从上面的例子可以看到，在用户输入前都有一个 `(Cmd)` , 可以通过修改 `prompt` 属性
修改成更优雅的提示，比如 'Please Type: '。

from cmd import Cmd

class MyCmd(Cmd):

     prompt = 'Please Type 1: '

     def default(self, line):
          return ''

     def postcmd(self, stop, line):
          if line == '1':
               print 'Thanks'
               return True
          return False

mycmd = MyCmd()
mycmd.cmdloop();

除了以上主要方法，cmd 还有一些属性和方法用于 Unix 下特有特征。详见 Referrence

Referrence
----------

*    http://docs.python.org/2/library/cmd.html

