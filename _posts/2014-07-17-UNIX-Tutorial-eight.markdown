---
title: 'UNIX / Linux 新手入门（八）'
layout: post
tags:
    - unix
---

8.1 UNIX 变量
--------------

当运行命令解析器（shell）和程序时，变量是从 shell 传递信息到程序的一种途径。程序在『特定环境』下查找特定的变量如果找到了就可以使用存储在变量内的值。有些变量是由系统设置的，有些是由用户设置的，shell 或者任何加载了其他程序的程序也会设置一些。

标准的 UNIX 变量分为两类，环境变量和 shell 变量。笼统地讲，shell 变量只作用于当前 shell 实例而且常用于设置短期活动的环境；环境变量有更长远的意义，它们在登录时设置而且在登录后整个会话期间都有效。按照惯例，环境变量名使用大写字母，shell 变量名使用小写字母。

8.2 环境变量
-------------

OSTYPE 是环境变量的一个例子，它的值是你正在使用的系统名称。键入：

          % echo %OSTYPE

除此之外，其它一些环境变量的例子：

*    USER - 登录的用户名。
*    HOME - 私人目录路径。
*    HOST - 机器名称。
*    ARCH - 处理器构架。
*    DISPLAY - 显示器名称。
*    PRINTER - 默认打印机。
*    PATH - shell 查找命令的目录。

### 查找变量的值

环境变量使用 setenv 命令设置，显示使用 printenv 或者 env 命令，使用 unsetenv 命令取消设置。显示所有变量的值，键入：

          % printenv | less

8.3 shell 变量
---------------

history 是 shell 变量的一个例子。它的值为保存历史命令的数量，保存历史命令可以使用户能够回滚到任何之前输入过的命令。键入：

          % echo $history

更多 shell 变量的例子：

*    cwd - 当前工作目录。
*    home - 私人目录路径。
*    path - shell 查找命令的目录。
*    prompt - 当前登录 shell 的提示符。

### 查找变量的值

shell 变量使用 set 命令设置和显示变量的值。使用 unset 命令可以取消设置。查看所有这些变量的值可以键入：

          % set | less

### 那么 path 和 PATH 有什么区别

一般来说，名字相同（大小写不同）的环境变量和 shell 变量是不同且彼此独立的，不过他们可能会有相同的初始值。但是也有一些例外。

每当修改 shell 变量的 home, user 和 term 时，对应的环境变量 HOME, USER 和 TERM 会接收相同的值。然而，修改环境变量并不会影响到 shell 变量。

path 和 PATH 指定搜索命令和程序的目录。它们总是显示相同的目录列表，而且修改一个会自动引发另外一个做同步修改。

8.4 使用和设置变量
-------------------

每次登录到 UNIX 主机，系统都会在你的私人目录中查找初始化文件。这些文件中的信息用于设置你的工作环境。C 和 TC shell 使用名为 .login 和 .cshrc 的两个文件（注意文件名都以点号开头）。

当登录时 C shell 先读 .cshrc 然后是 .login 。

*    .login 用于设置作用于整个会话的环境而且只在登录时执行操作。
*    .cshrc 用于设置环境变量，针对 shell 执行操作并且每次调用 shell 时都执行。

建议在 .login 文件中设置环境变量，在 .cshrc 文件中设置 shell 变量。

警告：永远不要在这两个文件中放置图形命令（比如一个 web 浏览器）。

8.5 在 .cshrc 文件中设置 shell 变量
------------------------------------

举个例子，为了修改保存历史命令的数量，你需要设置 shell 变量 history 。它默认值为 100 你可以随意增加它的值：

          % set history = 200

检查是否成功，键入：

          % echo $history

然而，这仅在当前 shell 中有效。如果你打开一个新的终端窗口，它还只是默认值。为了『永久』设置它的值，你需要在 .cshrc 文件中添加 set 命令。

首先用文本编辑器打开 .cshrc 文件，比如用简单易用的 nedit 编辑器。

          % nedit ~/.cshrc

将下面这行添加到其他命令后。

          set history = 200

保存文件并使用 source 命令强制使 shell 重新读取 .cshrc 文件。

          % source .cshrc

检查它是否其作用键入：

          % echo $history

8.6 设置 path
--------------

当你键入一个命令时，shell 会在 path（或者 PATH）定义的目录中寻找这个命令。如果系统返回 "command: Command not found" 说明这个命令在系统中根本不存在，或者它只是不在 path 变量指定的目录中。

举个例子，运行 units 命令，你可以直接指定它的路径（~/units174/bin/units），或者将目录 ~/units174/bin 添加到变量 path 中。

你可以调用下面的命令将它添加到已有 path 的末端：

          % set path = ($path ~/units174/bin)

测试是否起作用，可以在 units 所在目录以外任何目录下运行 units 命令。

          % cd
          % units

为了『永久』设置 path ，将下面这行添加到 .cshrc 文件的底部。

          set path = ($path ~/units174/bin)

原文
----

<http://www.ee.surrey.ac.uk/Teaching/Unix/unix8.html>

-- 本系列完
