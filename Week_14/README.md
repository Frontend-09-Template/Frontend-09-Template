学习笔记
# 组件化

## 组件基本知识

### 1. 基本概念 和 基本组成部分
组件：既是对象又是模块，可以通过树形来组织，有一定的模板化的配置能力

**对象**
+ Properties  属性
+ Methods     方法
+ Inherit     继承关系



**组件**
+ Properties  属性
+ Methods     方法
+ Inherit     继承关系
+ Attribute   特性
+ Config & State  配置 & 状态：随着人的操作或方法的调用，组件的state会发生变化
+ Event       事件机制：组件往外传递的东西
+ Lifecycle   生命周期
+ Children    是树形结构的一个必要条件

区别：组件在对象的基础上加了许多语义相关的概念，使得组件变成一种非常适合描述UI的一个概念

**Component的概念**
操作者（非程序员用户）对界面去做一些操作，会影响组件的state，有时会影响到组件的子组件（Children）。
程序员会通过attribute去更改组件的一些特征或者是特性。attribute往往是用markup language(声明型的语言)，attribute与properties是否相同取决于组件的设计者。一些 比较激进的方案会把state、config、attribute、properties四者统一。JS里的property是有get和set方法的。Method和property是使用组件的程序员向开发组件的程序员传递消息。Event是开发组件的程序员向使用组件的程序员传递消息。
```markdown
                      Component                       
End User Input  --->    State    <---   attribute       Component User's Markup Code
                          |
                       Children  <---   Method
                                 <---   Property        Component User's JS Code
                                 --->   Event
```

**Attribute vs Property**
+ Attribute 强调描述性
+ Property 强调从属关系