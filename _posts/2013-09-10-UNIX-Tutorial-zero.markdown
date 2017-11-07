---
title: 'UNIX / Linux 新手入门（零）'
layout: post
tags:
    - unix
---

什么是 UNIX
-------------------

UNIX 是一个操作系统，在60年代就被开发出来，并不断发展到现在。操作系统
是指一套让计算机工作起来的程序。UNIX 系统稳定，支持多用户，多任务，常
用在服务器，桌面电脑和笔记本电脑上。

UNIX的种类
------------------

现存很多种UNIX，虽然他们大致相同，目前最流行的几种 UNIX 有：Sun
Solaris, GNU/Linux 和 MacOS X。

在咱学校里(University Of Surrey)，我们在工作站和服务器上使用 Solaris,
在另一些服务器和桌面电脑上使用 Fedora Linux。

UNIX 操作系统
---------------------

UNIX操作系统由三部分组成：内核(kernel), shell 以及程序。

### 内核 ###

UNIX 的内核是操作系统的中心，内核常住内存待系统调用后可以调用文件存储器和处理通讯。

这种设计是为了可以让内核与 shell 共同工作。打个比方，比如用户在 shell
中输入 `rm myfile` (删除 myfile 文件)。shell 会在文件存储器中搜索包含程序
`rm` 的文件，然后通过系统调用请求内核在 myfile 上执行程序 `rm`。执行
完毕后，shell 会返回提示`%`给用户，表示等待用户输入新的命令。

### Shell ###

Shell 扮演着用户与内核之间接口的角色。当用户登录时，登录程序会检查用
户名和密码，然后启用另外一个程序调用 Shell 。Shell 是一个命令行解释器
(Command Line Interpreter CLI)。它会解析用户输入的命令并安排执行它们。
当一个命令结束，Shell会给用户另外一个提示（等待用户输入新的命令）。

熟练的用户可以配置他们自己的 Shell，而且用户还可以在同一台机器上使用
不同的 Shell。咱学校（University Of Surrey）默认使用 tcsh shell。

tcsh shell 有两个主要的特征帮助用户输入命令：

*    文件名自动补全 - 键入部分文件名，命令，目录名然后按 Tab 建，shell
     会自动补全余下的部分。如果 shell 找到多个以用户键入字母开头的文件/
     目录/命令，当用户按 Tab 时，shell 就会提示用户输入更多的字母后再
     按 Tab。

*    历史记录 - shell 会保存一个用户输入过命令的列表，当用户需要重复输入
     时，可以通过按上下光标键查看键入过的命令，或者通过键入命令`history
     `查看整个列表。

文件和进程
-----------------

在 UNIX 里一切都是文件(files)或进程(processes)。

一个进程是一个正在执行中的程序，每个进程都有一个唯一的PID (process
identifier)。

一个文件就是一个数据集合。它们由用户用文本编辑器创建，或者由编译器直
接生成。

下面这些都是文件：

*    一个文档（报告，散文等）。
*    一个用高级编程语言编写的程序文件。
*    机器可以直接读懂而用户不能的文件，比如二进制文件，可执行文件。
*    一个包含自身内容信息的目录，这个目录内可能混合了普通文件和其他
     子目录。

目录结构
-------------

所有的文件都集合在一个目录结构中，文件系统是一个层级结构，就像一颗
倒过来的树。在层级的最顶端通常称作根目录(root)，记作 `/`

![directory image](http://www.ee.surrey.ac.uk/Teaching/Unix/media/unix-tree.png)

从上图中我们可以看到目录 `ee51vn` 中包含2个子目录（`pics` 和 `docs`）
以及一个普通文件 `report.doc`

`report.doc` 的绝对路径(full path)是 `/home/its/ug1/ee51vn/report.doc`

开启一个 UNIX 终端 (UNIX Terminal)
------------------------------------------------------

通过菜单 Applications/Accessories 可以打开一个 UNIX 终端窗口

![Terminal In Menu](http://www.ee.surrey.ac.uk/Teaching/Unix/media/gnome-window.gif)

然后终端窗口会出现一个百分号的提示，等待用户输入命令。

![Terminal Window](http://www.ee.surrey.ac.uk/Teaching/Unix/media/unix-xterm0.gif)

原文
------

<http://www.ee.surrey.ac.uk/Teaching/Unix/unixintro.html >
