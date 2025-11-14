# 模板开发规范

## 目录结构

```
templates/
├── page-templates/ # 页面模板
│ ├── list-page/ # 列表页
│ ├── form-page/ # 表单页
│ └── detail-page/ # 详情页
├── component-templates/# 组件模板
│ ├── business-form/ # 业务表单
│ ├── data-table/ # 数据表格
│ └── chart-card/ # 图表卡片
└── layout-templates/ # 布局模板
│ └── basic-layout/ # 基础布局
└── project-templates/ # 项目模板
```

## 确定模板开发规范：

1. 创建一个新的模板，例如 templates/page-templates。
   1. 模板应该包含哪些文件？例如： 路由、状态管理、API 等。
   2. 模板的配置文件（详情页面有多种布局，组件有多种类型）如何生成？
   3. 模板变量如何替换？例如模板生成后需要插入 cli 版本、用户、作者等。
2. 编写对应的生成器，例如 src/templates/generators/ page-generator.js。

3. 编写模板配置文件，例如 templates/page-templates/list-page/template.config.js
   使用对象形式描述“列表”！

4. 在本地测试模板生成
