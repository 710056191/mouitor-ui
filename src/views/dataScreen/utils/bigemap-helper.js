// import BM from 'BM'
import { loadLib } from '@/lib/map'

// TODO:
// 修改资源及配置加载方式
//
// 配置
//  在 .env 配置 静态资源地址 及 地图数据接口
//
// 静态资源
//  开发：
//    将 js css 下载至本地，用于开发时依赖
//  线上：
//    读取配置（优先使用挂在 windows 上的配置，再使用 .env 定义的）
//    动态加载静态资源

let g_map = null

window.latLngRecords = []

function recordLatLng(lat, lng) {
  window.latLngRecords.push([lat, lng])
}

export async function init() {
  // 加载地图
  const BM = await loadLib()

  const srvMapConfig = BM._SRV_MAP_CONFIG_ || {}
  const { bigemapUrl, bigemapId, latitude, longitude, zoom } = srvMapConfig

  BM.Config.HTTP_URL = bigemapUrl

  /* eslint-disable-next-line no-unused-vars */
  const map = BM.map('map', bigemapId, {
    crs: BM.CRS.Baidu,
    center: [latitude, longitude],
    zoom: zoom || 14,
    zoomControl: false,
  })

  BM.control.zoom({
    position: 'bottomright',
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  }).addTo(map)

  g_map = map

  map.on('click', function(e) {
    const { lat, lng } = e.latlng
    const str = `[${lat}, ${lng}]`
    console.log(str)
    recordLatLng(lat, lng)
  })

  // map.fitBounds([
  //   [22.51730728149414, 112.95335388183594],
  //   [23.935638427734375, 114.05475616455078],
  // ])
}

export function getInstance() {
  return g_map
}

export function drawOverlayPolygon({ latlngs, title }, options = {}) {
  const overlay = window.BM.polygon(latlngs, { color: '#4d90fe', ...options }).addTo(g_map)
  overlay.bindTooltip(title)
  return overlay
  // 让地图适配当前的多多边形
  // map.fitBounds(polygon.getBounds())
}
