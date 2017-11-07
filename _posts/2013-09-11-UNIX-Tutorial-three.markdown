---
title: 'UNIX / Linux 新手入门（三）'
layout: post
tags:
    - unix
---

3.1 重定向
-----------

大多数 UNIX 命令初始化进程都写入到*标准输出*中（即终端显示屏），而且他们
大多数会从*标准输入*获得输入（即从键盘输入获得）。这还有一个供进程写入错
误信息的*标准错误输出*（默认输出到终端屏幕上）。

我们已经见过 `cat` 的一种用法：显示文件内容。下面键入 `cat` 不带任何文件。

     % cat

然后随便敲点字儿后按回车。最后键入 Ctrl + D (以后简写为 `^D`)。发生了什么
呢？如果不提供文件给 `cat` ，他会从标准输入（键盘输入）中读取内容，当收到
“文件结束(^D)”时复制标准输入到标准输出（终端显示屏）。

在 UNIX 中我们即可以重定向命令的输入还可以重定向输出。

3.2 重定向输出
--------------

我们可以使用符号 `>` 将命令的输出重定向。举个例子，创建一个名为 list1 的
文件，文件内包含一个水果列表，键入：

     % cat > list1

然后键入一些水果的名字，每键入一个水果名后都要按回车。

     pear
     banana
     apple
     ^D {means Ctrl + D}

这个过程是这样的： `cat` 从标准输入中读取内容，然后 `>` 将本应该输出到标准
输出的内容重定向到文件 list1. 现在读取文件 list1 :

     % cat list1

### 练习 3a  ###

用上面的方法创建文件 list2 ,包含下列水果： orange, plum, grapefruit. 然
后看看 list2 的内容

### 3.2.1 向文件中追加内容 ###

使用 `>>` 可以把标准输出追加到文件中。因此现在可以向 list1 中添加更多的
水果：

     % cat >> list1

然后键入：

     peach
     grape
     orange
     ^D

看看加上了没，键入：

     % cat list1

你现在应该有2个文件了(list1, list2)，一个里面有6个水果另一个有4个。现在
我们可以使用 `cat` 命令把它们拼接起来组成一个新文件 biglist。键入:

     % cat list1 list2 > biglist

上面的代码依次读取 list1 list2 的内容然后输出到 biglist 内。 看看 biglist
吧：

     % cat biglist

3.3 重定向输入
---------------

使用 `<` 重定向命令的输入。`sort` 命令可以按字母顺序或数字排列列表。键入：

     % sort

然后键入一些动物名，每个动物名后按回车。

     dog
     cat
     bird
     ape
     ^D

会得到这样的输出：

     ape
     bird
     cat
     dog

使用 `<` 可以将标准输入（键盘输入）重定向到文件。下面排列一下水果列表：

     % sort < biglist

排列后的列表会显示在屏幕上，也可以把结果保存到文件中：

     % sort < biglist > slist

看看 slist 里有什么吧。

3.4 通道
---------

看看除了你谁还登录了此系统：

     % who

一个获得按用户名排序列表的方法：

     % who > names.txt
     % sort < names.txt

这个方法微慢，而且你需要记得删除临时用的文件（names.txt）。实际上，你真
正需要是直接连接 `who` 的输出与 `sort` 的输入，准确的说你需要一个通道。
通道的符号是一个竖杠 `|`。举个例子：

     % who | sort

上面的命令可以得到相同的结果，而且更快更清晰。现在看看一共有多少
个人登录：

     % who | wc -l

### 练习 3b ###

使用通道显示 list1 和 list2 中所有包含字符 p 的行，而且对结果进行排序。

答案：

     % cat list1 list2 | grep p | sort

总结
-----

*    command > file - 标准输出转到文件。

*    command >> file - 标准输出追加到文件。

*    command < file - 标准输入转到文件。

*    command1 | command2 - 使用管道将 command1 的输出传送给 command2 的
     输入。

*    cat file1 file2 > file0 - 连接 file1 与 file2 到 file0。

*    sort - 排序。

*    who - 列出当前已登录的用户。

原文
----

<http://www.ee.surrey.ac.uk/Teaching/Unix/unix3.html>
