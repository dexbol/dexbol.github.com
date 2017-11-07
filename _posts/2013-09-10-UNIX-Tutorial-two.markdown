---
title: 'UNIX / Linux 新手入门（二）'
layout: post
tags:
    - unix
---

2.1 复制文件
------------

### cp (copy) ###

`cp file1 file2` 可以将文件 `file1` 复制到当前目录下并命名为 `file2`。
现在我们要找一个可以公开访问的文件，并用 `cp` 命令把它复制到 `unixstuff` 目
录下。首先 `cd` 到 unixstuff 目录：

     % cd ~/unixstuff

然后键入：

     % cp /vol/examples/tutorial/science.txt .

*注意*不要忘记后面的点号，这个点号表示当前目录。

上面的命令可以把文件 `science.txt` 复制到当前目录，名字保持不变。

*提示* `/vol/examples/tutorial` 这个目录在学校里每个人都可以访问和复制。
如果你不在可以从
[这里](http://www.ee.surrey.ac.uk/Teaching/Unix/science.txt)
下载。后面的例子中还会用它。

### 练习 2a ###

通过复制文件将 `science.txt` 备份到 `science.bak`。

2.2 移动文件
-------------

### mv (move) ###

`mv file1 file2` 可以将 `file1` 移动到（重命名为）`file2`

此命令是移动文件而不是复制文件，因此始终只会存留一个文件而不是两个。

通过在同一目录中移动文件，但提供不同的文件名可以用来重命名文件。

现在我们把 `science.bak` 移动到 `backups` 目录下。首先 `cd` 到 `unixstuff`
目录（还记得怎么搞吧）。然后键入：

     % mv science.bak backups/.

键入 `ls` 和 `ls backups` 看是否移动成功。

2.3 移除文件和目录
------------------

### rm (remove), rmdir (remove diretory) ###

用 `rm` 命令删除一个文件，下面我们创建 `science.txt` 的一副本，然后再删除
它。在 `unixstuff` 目录下键入：

     % cp science.txt tempfile.txt
     % ls
     % rm tempfile.txt
     % ls

你可以使用 `rmdir` 删除一个目录，不过前提是目录是空的。试试删除 `backups`
目录，自从 UNIX 不允许删除非空目录你再也不能这么干了。

### 练习 2b ###

使用 `mkdir` 创建目录 `tempstuff`, 然后再用 `rmdir` 删掉它。

2.4 在屏幕上显示文件内容
-------------------------

### clear (clear screen) ###

在开始下面的章节前，你可能想把终端上遗留的输入输出清除一下以便看清新
命令的输出，键入：

     % clear

这样会清除所有的文字，只保留窗口上方的一个提示。

### cat (concatenate) ###

`cat` 命令可以在屏幕上显示文件的内容。键入：

     % cat science.txt

看到没有，这个文件的长度大于窗口的高度，因此你看不到上面滚过去的内容。

### less ###

`less` 命令每次只在屏幕上显示一页。键入：

     % less science.txt

敲空格键可以看下一页，敲 `q` 可以退出。因此查看长文件时 `less` 是更好的
选择。

### head ###

`head` 只显示文件的前十行。首先清屏，然后键入：

     % head science.txt

然后键入：

     % head -5 science.txt

`-5` 的作用是啥呢？

### tail ###

``tail` 显示文件的后十行。清屏然后键入：

     % tail science.txt

提问：怎么查看文件的后十五行？

2.5 搜索文件内容
---------------

### 使用 `less` 进行简单搜索 ###

使用 `less` 可以彻底搜索文本文件中的某个关键字。比如在 `science.txt` 里搜索
`science`, 键入：

     % less science.txt

然后，保持在查看状态不要退出，键入斜杠 `/` 后面加关键字：

     /science

如你所见，`less` 找到并高亮了关键字。敲 `n` 可以搜索下一个出现的关键字。

### grep (别问为什么叫 grep) ###

`grep` 是众多 UNIX 标准工具中的一个，它可以在文件中搜索指定的文字或模式。
首先清屏然后键入：

     % grep science science.txt

如你所见， `grep` 打印出所有包含 `science` 的行。

接着试试这样：

     % grep Science science.txt

`grep` 对大小写敏感，它会区分 `science` 与 `Science`。

参数 `-i` 可以忽略大小写。比如键入：

     % grep -i science science.txt

如果搜索一个短语或者模型需要用单引号括起来，比如搜索 `spinning top`:

     % grep -i 'spinning top' science.txt

除了 `-i` 还可以使用以下选项：

*    -v 显示不匹配的行。

*    -n 在匹配的行前显示行号。

*    -c 只显示匹配行的总行数。

试试上面的选项看看结果有何不同，别忘了一次可以使用多个选项。比如有多少
没有匹配的行：

     % grep -ivc science science.txt

### wc (word count) ###

`wc` （不是 water closet）一个很方便的小工具。下面统计一下单词数量：

     % wc -w science.txt

或者一共有多少行？

     %wc -l science.txt

总结
----

*    `cp file1 file2` - 复制 file1 并命名为 file2。

*    'mv file1 file2' - file1 移动或重命名到 file2。

*    `rm file` - 移除文件。

*    `rmdir directory` -  移除目录。

*    `cat file` - 显示文件内容。

*    `less file` - 分页显示文件内容。

*    `head file` - 显示文件开头几行。

*    `tail file` - 显示文件结尾几行。

*    `grep 'keywords' file` - 搜索文件内容。

*    'wc file' - 统计文件内的总行数/单词数/字母数。

原文
----

<http://www.ee.surrey.ac.uk/Teaching/Unix/unix2.html>
