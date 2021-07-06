学习笔记
# 发布系统

可以分为三个子系统:

1. 线上服务系统：给真正的用户提供线上服务
2. 发布系统：程序员向线上服务系统发布所用的发布系统，可以和线上服务系统同期部署，是两个独立的集群。这个涉及到一定的服务端的知识。最佳实践呢，各个公司也不太一样。最简单的应用就是单机——同级部署发布系统和线上服务器。
3. 发布工具：用命令行工具和发布系统连接。我们需要完成发布系统的模块所要完成的工作。

# 一、实现线上服务系统
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

### 创建一个简单的server
- 新建一个空目录server
- 初始化expres项目: 执行`npx express-generator` 如果要经常初始化项目可以全局安装它
- 执行`npm install`
- app.js一般不用动，页面在views目录，使用的是jade的模板，routes目录是请求的路径，它在app.js里面被引入了进来。public里面有Javascripts images stylesheets代码。最终跑起来的服务只用public里面的代码就可以了。
- `npm start`启动服务，服务的默认端口是3000，在浏览器中输入http://localhost:3000/
打开
- 把routes、views全删掉，只用public
- 在public里面创建一个index.html，随便加一个helloWorld

## 3. 把Server部署到虚拟服务器上

准备工作
- 在安装的时候已经安装了openSSH这个包，如果没有安装的话，直接`apt install openSSH`安装
- 启动服务，因为ubuntu服务默认都是不启动。
  + 执行`service ssh start`，输入password启动，默认会在22端口监听，就可以远程登录到这台server上去了。
  + **ssh就是它既可以远程登录，也是可以传文件的。**
- 要copy 22这个端口
  + 22这个端口是不会直接给虚拟机的在虚拟机里先设置一下端口转发
  + 选择设置-网络-高级-端口转发，添加一条规则：主机端口选一个不太会冲突的8022，子系统端口选22，这样宿主机上的8022端口会被转发到虚拟机上的22端口，可以用它做登录。
  ![](https://github.com/ChengYiFan/Frontend-09-Template/tree/main/Week_19/img/setport.png)
- 创建目录：/home/cici/server
- 进入到server项目目录，写scp命令
  + 一般的scp命令在mac电脑上都是有的，如果是别的环境的话，想办法装一下scp这个命令。
  + 执行 `scp -P 8022 -r ./* cici@127.0.0.1:/home/cici/server` 从8022端口拷贝本目录下的所有资源到虚拟机。出现auth的时候就说明连接成功了。输入虚拟机上的密码。就完成了拷贝。
  + 可以拷贝完整的node_modules目录保持线上和线下的一致，也可以利用package-lock.json策略重新npm install。部署策略这里不再讨论。
- 在虚拟机上的server目录，执行一下`npm start`命令，服务启动起来了。监听的是3000端口。
- 针对虚拟机，再配置一个服务的端口映射。
  + 点击设置 -网络-高级-端口转发-添加一条规则：主机端口8080，子系统端口3000。
  + 在浏览器中输入http://localhost:8080/， 可以看到服务正常启动，能够访问了。
  + http://localhost:8080/stylesheets/style.css 也可以正常从访问

这样就完成了一个纯粹的静态服务系统

# 二、实现发布系统
