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
  const L = await loadLib()
  const srvMapConfig = L._SRV_MAP_CONFIG_ || {}
  const { latitude, longitude, zoom, mapUrl } = srvMapConfig
  // L.Config.HTTP_URL = bigemapUrl

  /* eslint-disable-next-line no-unused-vars */
  // const map = L.map('map', bigemapId, {
  //   crs: L.CRS.Baidu,
  //   center: [latitude, longitude],
  //   zoom: zoom || 14,
  //   zoomControl: false,
  // })

  const map = L.map('map', {
    center: [latitude, longitude],
    zoom: zoom || 12,
    zoomControl: false,
    attributionControl: false,
  })
  const wmsLayer = L.tileLayer.wms(mapUrl, {
    layers: 'ARCGIS-Demo',
    format: 'image/png',
  })
  wmsLayer.addTo(map)

  L.control.zoom({
    position: 'bottomright',
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  }).addTo(map)

  L.control.scale({
    maxWidth: 300,
    metric: false,
    imperial: false,
    position: 'bottomleft',
  }).addTo(map)

  // const polylineMeasure = L.control.polylineMeasure({
  //   position: 'topleft',
  //   unit: 'metres',
  //   showBearings: true,
  //   clearMeasurementsOnStop: false,
  //   showClearControl: true,
  //   showUnitControl: true,
  // })

  // polylineMeasure.addTo(map)

  g_map = map

  map.on('click', function(e) {
    const { lat, lng } = e.latlng
    const str = `[${lat}, ${lng}]`
    console.log(str)
    recordLatLng(lat, lng)
  })

  map.on('zoomend', function(e) {
    // 地图缩放回调函数
    const dom = document.getElementsByClassName('map-marker-icon')
    const tooltipDom = document.getElementsByClassName('marker-num')
    for (let i = 0; i < dom.length; i++) {
      const domArr = dom[i].style.transform.split('(')[1].split(',')
      const tooArr = tooltipDom[i].style.transform.split('(')[1].split(',')
      if (domArr[0] !== tooArr[0]) {
        tooltipDom[i].style.transform = 'translate3d(' + domArr[0] + ',' + tooArr[1] + ',' + tooArr[2]
      }
    }
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
  const polygon = window.L.polygon(latlngs, { color: '#4d90fe', ...options }).addTo(g_map)
  // g_map.fitBounds(polygon.getBounds())
  polygon.bindTooltip(title)
  return polygon
  // 让地图适配当前的多多边形
  // map.fitBounds(polygon.getBounds())
}
