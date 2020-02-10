// map
import loadjs from 'loadjs'

import { loadMapConfig, loadMapConfigNew } from '@/api/map'

// eslint-disable-next-line no-unused-vars
const loadFns = {
  remote: loadRemoteBigemapLib,
  stable: loadStableBigemapLib,
  default: loadStableBigemapLib,
}

// 从接口加载地图配置
export async function loadConfig() {
  const res = await loadMapConfig()
  const ret = await loadMapConfigNew()
  return {
    // 'bigemapUrl': 'http://192.168.2.114:9000',
    // 'bigemapId': 'bigemap.680uhmft',
    // 'latitude': '22.9478191',
    // 'zoom': '14',
    // 'longitude': '113.3698648',
    ...res.data || {},
    ...ret.data || {},
  }
}

// 加载地图库
// 若指定了配置，则根据配置加载
//  否则，将从接口获取配置，再进行加载
//
// ps: 库获取完成后，会被缓存
export async function loadLib(options) {
  const config = await loadConfig()
  const lib = await loadLibAssert(config.bigemapUrl)
  lib._SRV_MAP_CONFIG_ = config
  return lib
}

function loadLibAssert(basePath = '/') {
  const bundleId = 'leafletV1'
  if (loadjs.isDefined(bundleId)) {
    return Promise.resolve(window.L)
  }

  if (basePath.endsWith('/')) {
    basePath = basePath.slice(0, -1)
  }
  // const paths = [
  //   `${basePath}/bigemap.js/v2.1.0/bigemap.js`,
  //   `${basePath}/bigemap.js/v2.1.0/bigemap.css`,
  // ]
  const paths = [
    '/static/utils/leaflet.js',
    '/static/utils/leaflet.css',
  ]
  return loadjs(paths, bundleId, {
    returnPromise: true,
    numRetries: 3,
  }).then((...args) => {
    return window.L
  })
}

let BigemapLib = null

// eslint-disable-next-line no-unused-vars
async function install(options) {
  if (BigemapLib) {
    return BigemapLib
  }
  BigemapLib = await loadBigemapLib(options)
  return BigemapLib
}

async function loadBigemapLib() {
  let lib
  try {
    lib = await loadStableBigemapLib()
    return lib
  } catch (e) {
    console.warn('loadStableBigemapLib error', e)
  }

  try {
    lib = await loadRemoteBigemapLib()
    return lib
  } catch (e) {
    console.warn('loadRemoteBigemapLib error', e)
  }
}

async function loadStableBigemapLib() {
  let result
  try {
    result = await Promise.all([
      // TODO: 过滤再次压缩
      //  webpack 编译不了，内存爆了
      // import(/* webpackChunkName: "bigemap-lib" */ '@/vendors/bigemap/bigemap.min.js'),
      // import(/* webpackChunkName: "bigemap-lib" */ '@/vendors/bigemap/bigemap.min.css'),
    ])
  } catch (e) {
    console.log(e)
    throw e
  }
  return result[0]
}

async function loadRemoteBigemapLib(basePath = '/') {
  const bundleId = 'leafletV1'

  if (basePath.endsWith('/')) {
    basePath = basePath.slice(0, -1)
  }

  let oldL

  // const paths = [
  //   `${basePath}/bigemap.js/v2.1.0/bigemap.js`,
  //   `${basePath}/bigemap.js/v2.1.0/bigemap.css`,
  // ]
  const paths = [
    '/static/utils/leaflet.js',
    '/static/utils/leaflet.css',
  ]
  return loadjs(paths, bundleId, {
    returnPromise: true,
    numRetries: 3,
    before: () => {
      oldL = window.L
    },
  }).then(() => {
    const module = window.L && window.L.noConflict && window.L.noConflict()
    if (module === window.L) {
      // fix: manual revert when noConflict not working
      window.L = oldL
      console.log('revert window.L')
    }
    return module
  })
}
