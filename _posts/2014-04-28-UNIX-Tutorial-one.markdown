---
title: 'UNIX / Linux 新手入门（一）'
layout: post
tags:
    - unix
---

1.1 列出文件和目录
-----------------------------

### ls (list) ###

当你第一次登录时，你的当前目录为私人目录(home directory)，目录名称与你的
用户名相同，比如 ee91ab, 私人目录是保存你私人文件与文件夹的地方。

想看看你的私人目录里都有什么，可以键入：

     % ls

`ls` 命令会列出你当前目录中内的内容。

![ls](http://www.ee.surrey.ac.uk/Teaching/Unix/media/unix-xterm1.gif)

这里可能显示不出任何文件，直接返回提示。也可能存在一些系统管理员创建
用户时生成的文件。

事实上 `ls` 并不会列出你私人目录中的所有内容，它只会列出不以点号开头的文件
和目录。以点号开头的文件被认为是隐藏文件，通常保存着重要的程序配置信息。
之所以隐藏他们是因为不推荐你去更改里面的内容，除非你对 UNIX 极其了解。

想要列出所有的内容可以键入：

     % ls -a

可以看到，`ls -a` 列出了隐藏文件。

![ls -a](http://www.ee.surrey.ac.uk/Teaching/Unix/media/unix-xterm2.gif)

命令 'ls' 与参数 `-a` 是一个很好例子来说明参数如何改变命令的行为。通过在线手
册可以详细的了解某一命令有哪些参数，以及每个参数如何改变命令的行为。

1.2 创建目录
-------------------

### mkdir (make directory) ###

现在我们在你的私人目录下创建一个子目录来存放课程相关的文件。在当前目录
下创建一个名为 `unixstuff` 的子目录键入下面的命令：

     % mkdir unixstuff

查看你刚刚建立的目录：

     % ls

1.3 改变当前目录
-------------------------

### cd (change direcotry) ###

`cd directory` 命令将当前目录改成 `directory`目录。所谓当前目录可以看做是
当前你所处在的目录，也就是你当前在文件系统中的位置。

将当前目录改为你刚刚建立的目录：

     % cd unixstuff

键入 `ls` 看看里面的内容（里面应该是空的，什么都没有）。

### 练习 1a ###

在 unixstuff 中创建子目录 backups。

1.4 目录 . 以及 ..
--------------------------

同样在 unixstuff 目录，键入：

     % ls -a

如你所见，在 unixstuff 目录（以及其他所有目录）都包含两个特殊的目录：. 和 ..

### 当前目录 . ###

在 UNIX 中 `.` 表示当前目录，因此：

     % cd .

其实哪也没去，还在当前目录(unixstuff 目录)。起初你会觉得这没什么用，但是用`.`
表示当前目录可以省去很多输入，以后你将看到它的好处。

### 父目录 .. ###

`..` 表示当前目录的父目录，因此键入：

     % cd ..

将把你带入上一级目录（你的私人目录）。

*提示*：`cd` 后不带任何参数可以把你带回你的私人目录，当你在文件系统中迷路时
这很有用。

1.5 路径名称
------------------

### pwd (print working directory) ###

路径名可以得出相对于整个文件系统你所处的位置。比如找到你的私人目录的绝对路
径可以键入 `cd` 回到你的私人目录，然后键入：

     % pwd

显示出的完整路径会像下面这样：

     /home/ites/ug1/ee51vn

意思是：ee51vn(你的私人目录)在 ug1 里，依次向上 ug1 在目录 ites 中，ites 在
home 中，home 在根目录中。

![home directory full path](http://www.ee.surrey.ac.uk/Teaching/Unix/media/unix-tree.png)

### 练习 1b ###

使用 `cd`, `ls` 和 `pwd` 浏览文件系统。记住，当你找不着北时单独使用 `cd` 可以
回到私人目录。

1.6 关于私人目录与路径名的更多内容
-------------------------------------------------------

### 理解路径名 ###

首先键入 `cd` 回到私人目录，然后键入：

     % ls unixstuff

列出 unixstuff 目录中的内容。现在键入：

     % ls backups

你将看到类似这样的提示：

     backups: No such file or directory

 这是因为 backups 并没有在你的当前目录内。如果需要将命令执行在没有在当前
目录的文件，需要首先 `cd` 到正确的目录，或者使用文件的绝对路行。因此你必须
这样键入：

     % ls unixstuff/backups

### ~ (你的私人目录) ###

私人目录还可以用波浪号 ~ 表示，它可以用来指定始于你私人目录的路径。因此：

     % ls ~/unixstuff

无论你的当前目录在哪，都可以列出 unixstuff 内容。

你觉得 `ls ~` 能列出什么？`ls ~/..` 呢？

总结
-------

*    `ls` - 列出文件和目录。

*    `ls -a` -  列出所有文件和目录。

*    `mkdir` -  创建一个目录。

*    `cd directory` - 改变目录到 directory。

*    `cd` - 回到私人目录。

*    `cd ~` - 同上。

*    `cd ..` - 到上一级目录。

*    `pwd` - 显示当前目录。

原文
----

<http://www.ee.surrey.ac.uk/Teaching/Unix/unix1.html>
