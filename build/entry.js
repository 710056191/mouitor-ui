const path = require('path')
const fs = require('fs')
const glob = require('glob')

const ProjectConfig = require('./config')

const getPages = () => {

  /** @type {Array} */
  const entries = glob.sync('**/index.js', { cwd: ProjectConfig.pagesDir })

  return entries.reduce((pages, entry) => {
    // eg: entry
    // "index/index.js" ==> "/index.html"
    // "my/info/index.js" ==> "/my/info.html"

    // name: 'my/info'
    const name = entry.split('/index.js')[0]
    const runtimeName = `runtime~${name}`

    const entryDir = `${ProjectConfig.pagesDir}/${name}`

    // 设置配置
    // 优先使用 config.json
    // 若配置没有 template ，则设为入口文件的同名 html
    // 若 template 以 `~root/` 开头，路径从项目根目录开始
    // 如果最终 template 文件找不到，vue cli 会回退到 `public/index.html`
    const configPath = path.resolve(entryDir, 'config.json')
    const pageConfig = {
      template: './index.html',
      title: ProjectConfig.title || 'Vue Tpl',

      ...(fs.existsSync(configPath) ? require(configPath) : {}),

      chunks: [...ProjectConfig.commonChunks, runtimeName, name],
      entry: `${ProjectConfig.pagesDir}/${entry}`,

      // 内联重要代码至 html
      //  - webpack runtime.js      ${runtimeName}\\..*\\.js$
      //  - 页面自身的 js, css       ${name}\\..*\\.(js|css)$      这个能同时匹配到 runtime.js
      inlineSource: `${name}\\..*\\.(js|css)$`,
    }

    // resolve page index template
    let { template } = pageConfig
    template = template.trim().startsWith('~root/')
      ? template.trim().slice('~root/'.length)
      : path.relative('', path.resolve(entryDir, template))

    pages[name] = {
      ...pageConfig,
      template,
    }
    return pages
  }, {})
}

module.exports = {
  getPages
}
