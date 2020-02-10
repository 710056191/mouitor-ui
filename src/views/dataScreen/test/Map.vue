<template>
  <DataComWrapper>
    <div id="map" class="data-screen-map">
      loading...
    </div>
    <!-- <Map /> -->

  </DataComWrapper>
</template>

<script>

import { getInstance, init as initBM } from '../utils/bigemap-helper.js'
// import { getDevice } from '@/api/map'
import DataComWrapper from '../components/common/DataComWrapper'
import echarts from 'echarts'

export default {
  name: 'Map',
  components: {
    DataComWrapper,
  },
  props: ['childdata'],
  data() {
    return {
      deviceList: [],
      configInfo: {},
      option: null,
    }
  },
  watch: {
    childdata: function(newdata) {
      if (newdata) {
        this.deviceList = newdata.data
        this.configInfo = newdata.info
        this.initDeviceInfo()
      }
    },
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
      window.echarts = echarts
      const script = document.createElement('script')
      script.src = 'http://wandergis.com/leaflet-echarts3/dist/main.min.js'
      document.body.appendChild(script)
      setTimeout(() => {
        if (window.L && window.L.echartsLayer3) {
          this.initDeviceInfo()
          const overlay = window.L.echartsLayer3(this.map, window.echarts)
          const chartsContainer = overlay.getEchartsContainer()
          const myChart = overlay.initECharts(chartsContainer)
          overlay.setOption(this.option)
        } else {
          this.init()
        }
      }, 2000)
    },
    async initDeviceInfo() {
      const { deviceList } = this
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
      const { configInfo } = this
      this.initEcharts(newDeviceList, configInfo)
    },

    initEcharts(list = [], configInfo = {}) {
      const geoCoordMap = []
      const geoData = []
      const Data = []
      list = [...list].concat({ longitude: configInfo.longitude, latitude: configInfo.latitude, status: '1', selfAddr2: '总控室' })
      list.map(item => {
        geoCoordMap.push({
          name: item.selfAddr2,
          itude: [Number(item.longitude), Number(item.latitude)],
        })
        if (item.status === '1') {
          geoData.push([{ name: '总控室' }, { name: item.selfAddr2, value: Number(item.status) }])
        } else if (item.status === '0') {
          Data.push([{ name: '总控室' }, { name: item.selfAddr2, value: Number(item.status) }])
        }
      })

      const convertData = function(data) {
        const res = []
        for (let i = 0; i < data.length; i++) {
          const dataItem = data[i]
          let fromCoord = ''
          const toCoord = [Number(configInfo.longitude), Number(configInfo.latitude)]
          geoCoordMap.map(item => {
            if (item.name === dataItem[1].name) {
              fromCoord = item.itude
            }
          })
          if (fromCoord && toCoord) {
            
            res.push([{ coord: fromCoord }, { coord: toCoord }])
          }
        }
        // console.log(res)
        return res
      }
      const color = ['#00f', '#f00']
      const show = [false, true]
      const series = []
      const arr = [['总控室', Data], ['总控室', geoData]]
      arr.forEach((item, i) => {
        series.push(
          {
            type: 'lines',
            // coordinateSystem: 'leaflet',
            zlevel: 1,
            symbolSize: 8,
            effect: {
              show: show[i],
              period: 4,
              trailLength: 0.002,
              symbol: 'arrow',
              symbolSize: 5,
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                opacity: 0.6,
                curveness: 0.2,
              },
            },

            data: convertData(item[1]),
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke',
              period: 4,
              scale: 3,
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}',
              },
            },
            symbolSize: 7,
            itemStyle: {
              normal: {
                color: color[i],
              },
            },
            data: item[1].map(dataItem => {
              let val = ''
              geoCoordMap.map(item => {
                if (dataItem[1].name === item.name) {
                  val = item.itude.concat(dataItem[1].value)
                }
              })
              return {
                name: dataItem[1].name,
                value: val,
              }
            }),
          },
        )
      })

      this.option = {
        tooltip: {
          trigger: 'item',
        },
        geo: {
          map: '',
          label: {
            emphasis: {
              show: false,
            },
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#404a59',
            },
            emphasis: {
              areaColor: '2a333d',
            },
          },
        },
        series: series,
      }
    },
  },
}

</script>

<style lang="scss">

#map{
    width: 100%;
}

</style>
