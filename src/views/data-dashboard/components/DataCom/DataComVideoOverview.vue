<template>
  <DataComWrapper
    title="视频实时数据"
    class="data-com-video-overview-wrapper"
  >
    <VueECharts
      :init-options="chartInitOption"
      :options="chartOption"
      autoresize
    />
  </DataComWrapper>
</template>

<script>
import 'echarts'
import VueECharts from 'vue-echarts'
import DataComponent from './mixins/data-component'
import mockChartData from './utils/mock-data/video-overview'
import DataComWrapper from './common/DataComWrapper'

export default {
  name: 'DataComVideoOverview',

  components: {
    DataComWrapper,
    VueECharts,
  },

  mixins: [DataComponent],

  data() {
    return {
      /*  */
    }
  },

  methods: {
    getChartOption() {
      const COLOR = {
        normal: '#288dff',

        active: '#1ad3c1',

        inactive: '#ffd52b',
      }

      const option = {
        title: {
          text: '视频接入总数',
          subtext: '--',

          top: '38%',
          left: '2%',

          textStyle: {
            fontSize: 14,
            color: COLOR.normal,
          },

          subtextStyle: {
            fontSize: 36,
            fontWeight: 'bold',
            fontStyle: 'oblique',
            color: COLOR.normal,
          },
        },

        tooltip: {
          trigger: 'item',
          formatter: '{b} : {d}%',
        },

        series: [
          {
            name: '视频实时数据',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['61.8%', '50%'],
            data: [],

            itemStyle: {
              color(params) {
                // console.log('itemStyle color callback', params)
                const data = params.data || {}
                const status = data.status

                return status === 'inactive' ? COLOR.inactive : COLOR.active
              },
            },

            label: {
              show: true,

              formatter(params = {}) {
                // console.log('label formatter', params)

                const {
                  percent, name,
                  data = {},
                } = params
                const status = data.status

                const percentRich = status === 'inactive' ? 'inactive' : 'active'
                return `${name} {${percentRich}|${percent}%}`
              },

              color: COLOR.normal,

              rich: {
                active: {
                  color: COLOR.active,
                },

                inactive: {
                  color: COLOR.inactive,
                },
              },
            },

            labelLine: {
              show: true,
              lineStyle: {
                color: COLOR.normal,
              },
              length: 25,
              length2: 15,
            },

            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }

      return option
    },

    setMockData(option) {
      if (process.env.NODE_ENV === 'production') {
        return
      }
      option.title.subtext = mockChartData.total
      option.series[0].data = mockChartData.seriesData
    },

    handleChartInfo(option) {
      // console.log('handleChartInfo', this.info)

      const info = this.info || {}

      option.title.subtext = info.cameraTotal

      const seriesData = [
        { value: info.cameraErrRate, name: '视频离线率', status: 'inactive' },
        { value: info.cameraOnline, name: '视频在线率' },
      ]

      option.series[0].data = seriesData
    },
  },

}
</script>

<style lang="scss">
.data-com-video-overview-wrapper {
  .data-com-box {
    .echarts {
      height: 200px;
    }

    .content-box {

      // 缩小边框 padding ，为 chart 争取空间
      padding-top: 10px;
      padding-bottom: 5px;
    }
  }
}
</style>
