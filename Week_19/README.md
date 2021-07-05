学习笔记
# 发布系统

可以分为三个子系统:

1. 线上服务系统：给真正的用户提供线上服务
2. 发布系统：程序员向线上服务系统发布所用的发布系统，可以和线上服务系统同期部署，是两个独立的集群。这个涉及到一定的服务端的知识。最佳实践呢，各个公司也不太一样。最简单的应用就是单机——同级部署发布系统和线上服务器。
3. 发布工具：用命令行工具和发布系统连接。我们需要完成发布系统的模块所要完成的工作。

## 1. 初始化Server
需要一台独立的服务器去做这个事情。有条件的可以用真实的服务器，我们这里就用虚拟机来代替真实的服务器。

虚拟机——推荐Oracle的VirtualBox虚拟机，完全开源免费的版本。演示一个Ubuntu Server的版本。基于Ubuntu Server去做开发。

### 在VirtualBox下安装Ubuntu Server
- 前期准备: 下载安装VirtualBox（ https://www.virtualbox.org/wiki/Downloads）和Ubuntu Server镜像（https://ubuntu.com/download/server）
- 首先在VirturalBox中创造一个虚拟机，点击新建，输入： Node Server；
- 环境选择Linux\Ubuntu 64\2G内存\10G硬盘-动态分配
- 启动： 选择光盘镜像——ubuntu-20.04.2-live-server-amd64.iso
- 选择语言类型为英语,不用代理,镜像地址修改一下,用默认的ubuntu.com会比较慢: mirrors.aliyun.com/ubuntu
- 其他设备选项不用修改
- 输入Name/Server name/password
- Install OpenSSH Server默认勾选上
- popular snaps in server 暂时不用选

