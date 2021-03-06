---
title: 'UNIX / Linux 新手入门（七）'
layout: post
tags:
    - unix
---

7.1 编译 UNIX 软件包
---------------------

我们的系统里有很多公共或商业的软件包供所有用户使用，然而学生只能在他们自己的私人目录里下载和安装小的软件包，通常只供私人使用。安装软件有以下几个步骤。

*    查找下载源代码(通常是压缩后的)。
*    解包源代码。
*    编译代码。
*    安装编译后生成的可执行文件。
*    设置路径(path)到安装目录。

上面几个步骤中最困难的可能是编译阶段。

### 编译源代码

所有高级语言代码都需要转换成机器可懂的格式。打个比方，C 语言源代码先转换成更底层的汇编语言(assembly language)。然后将得到的汇编语言转换成机器能直接理解的目标代码(object code)片段。最后编译的最终阶段需要连接目标代码到包含内建函数的代码库。最后生成可执行文件。

这些步骤都很复杂，超出了普通用户可以完成的程度。不过一些已完成的工具可以帮程序员和最终用户简化这些步骤。

### make 以及 Makefile

make 命令可以让程序员管理大型程序或者程序组。它通过持续追踪整个程序中被修改的部分帮助开发大型程序，编译时仅编译被修改的部分。

make 程序从位于源代码目录下名为 Makefile 的文件中获得编译规则。文件中包含一些编译程序的信息，比如优化级别，是否在可执行文件中包含调试信息。它同时还包含编译后生成二进制文件的安装目录，手册信息，数据文件信息，依赖的库，配置文件等等。

一些程序包需要你手工编辑 Makefile 来设置最终的安装目录以及其他的一些参数。然而，现在很多包都使用 GNU 配置工具部署。

### 配置

由于存在多种 UNIX 版本，这会给开发兼容所有版本的程序带来困难。通常开发人员并不能访问所有的系统，而且随着版本迭代系统的特征也会不断变化。GNU 配置和构建系统可以简化程序部署。
所有的程序都使用简单标准的两步处理。程序构建者也不需要为了构建程序去安装特别的工具。

在编译时, configure 脚本会为不同的系统猜测不同的值。然后它用这些值为包中的每个目录生成 一个 Makefile 文件。

编译包最简单的方法是：

1. `cd` 到包的源代码目录。
2. 键入 `./configure` 针对你的系统配置程序包。
3. 键入 `make` 编译程序包。
4. 键入 `make check` 运行程序包自带的自测程序（可选）。
5. 键入 `make install` 安装程序，数据文件以及文档。
6. 键入 `make clean` 从源文件目录中移除二进制文件以及目标代码。

配置工具支持非常多的选项。通常你可以使用 `--help` 获得特定配置脚本的选项列表。

`--prefix` 和 `-exec-prefix` 是唯一的你可能用到的通用选项。他们用来设置安装目录。`--prefix` 目录用来存放与机器无关的文件比如文档，数据和配置文件。`--exec-prefix` 目录（通常是 --prefix 的子目录）用来存放与机器相关的文件比如可执行文件。

7.2 下载源代码
--------------

举例说明，我们下载一个用于在不用计量单位之间转化的自由软件。首先创建一个下载目录：

          % mkdir download

[从这里下载](http://www.ee.surrey.ac.uk/Teaching/Unix/units-1.74.tar.gz)并保存源代码到你的下载目录。

7.3 提取源文件
---------------

进入下载目录然后列出内容：

          % cd download
          % ls -l

正如你看到的文件名以 .tar.gz 结尾。`tar` 命令将多个文件和目录打包成一个单独的 tar 文件。这儿还使用 gzip 压缩 tar 文件（生成 tar.gz 文件）。

首先使用 gunzip 命令解压，这会得到一个 .tar 文件：

          % gunzip units-1.74.tar.gz

然后抽取 .tar 文件的内容：

          % tar -xvf units-1.74.tar

再次列出下载目录中的内容，然后进入 units-1.74 目录：

          % cd units-1.74

7.4 配置和生成 Makefile 文件
-----------------------------

首先要做的是小心地阅读 README 和 INSTALL 文件（使用 less 命令）。他们包含着编译和运行软件的重要信息。

这个程序包使用 GNU 配置系统编译源文件。我们需要指定安装目录，由于我们没有默认安装目录所在的主系统区域的写权限，因此需要在私有目录下创建一个安装目录：

          % mkdir ~/units174

然后运行配置工具设置安装目录：

          % ./configure --prefix=$HOME/units174

提醒：`$HOME` 是一个环境变量。它的值是你私有目录的路径。键入 `echo $HOME` 查看这个变量的内容。我们会在以后的章节中学习更多关于环境变量的内容。

如果 `configure` 运行正确将会生成一个带有所有必要选项的 Makefile 文件。你可以查看 Makefile 文件（使用 less 命令），但不能修改它。

7.5 构建包
-----------

现在你可以使用 make 命令构建包：

          % make

一两分钟后（取决于机器的速度），可执行文件被生成。你可以检查编译是否成功：

          % make check

如果一切顺利，你就可以安装包了：

          % make install

这将把文件安装到你之前创建的目录 ~/units174 中。

7.6 运行软件
------------

如果一切顺利，现在可以准备运行软件了。

          % cd ~/units174

如果列出这个目录的内容，你将看到以下几个子目录。

*    bin - 二进制可执行文件。
*    info - GNU info 格式的文档。
*    man - 手册。
*    share - 共享数据文件。

为了运行软件，进入 bin 目录然后键入：

          % ./units

举个例子，将 6 尺转换成米。

          you have: 6 feet
          you want: metres

          * 1.8288

如果你得到的答案是 1.8288 ，恭喜你，它工作了。

为了知道哪些单位可以彼此之间转换可以查看在共享目录中的数据文件（这个列表非常完备）。

想阅读整个文档可以进入到 info 目录然后键入：

          % info --file=units.info

7.7 剥离非必要的代码
----------------------

当开发一个软件时，在可执行文件中包含调试信息对程序员很有用，这样，如果程序在运行可执行文件时遇到问题，程序员可以将可执行文件加载到调试工具中追踪软件问题。

这对程序员很有用，但对用户却没这个必要。我们假设一个软件包已经开发完毕并且可供下载，已经测试和修复过。然而我们在像上面那样编译时，调试信息依然会编译到最终的可执行文件。由于我们不大可能需要这些调试信息，因此我们可以把它从可执行文件中剥离出去。这样做的一个好处是可执行文件更小，执行可以更快。

对比可执行文件的大小，先进入到安装目录中的 bin 目录中：

          % cd ~/units174/bin
          % ls -l

如你所见，文件超过了 100kb 。使用 file 命令可以得到更多的信息：

          % file units

          units: ELF 32-bit LSB executable, Intel 80386, version 1, dynamically linked (uses shared libs), not stripped

从可执行文件中剥离所有调试和行号信息，使用 strip 命令：

          % strip units
          % ls -l

看到没有，现在文件只有 36kb - 原大小的三分之一。三分之二都是调试代码！

再看看文件信息：

          % file units

          units: ELF 32-bit LSB executable, Intel 80386, version 1, dynamically linked (uses shared libs), stripped

有时你可以在安装包的时候使用 make 命令安装已经剥离过的可执行文件。只要把 `make install` 简单地替换成 `make install-strip` 就可以了。

原文
-----

<http://www.ee.surrey.ac.uk/Teaching/Unix/unix7.html>
