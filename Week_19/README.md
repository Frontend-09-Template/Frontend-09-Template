学习笔记
# 发布系统

可以分为三个子系统:

1. 线上服务系统：给真正的用户提供线上服务
2. 发布系统：程序员向线上服务系统发布所用的发布系统，可以和线上服务系统同期部署，是两个独立的集群。这个涉及到一定的服务端的知识。最佳实践呢，各个公司也不太一样。最简单的应用就是单机——同级部署发布系统和线上服务器。
3. 发布工具：用命令行工具和发布系统连接。我们需要完成发布系统的模块所要完成的工作。

## 1. 初始化Server
需要一台独立的服务器去做这个事情。有条件的可以用真实的服务器，我们这里就用虚拟机来代替真实的服务器。

虚拟机——推荐Oracle的VirtualBox虚拟机，完全开源免费的版本。演示一个Ubuntu Server的版本。基于Ubuntu Server去做开发。

### 1.1 在VirtualBox下安装Ubuntu Server
- 前期准备: 下载安装VirtualBox（ https://www.virtualbox.org/wiki/Downloads）和Ubuntu Server镜像（https://ubuntu.com/download/server）
- 首先在VirturalBox中创造一个虚拟机，点击新建，输入： Node Server；
- 环境选择Linux\Ubuntu 64\2G内存\10G硬盘-动态分配
- 启动： 选择光盘镜像——ubuntu-20.04.2-live-server-amd64.iso
- 选择语言类型为英语,不用代理,镜像地址修改一下,用默认的ubuntu.com会比较慢: mirrors.aliyun.com/ubuntu
- 其他设备选项不用修改
- 输入Name/Server name/password
- Install OpenSSH Server默认勾选上
- popular snaps in server 暂时不用选
- 开始安装可以看到完整的log
- 安装完毕后要求重启reboot,让我们去把这个光盘弹出来(它其实会自动的把光盘弹出来),然后再手工重启一次就可以了
- 重启后出现登录提示,直接输用户名和密码(不用管log,这算是一个bug),登录成功

### 1.2 安装node

ubuntu上的包管理工具是apt, 使用apt安装一下node
```
sudo apt install nodejs
```
安装完成,查看版本号`node --version`为 10.19.0

### 1.3 安装npm
```
sudo apt install npm
```
安装完成,查看版本号`npm --version`为 6.14.4

### 1.4 用npm 全局安装一个叫n的包
这个是一个Node写的Node版本管理
```
sudo npm install -g n
```
 更新node到最新版本
 ```
 sudo n latest 
 ```
 重新设置PATH`PATH=$PATH` 然后node就更新到最新版本了.

 ## 2. 利用Express,编写服务器

现在最普遍最广泛应用的服务器框架Express, 在实际情况中,每个公司的线上服务系统可能比较复杂,有的公司发展比较好的它可能线上已经有一个这样的服务器,甚至是一个集群形态的这样的服务,有的公司它可能是前后端混部的,前端写完代码要交给后端同学进行部署,这里我们简单的把一个Express服务器跑起来.然后把它部署到我们的线上的机器上.也不去考虑监控\错误恢复,还有包括线上的重启,等一系列这种业务逻辑.

一般来说,如果是前后端分离的这种业务模式,前端代码是发HTML的,而服务端数据是由HTML和JS里面再去做Ajax请求再去获取的.怎么去发静态文件,涉及到和服务端混部,这个方案还得跟服务端的同学一起去商量.前端有没有自主独立的这种发布权限?

假设前端都是有独立的发布权限的.然后另外服务器集群的情况和部署的措施其实还跟运维有关,这个都要视公司的实际情况去进行沟通.一般不是一个前端team的事情.咱们这个课程会揭示里面的原理，把整个的链路跑通。

新建一个空目录server

