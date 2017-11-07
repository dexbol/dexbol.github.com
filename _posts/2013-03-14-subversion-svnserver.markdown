---
title: 'Subversion svnserve'
layout: post
tags:
    - tools
---

使用subversion内置的功能搭建svn服务，并通过svn hooks 部署代码。

启动svnserver
-------------

svn默认使用3690端口，打开 `/etc/services` 查看是否有：

     svn 3690/tcp
     svn 3690/udp

没有的话需要加上。

启动svnserver：

     svnserve -d -r /srv/svn/

-d: 使用daemon模式。-r svn仓储父目录路径， 如果不指定 `r` 访问svn仓储需要使用绝对路径，
比如：`svn://domain.com/srv/svn/repository`, 使用参数`-r /srv/svn/` 后可以直接通过
`svn://domain.com/repository` 访问。

用户验证
---------

打开`repository/conf/server.conf`, 在`[general]`下添加'password-db = passwd'和
'realm = any character' 两行，*每行的前后不能出现空格，否则无法识别*。
继续添加`anon-access = none` 以及 `auth-access = write` 同样每行前后不能出现空格。

打开'repository/conf/passwd'在`[users]`下添加:`your_username = your_password`。
到这里基本设置完毕。

通过svn部署代码
---------------

当用svn把代码提交到服务器后，它只是保存到svn的数据库中。需要某种机制把最新的代码
checkout出来然后部署到特定目录。svn提供hooks功能，可以利用hooks绑定特定事件进行实时
的代码部署
打开目录`respository/hooks/` 复制 `post-commit.temp`到`post-commit` 里面提供两个变量
`REPOS`和`REV`可以使用，分别是svn仓储地址和revision number. 每当有客户端提交代码后，
post-commit 内命令会自动被执行，并且可以得到上面两个变量作为参数。例如使用python脚本
部署：

     /usr/bin/python your-python-script.py "$REPOS" "$REV"

这样每次提交后`your-python-script.py`便会执行，示例python脚本：
<https://gist.github.com/dexbol/5105038> 因为我只有一个仓储所以没有使用变量`$REPOS`
而是直接硬编码在code中。
