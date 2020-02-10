<template>
  <DataComWrapper
    title="地图数据"
  >
    <div id="map" class="data-screen-map">
      loading...
    </div>
    <!-- <Map /> -->

  </DataComWrapper>
</template>

<script>
import { getInstance, init as initBM } from '../utils/bigemap-helper.js'
import { getDevice } from '@/api/map'
// import { transform, WGS84, BD09 } from 'gcoord'
import DataComWrapper from './common/DataComWrapper'
// import Map from '../test/Map'
import echarts from 'echarts'

export default {
  name: 'DataScreen',
  components: {
    DataComWrapper,
    // Map,
  },
  data() {
    return {
      map: null,
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    async init() {
      // try {
      //   await initBM()
      //   this.map = getInstance()
      // } catch (e) {
      //   console.error(e)
      // }
      this.initDeviceInfo()
    },
    async initDeviceInfo() {
      const { data: deviceList } = await getDevice()
      const newDeviceList = []
      const obj = {}
      for (let i = 0; i < deviceList.length; i++) {
        const latitude = Number(deviceList[i].latitude).toFixed(4)
        const longitude = Number(deviceList[i].longitude).toFixed(4)
        // 借助对象访问属性的方法，判断属性是否存在，如果存在则进行过滤
        if (!obj[latitude] && !obj[longitude] || !obj[deviceList[i].selfAddr2]) {
          newDeviceList.push(deviceList[i])
          obj[latitude] = true
          obj[longitude] = true
        }
      }
      // this.createEcharts(newDeviceList)
      const myOption = this.createEcharts(newDeviceList)
      window.echarts = echarts
      // const script = document.createElement('script')
      // script.src = 'https://gallery.echartsjs.com/dep/echarts/map/js/china.js'
      // document.body.appendChild(script)
      const myChart = echarts.init(document.getElementById('map'))
      setTimeout(() => {
        myChart.setOption(myOption)
      }, 500)
    },

    createEcharts(list = []) {
      console.log('BM:', window.BM)
      // window.echarts = echarts
      // const url = 'https://gallerybox.echartsjs.com/asset/get/s/data-1520166901794-HJRxuDtOG.json'
      echarts.registerMap('echartsMap', GZ)
      // const myChart = echarts.init(document.getElementById('map'))
      const chinaGeoCoordMap = []
      const chinaDatas = []
      list.map(item => {
        chinaGeoCoordMap.push({ 'name': item.selfAddr2, 'itude': [Number(item.longitude), Number(item.latitude)] })
        chinaDatas.push([{ 'name': item.selfAddr2, 'value': Number(item.status) }])
      })
      const convertData = function(data) {
        const res = []
        for (let i = 0; i < data.length; i++) {
          const dataItem = data[i]
          let fromCoord = ''
          chinaGeoCoordMap.map(item => {
            if (dataItem[0].name === item.name) {
              fromCoord = item.itude
            }
          })
          const toCoord = [113.43227, 22.98478]
          if (fromCoord && toCoord) {
            res.push([{
              coord: fromCoord, value: dataItem[0].value,
            }, {
              coord: toCoord,
            }])
          }
        }
        return res
      }
      const series = []
      const newArr = [['总控室', chinaDatas]]
      newArr.forEach(function(item, i) {
        const PinDataValue = [113.43227, 22.98478]
        console.log(item)
        series.push({
          type: 'lines',
          zlevel: 1,
          effect: {
            show: true,
            period: 5, // 箭头指向速度
            trailLength: 0.02, // 特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: 'arrow', // 箭头图标
            symbolSize: 5, // 图标大小
          },
          lineStyle: {
            normal: {
              width: 1, // 尾迹线条宽度
              opacity: 1, // 尾迹线条透明度
              curveness: 0.3, // 尾迹线条曲直度
            },
          },
          data: convertData(item[1]),
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {// 涟漪特效
            period: 4, // 动画时间，值越小速度越快
            brushType: 'stroke', // 波纹绘制方式 stroke,fill
            scale: 3, // 波纹圆环最大限制，值越大波纹越大
          },
          label: {
            normal: {
              show: true,
              position: 'right', // 显示位置
              offset: [5, 0], // 偏移位置
              formatter: function(params) { // 圆环显示文字
                return params.data.name
              },
              fontSize: 13,
            },
            emphasis: {
              show: true,
            },
          },
          symbol: 'circle',
          symbolSize: function(val) {
            return 5 + val[2] * 5 // 圆环大小
          },
          itemStyle: {
            normal: {
              show: false,
              color: '#f00',
            },
          },
          data: item[1].map(function(dataItem) {
            let value = ''
            chinaGeoCoordMap.map(item => {
              if (dataItem[0].name === item.name) {
                value = item.itude.concat([dataItem[0].value])
              }
            })
            return {
              name: dataItem[0].name,
              value: value,
            }
          }),
        },
        // 被攻击点
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            period: 4,
            brushType: 'stroke',
            scale: 4,
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              color: 'red',
              formatter: '{b}',
              textStyle: {
                color: '#00f',
              },
            },
            emphasis: {
              show: true,
              color: '#0f0',
            },
          },
          symbol: 'pin',
          symbolSize: 50,
          data: [{
            name: item[0],
            value: PinDataValue.concat([10]),
          }],
        })
      })
      // eslint-disable-next-line no-unused-vars
      const option = {
        tooltip: {
          trigger: 'item',
          background: 'rgba(166,200,76,0.82)',
          borderColor: '#FFFFCC',
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: 'z-index:100',
          // formatter: function(params, ticket, callback) {
          //   // 根据业拓展要显示的内容
          //   let res = ''
          //   const name = params.name
          //   const value = params.value[params.seriesIndex + 1]
          //   res = "<span style='color:#fff'>" + name + '</span><br />数据' + value
          //   return res
          // },
        },
        // backgroundColor: '#013954',
        geo: {
          map: 'echartsMap',
          center: [113.43227, 22.98478],
          zoom: 1,
          label: {
            emphasis: {
              show: false,
            },
          },
          roam: true, // 是否允许缩放
          itemStyle: {
            normal: {
              color: 'rgba(51,69,89,0.5)', // 图片背景色
              borderColor: 'rgba(51,69,89,0.7)', // 省市边界线00fcff 516a89
              borderWidth: 1,

            },
            emphasis: {
              color: 'rgba(51,69,89,0.5)', // 悬浮背景
            },
          },
          // regions: [{
          //   name: '广东',
          //   itemStyle: {
          //     areaColor: 'rgba(0,0,0,0.5)',
          //     color: 'rgba(51,69,89,0.5)',
          //   },
          // }],
        },
        // geo: this.map,
        series: series,
      }
      console.log('series:', series)
      return option
      // myChart.setOption(option, true)
      // window.BM.echartsLayer(option).addTo(this.map)
      // echartsLayer
    },

  },
}
</script>

<style lang="scss">

.data-screen-map{
    text-align: center;
    height: 95%;
    // background: rgba(40,141,255,1)
}

// .my-div-icon{
//     background: #2f8;
//     border-radius: 13px;
// }

</style>
