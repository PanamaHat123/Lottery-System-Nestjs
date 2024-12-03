



<div style="display: flex;align-items: start;justify-content: center;padding-top: 20px">
    <div style="display: flex;flex-direction: column;font-size: 14px;margin-right: 12px">
        <span>抽奖流程可视化1: 抽奖经过责任链再到抉择树</span>
        <img style="width: 300px;"  src="https://raw.githubusercontent.com/PanamaHat123/images/refs/heads/master/%E8%B4%A3%E4%BB%BB%E9%93%BE%E5%8A%A0%E6%8A%89%E6%8B%A9%E6%A0%91.png"/>
    </div>
    <div style="display: flex;flex-direction: column;font-size: 14px">
        <span>抽奖流程可视化2: 责任链接管中奖</span>
        <img style="width: 300px;"  src="https://raw.githubusercontent.com/PanamaHat123/images/refs/heads/master/%E8%B4%A3%E4%BB%BB%E9%93%BE%E6%8E%A5%E7%AE%A1.png"/>
    </div>
</div>

## 项目描述
项目实现了营销系统核心功能,使用DDD领域驱动设计,采用责任链设计模式、抉择树设计模式、组合模式、策略模式等对抽奖规则进行解耦。实现抽奖功能的高扩展性（可实现类似拼多多抽奖系统复杂规则）。

**·** 技术栈：Nestjs(Monorepo架构) Mysql Redis

### 流程图
<div style="display: flex;align-items: start;justify-content: center">
    <img style="width: 300px;"  src="https://raw.githubusercontent.com/PanamaHat123/images/refs/heads/master/raffle%E6%B5%81%E7%A8%8B%E5%9B%BE.png"/>
--
<img style="width: 300px;"  src="https://raw.githubusercontent.com/PanamaHat123/images/refs/heads/master/%E6%97%B6%E5%BA%8F%E5%9B%BE.png"/>

</div>
<div style="display: flex;align-items: center;justify-content: center;margin-top: 10px">
</div>

### 数据库设计
#### 抽奖规则表
<div style="display: flex;align-items: center;justify-content: start;margin-top: 10px">
    <img style="width: 500px;"  src="https://raw.githubusercontent.com/PanamaHat123/images/refs/heads/master/%E6%8A%BD%E5%A5%96%E8%A7%84%E5%88%99%E8%A1%A8.png"/>
</div>

#### 抉择表
<div style="display: flex;align-items: center;justify-content: start;margin-top: 10px">
    <img style="width: 500px;"  src="https://raw.githubusercontent.com/PanamaHat123/images/refs/heads/master/raffle%E6%8A%89%E6%8B%A9%E6%A0%91%E8%A1%A8.png"/>
</div>

### 代码结构
<div style="display: flex;align-items: start;justify-content: start;margin-top: 10px">
    <img style="width: 300px;"  src="https://raw.githubusercontent.com/PanamaHat123/images/refs/heads/master/raffle%E4%BB%A3%E7%A0%81%E7%BB%93%E6%9E%84.png"/>
---  ----  
<img style="width: 300px;"  src="https://raw.githubusercontent.com/PanamaHat123/images/refs/heads/master/raffle%E4%BB%A3%E7%A0%81%E9%A2%86%E5%9F%9F%E5%B1%82.png"/>

</div>

