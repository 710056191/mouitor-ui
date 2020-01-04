<template>
  <div class="monitor-container">
    <!-- 视频在线率折线图 -->
    <div>
      <cameraLineChart :data="cameraLineChart" :date="dates" />
    </div>

    <!-- 视频统计 -->
    <div>
      <cameraOnlineRate :camera-total="cameraTotal" :camera-err-rate="cameraErrRate" :camera-online="cameraOnline" />
    </div>

    <!-- 视频排行榜 -->
    <div>
      <cameraRound :data-list="cameraRoundList" />
    </div>

    <!-- 设备箱 -->
    <div>
      <devBox :box-total="boxTotal" :box-online="deviceTotal" :box-err="deviceErr" />
    </div>

    <!-- 异常报告 -->
    <div>
      <warningReporter :err-report="errReport" />
    </div>

    <!-- 断电断网统计 -->
    <div>
      <netAndElecTotal :no-net-count="noNetCount" :no-net-duration="noNetDuration" :no-elec-count="noElecCount" :no-elec-duration="noElecDuration" />
    </div>

    <!-- 设备异常统计 -->
    <div>
      <errTotal :data-list="errTotalCharts" />
    </div>

    <!-- 断电断网折线图 -->
    <div>
      <errMonth :data="errMonthCharts" />
    </div>

  </div>
</template>

<script>
import cameraOnlineRate from './components/CameraOnlineRateComponent'
import devBox from './components/DevBoxComponent'
import warningReporter from './components/WarningReporterComponent'
import netAndElecTotal from './components/NetAndElecTotal'
import errTotal from './components/ErrTotalChartsComponent'
import errMonth from './components/ErrMonthChartsComponent'
import cameraLineChart from './components/CameraOnlineLineChartComponent'
import cameraRound from './components/CameraOnlineRoundComponent'

import monitorBigScreenApi from '@/api/monitorBigScreen'
import { parseTime } from '@/utils'
import { getAll } from '@/views/monitor/utils'
export default {
  name: 'Bg',
  components: {
    cameraOnlineRate, devBox, warningReporter, netAndElecTotal, errTotal, errMonth, cameraLineChart, cameraRound,
  },
  data() {
    return {
      cameraTotal: 0,
      cameraErrRate: 0,
      cameraOnline: 0,
      boxTotal: 0,
      deviceTotal: 0,
      deviceErr: 0,
      noNetCount: 0,
      noNetDuration: 0,
      noElecCount: 0,
      noElecDuration: 0,
      errReport: [],
      errTotalCharts: [],
      errMonthCharts: {},
      cameraLineChart: [],
      dates: [],
      cameraRoundList: [],
      actualDataTimer: null,
      dataTimer: null,
      query: {
        startDate: parseTime(new Date(), '{y}-{m}-01'),
        endDate: parseTime(new Date(), '{y}-{m}-{d}'),
        // startDate: '2019-08-01',
        // endDate: '2019-08-31',
        selfCode: '',
        ipStart: '',
        ipEnd: '',
        city: '广州市',
        selectType: 'total',
      },
    }
  },
  mounted() {
    this.getData()
    this.getActualData()
  },
  beforeDestroy() {
    clearTimeout(this.actualDataTimer)
    clearTimeout(this.dataTimer)
  },
  methods: {
    getActualData() {
      this.dates = getAll(this.query.startDate, this.query.endDate)
      this.dates.splice(this.dates.length - 1, 1)

      // 获取视频加监控终端的总数  异常数量
      monitorBigScreenApi.devCount().then(ret => {
        this.cameraTotal = ret.data.allCamera
        const cameraErrRate = (ret.data.cameraErr * 100 / ret.data.allCamera).toFixed(2)
        this.cameraErrRate = cameraErrRate
        this.cameraOnline = 100 - cameraErrRate
        // this.timer = setTimeout(this.getData, 5000)
      })

      // 异常报告数据
      monitorBigScreenApi.errorDetail().then(ret => {
        if (ret.data.length > 0) {
          this.errReport = ret.data
        }
      })

      this.query.selectType = 'total'
      // 获取设备异常总数
      monitorBigScreenApi.getErrCount(this.query).then(ret => {
        const data = []
        this.boxTotal = 0
        this.deviceTotal = 0
        this.deviceErr = 0
        for (let i = 0; i < ret.data.length; i++) {
          if (ret.data[i].deviceName) {
            data.push(ret.data[i])
          }
        }
        this.errTotalCharts = data
      })

      monitorBigScreenApi.getCameraCountRound(this.query).then(ret => {
        const list = []
        ret.data.forEach(item => {
          if (item.rate !== null && item.rate !== undefined) {
            list.push(item)
          }
        })

        list.sort((a, b) => {
          return a.rate - b.rate
        })

        this.cameraRoundList = list
      })

      this.actualDataTimer = setTimeout(this.getActualData, 10000)
    },
    getData() {
      // 获取断电断网总数
      monitorBigScreenApi.countDuration(this.query).then(ret => {
        ret.data.forEach(item => {
          if (item.alarmDesc === '网络已断开') {
            this.noNetCount = item.alarmCount
            this.noNetDuration = (item.duration / 60 / 1000).toFixed(2)
          }
          if (item.alarmDesc === '断电报警') {
            this.noElecCount = item.alarmCount
            this.noElecDuration = (item.duration / 60 / 1000).toFixed(2)
          }
        })
      }).then(() => {
        // 按日期获取设备异常数
        this.query.all = 'months'

        monitorBigScreenApi.countDuration(this.query).then(ret => {
          const data = {}
          for (let i = 0; i < ret.data.length; i++) {
            if (ret.data[i].deviceName) {
              if (!data[ret.data[i].alarmDesc]) {
                data[ret.data[i].alarmDesc] = []
              }
              data[ret.data[i].alarmDesc].push(ret.data[i])
            }
          }
          data['日期'] = this.dates

          this.errMonthCharts = data
        })
      })
      monitorBigScreenApi.getCameraData(this.query).then(ret => {
        this.cameraLineChart = ret.data
      })
      this.dataTimer = setTimeout(this.getData, 1 * 60 * 60 * 1000)
    },
  },
}
</script>

<style scoped>

</style>
