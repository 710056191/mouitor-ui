# 目录结构及命名规则

以 [Vue 官方风格指南](https://cn.vuejs.org/v2/style-guide/) 为基础

## 目录结构

```
~ProjectRoot
├─ .editorconfig                    # EditorConfig, 定义基本的编码风格
├─ .env                             # 指定环境变量
├─ .eslintrc.js                     # ESlint 配置
├─ .gitignore
├─ .idea                            # JetBrains IDEs 项目配置
├─ .npmrc                           # npm 配置
├─ babel.config.js
├─ dist                             # 项目构建产品输出目录
├─ node_modules
├─ package.json
├─ .postcssrc.js
├─ public                           # 静态资源，直接被拷贝
│    ├─ favicon.ico
│    └─ index.html                  # 生成 html 默认模板
├─ src
│    ├─ api                         # api
│    ├─ assets                      # 静态资源
│    ├─ components                  # Vue 可复用组件
│    ├─ views                       # 路由 view
│    │    └─ demo 
│    │         │─ components
│    │         │    │─ PageA
│    │         │    │    └─ ...     # 存放 路由 demo-page-a 的组件
│    │         │    │─ Index
│    │         │    │    └─ ...
│    │         │    └─ ...
│    │         ├─ utils
│    │         ├─ demo-page-a.vue
│    │         └─ index.vue
│    │─ ...
│    └─ main.js                     # 项目单页面入口
├─ vue.config.js                    # Vue Cli 调整 webpack 配置
└─ yarn.lock                        # Yarn 固化依赖
```

## 目录规范

### Component
所有的 `Component` 文件都是以大写开头 (PascalCase)，

但除了 `index.vue`

例子：
```
@/src/components/BackToTop/index.vue          # 项目级别的公共组件
@/src/views/demo/components/Button.vue        # demo 模块级别的公共 Button 组件
@/src/views/demo/components/PageA/Button.vue  # 仅限于 dmeo 模块 PageA 页面用到的组件
```

### JS 文件

所有的.js文件都遵循横线连接 (kebab-case)

例子：
```
@/src/utils/project-env.js
@/src/components/MarkdownEditor/default-options.js
@/src/views/svg-icons/require-icons.js
```

### Views
在views文件下，代表路由的.vue文件都使用横线连接 (kebab-case)，代表路由的文件夹也是使用同样的规则

例子：
```
@/src/views/svg-icons/index.vue
@/src/views/svg-icons/require-icons.js
```

> PS: 仅代表路由的文件及文件夹使用横线连接，其中的 `components` `utils` 等其他文件按其原本规则
>
> 路由页面都放在这里，子路由 建文件嵌套放置，路由页面的组件放在该模块的 components 下，详见目录结构例子
 
例子：
```
@/src/views/demo/components/PageA/SearchButton.vue

```

### api
原则上，以接口的模块名作为文件名划分

 例子：
 ```
 @/api/user.js 	# 为 /user/xxx user 模块的接口
 ```
