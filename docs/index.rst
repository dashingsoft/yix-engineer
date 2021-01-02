易科引擎文档
============

:版本: 0.1
:主页: |Homepage|
:联系方式: jondy.zhao@gmail.com
:作者: 赵俊德

PyArmor 是一个用于加密和保护 Python 脚本的工具。它能够在运行时刻保护
Python脚本的二进制代码不被泄露，设置加密后 Python 源代码的有效期限，绑
定加密后的Python源代码到硬盘、网卡等硬件设备。它的保障机制主要包括

* 加密编译后的代码块，保护模块中的字符串和常量
* 在脚本运行时候动态加密和解密每一个函数（代码块）的二进制代码
* 代码块执行完成之后清空堆栈局部变量
* 通过授权文件限制加密后脚本的有效期和设备环境

内容:

.. toctree::
   :maxdepth: 2

   concepts
   installation
   tutorial
   handbook
   specification

.. include:: _common_definitions.txt
