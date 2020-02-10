# monitor-ui

> 基于 [vue-admin-template](http://panjiachen.github.io/vue-admin-template) 项目搭建

## Yarn
**用 [yarn](https://yarnpkg.com/zh-Hans/) 代替 npm**

### 主要优点
- 安装依赖快
- 通过 `yarn.lock` 锁定依赖，保证不同地方，不同时候安装的依赖一致
  - 确保不会因 `node_modules` 依赖不同出现问题
  - 更新依赖时，需将 `package.json` 和 `yarn.lock` 一起提交 

举例以 yarn 为例，请自行换成 npm （无特别注明， npm 与 yarn 命令一致）。


## 基本命令

### Build Setup


```bash
# 安装依赖
yarn install

# 启动开发服务
yarn run dev
```

浏览器访问 [http://localhost:8090](http://localhost:8090)

### Build

```bash
# 构建生产环境
yarn run build
```

### 其它

```bash

# 静态资源打包分析
yarn run build --report
(npm run build -- --report)

# 代码 eslint 检查
yarn run lint
```

## 多页面



## 部署

### dist 目录

- `dist` 为 build 产物目录
- 其中，所有的静态资源文件均在 `dist/static`
  - 用于部署单独的 静态资源 域名 、cdn
  - 里面所有文件文件名均会被打 hash ，内容变更，文件名不同
  - 因此可设置强缓存（非常长时间的缓存设置）

### 部署更新要求
在对 `static` 路径 设置了强缓存后，对前端资源的更新有要求

#### 前端资源分为
1. html 页面等; 除 `static` 文件夹外的文件
1. 静态资源：js, css, image, font...; 即 `static` 文件夹

#### 更新要求
- 顺序
  - 先更新 静态资源
  - 再更新 html 页面
- 非覆盖式发布
  - 发布新版本时，不删除旧版本任何文件，直接将新版本文件释放至对应目录
  - 因为缓存原因，用户有可能访问到旧版本的文件

#### 禁止 html 缓存
必须禁止 html 文件不经协商直接使用本地缓存

nginx 使用 `add_header Cache-Control "private, max-age=0";` 设置，确保访问 html 时，浏览器都会进行 304 协商缓存

### gzip

对前端资源文件开启 gzip 后，前端资源经网络传输的实际大小将大大减少

前端在构建的已经生成对应的 .gz 文件，不需要再在服务端实时压缩，直接返回即可

> html 也生成了 .gz 压缩文件

nginx demo
```
server {
  location ^~ /static/ {
    # 设置一年的缓存
    expires 365d;
    
    # 支持发送预先压缩的 .gz 文件
    gzip_static on;
  }
}
```

### sourcemap
默认构建不输出。测试环境的构建打包建议开启

通过设置环境变量 `VUE_APP_PRODUCTION_SOURCE_MAP = true` 开启

> vue cli 3 支持创建 `.env.production.local` 这样的文件（*.local 已被 vcs 忽略）来设置环境变量

#### 开发环境下 sourcemap

vue cli 开发模式默认使用 `cheap-module-eval-source-map`
若存在同名的 vue 文件，chrome 开发者工具无法打断点调试，只能看到一个文件。比如 `index.vue`

因此，改成了 `eval-source-map` ，初始化时比较慢

[相关 webpack 文档](https://webpack.docschina.org/configuration/devtool/#对于开发环境)

## 文档
### 项目风格指南
- 以官方风格指南 https://cn.vuejs.org/v2/style-guide/ 为基础
- [项目目录命名规范](./docs/styleguide-naming.md)

更多信息可参考 [vue-admin-template 文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

### 项目用到的重要第三方库

- ElFormRenderer

通过配置，生成  el-form 
[doc](https://femessage.github.io/el-form-renderer)
