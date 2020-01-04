'use strict'
const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

const ProjectConfig = require('./build/config')
const entry = require('./build/entry')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const projectName = ProjectConfig.title || 'vue Admin Template' // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 8090 // dev port
const pages = entry.getPages()

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  pages,
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: process.env.VUE_APP_PRODUCTION_SOURCE_MAP === 'true',
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:${port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
      // [process.env.VUE_APP_BASE_API]: {
      //   target: 'http://192.168.2.114:8066',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + process.env.VUE_APP_BASE_API]: '',
      //   },
      // },
    },
    after: require('./mock/mock-server.js'),
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: projectName,
    resolve: {
      alias: {
        '@': resolve('src'),
        'video.js$': 'video.js/dist/video.es.js',
      },
    },

    externals: {
      // BM: 'BM',
      // leaflet: 'BM',
      leaflet: 'L',
    },

    plugins: [
      new webpack.ProvidePlugin({
        videojs: ['video.js', 'default'],
        'window.videojs': ['video.js', 'default'],
      }),
    ],
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    Object.keys(pages).forEach(entryName => {
      config.plugins.delete(`prefetch-${entryName}`)

      // const runtimeName = `runtime~${entryName}`

      // preload 过滤 内联到 html 的文件
      config
        .plugin(`preload-${entryName}`)
        .tap(args => {
          args[0].fileBlacklist.push(
            // new RegExp(`${runtimeName}\\..*\\.js$`),
            new RegExp(`${entryName}\\..*\\.(js|css)$`),
          )
          return args
        })
    })

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('eval-source-map'),
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('HtmlWebpackInlineSourcePlugin')
            .after('html')
            .use('html-webpack-inline-source-plugin')
            .end()

          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                elementUI: {
                  name: 'chunk-element-ui',
                  priority: 20,
                  // test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                  test: module => {
                    /**
                     * 因为自定义了 element ui 主题，不从 node_modules 直接导入样式，
                     * 所以要将 自定义主题 加入匹配
                     */
                    for (const chunk of module.chunksIterable) {
                      if (!(chunk.name && module.nameForCondition)) {
                        continue
                      }

                      /** @type string */
                      const moduleName = module.nameForCondition()
                      if (
                        moduleName.includes(path.join('node_modules/element-ui/')) ||
                        moduleName.includes(path.join('src/lib/element-ui/theme/'))
                      ) {
                        return true
                      }
                    }

                    return false
                  },
                },

                vendors: {
                  name: 'chunk-vendors',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial', // only package third parties that are initially dependent
                },

                commons: {
                  name: 'chunk-components',
                  test: resolve('src/components'),
                  minChunks: 3,
                  priority: 5,
                  reuseExistingChunk: true,
                },
              },
            })
          config.optimization.runtimeChunk('multiple')

          config
            .plugin('compression')
            .use(CompressionPlugin)
            .tap(args => {
              return [{
                test: /\.(js|css|html|svg|ttf)$/,
                threshold: 1024 * 5, // 5KB
              }]
            })
        },
      )
  },
  transpileDependencies: [
    'element-ui/src/',
    'el-search-table-pagination',
    'yallist',
    'lru-cache',
  ],
}
