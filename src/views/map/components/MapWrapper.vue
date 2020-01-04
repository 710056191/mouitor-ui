<template>
  <div id="map" class="map-wrapper">
    loading...
  </div>
</template>

<script>
import { getInstance, init as initBM } from '../utils/bigemap-helper'
import { getDevice } from '@/api/map'
// import BM from 'BM'
import { transform, WGS84, BD09 } from 'gcoord'
import { createPolylineMeasure } from '@/utils/map'

export default {
  name: 'MapWrapper',

  data() {
    return {
      map: null,
      markers: null,
      SimilarList: [],
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      try {
        await initBM()
        this.map = getInstance()
      } catch (e) {
        console.error(e)
      }
      this.initMeasure()
      this.initDeviceInfo()
      this.initFullscreen()
    },

    async initMeasure() {
      let LPolylineMeasure
      try {
        [LPolylineMeasure] = await Promise.all([
          import(/* webpackChunkName: "leaflet.polylinemeasure" */ '@/lib/map/leaflet.polyline-measure.js'),
          import(/* webpackChunkName: "leaflet.polylinemeasure" */ '@/lib/map/leaflet.polyline-measure.scss'),
        ])
      } catch (e) {
        console.error(e)
      }
      LPolylineMeasure && createPolylineMeasure(this.map)
    },

    async initDeviceInfo() {
      const { data: deviceList } = await getDevice()
      const newDeviceList = []
      const obj = {}
      for (let i = 0; i < deviceList.length; i++) {
        const latitude = Number(deviceList[i].latitude).toFixed(4)
        const longitude = Number(deviceList[i].longitude).toFixed(4)
        // 借助对象访问属性的方法，判断属性是否存在，如果存在则进行过滤
        if (!obj[latitude] && !obj[longitude]) {
          newDeviceList.push(deviceList[i])
          obj[latitude] = true
          obj[longitude] = true
        }
      }
      this.markers = this.createMarker(newDeviceList, deviceList)
    },

    async initFullscreen() {
      let LFullscreen
      try {
        [{ default: LFullscreen }] = await Promise.all([
          import('@/lib/map/Leaflet.fullscreen/Leaflet.fullscreen.js'),
          import('@/lib/map/Leaflet.fullscreen/Leaflet.fullscreen.scss'),
        ])
      } catch (e) {
        console.error(e)
      }
      LFullscreen && this.map.addControl(new LFullscreen())
    },

    createMarker(list = [], deviceList = []) {
      const that = this
      const markers = list.map(item => {
        let marker = null
        try {
          marker = createMarkerItem(item, this.map, deviceList)
        } catch (e) {
          console.warn('failed to create marker', item, e)
        }
        return marker
      }).filter(value => value)

      return markers

      function createMarkerItem(item, mapIns, deviceList) {
        const { longitude, latitude } = item
        if (!(isCoordinateNumber(longitude) && isCoordinateNumber(latitude))) {
          return null
        }

        const bdPos = transform([longitude, latitude], WGS84, BD09)
        const latlng = window.L.latLng({ lat: bdPos[1], lng: bdPos[0] })
        const icon = window.L.divIcon({
          className: 'map-marker-icon',
          iconSize: [29, 48],
        })

        const SimilarList = []
        for (let i = 0; i < deviceList.length; i++) {
          const latitude = Number(deviceList[i].latitude).toFixed(4)
          const longitude = Number(deviceList[i].longitude).toFixed(4)
          if (Number(item.latitude).toFixed(4) === latitude && Number(item.longitude).toFixed(4) === longitude) {
            SimilarList.push(deviceList[i])
          }
        }

        const marker = window.L.marker(latlng, { icon }).addTo(mapIns)
        marker.__device_id = item.deviceId
        if (SimilarList.length > 1) {
          marker.bindPopup(getMarkerPopupContent(item, SimilarList))
        }
        marker.on('click', markerOnClick)
        marker.bindTooltip(`<span>${SimilarList.length}</span>`, { directory: 'center', permanent: true, className: 'marker-num' }).addTo(mapIns)
        return marker
      }

      function isCoordinateNumber(input) {
        return input !== null && !Number.isNaN(input)
      }

      function getMarkerPopupContent(device, data) {
        data = data || []
        let content = ''
        if (data.length !== 1 && data) {
          data.map(item => {
            const id = item
            content += `<button style="padding:5px;margin:5px 2px" class="marker-button" onClick="handleClickmrker(${JSON.stringify(id).replace(/\"/g, "'")})" key=${item.deviceId}>${item.devName}</button>`
          })
        }
        window.handleClickmrker = function(obj) {
          markerOnClick('', obj.deviceId)
        }
        return content
      }

      /* 获取点位位置 */
      // function getDevicePosition(device = {}) {
      //   let selfAddr1 = device.selfAddr1 || ''
      //   const selfAddr2 = device.selfAddr2 || ''

      //   selfAddr1 && (selfAddr1 += ' ')
      //   return selfAddr1 + selfAddr2
      // }

      function markerOnClick(e, id) {
        const markerIns = e.target
        try {
          toggleHighlight(markerIns)
        } catch (e) {
          console.warn('toggleHighlighte error', e)
        }

        const deviceId = id || markerIns && markerIns.__device_id
        if (!deviceId) {
          console.warn('markerOnClick not found deviceId', e)
          return
        }
        that.$store.dispatch('map/OPEN_DEVICE_PANEL', { id: deviceId })
      }

      function toggleHighlight(marker) {
        if (!marker) {
          return
        }
        markers.forEach(m => {
          const elm = m._icon
          elm.classList.remove('selected')
        })
        const elm = marker._icon
        elm.classList.add('selected')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.map-wrapper {
  @include relative;

  /*background-color: antiquewhite;*/
}
</style>

<style lang="scss">
/* 覆盖 bigemap 样式 */

.map-wrapper, .map-wrapper.bigemap-touch {
  .bigemap-bar {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
    border: none;
  }
}

.map-wrapper {
  .map-marker-icon {
    width: 40px;
    height: 40px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;

    background: transparent url('~@/assets/map/icons/marker-blue.png') no-repeat 0 0;

    &:hover, &.selected {
      background-image: url('~@/assets/map/icons/marker-red.png');
    }
  }
}

.marker-num{
  border-radius:50% !important;
  border: none !important;
  font-size: 14px;
  width: 20px;
  height: 20px;
  line-height: 10px;
  text-align: center;
  margin-top: -8px !important;
  margin-left: -10px !important;
}

.marker-num::before{
  display: none;
}

</style>
