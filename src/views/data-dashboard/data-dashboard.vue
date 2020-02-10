<template>
  <div class="data-dashboard-view">
    <div class="data-dashboard-wrap">
      <div class="data-dashboard-boundary"></div>

      <!-- 标题 -->
      <header class="dashboard-header">
        <h1 class="header-title">安防运维数据中心</h1>

        <div class="time-area">
          <p>{{ timeDate }}</p>
          <p>{{ timeNumber }}</p>
        </div>
      </header>

      <!-- 内容 -->
      <div
        v-loading="loading"
        element-loading-background="rgba(11, 13, 48, 0.8)"
        class="dashboard-main"
      >
        <div class="panel-vertical">
          <!-- 视频在线率统计 -->
          <DataComVideoOnlineRate
            :info="onlineRateInfo"
          />

          <!-- 视频实时数据 -->
          <DataComVideoOverview
            :info="videoOverviewInfo"
          />

          <!-- 视频数据排行表 -->
          <DataComVideoLeaderBoard
            v-if="mCtrl"
            :info="videoLeaderBoardInfo"
          />

        </div>

        <div class="panel-vertical panel-main">
          <!-- 异常报告 -->
          <DataComExceptionReport
            :info="videoRankInfo"
          />

          <!-- 设备实时数据 -->
          <DataComDeviceOverview
            :info="deviceOverviewInfo"
          />

          <!-- 故障数量统计 -->
          <DataComFailCount
            :info="failCountInfo"
          />
        </div>

        <div class="panel-vertical">
          <!-- 电力网络质量趋势图 -->
          <DataComPowerNetworkException
            :info="powerNetworkExceptionInfo"
          />

          <!-- 断电、断网统计 -->
          <DataComPowerNetworkFailCount
            :info="powerNetworkFailCountInfo"
          />

          <!-- 工单进度统计 -->
          <DataComWorkOrder
            :info="workOrderInfo"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import DataComVideoOnlineRate from './components/DataCom/DataComVideoOnlineRate'
import DataComVideoOverview from './components/DataCom/DataComVideoOverview'
import DataComExceptionReport from './components/DataCom/DataComExceptionReport'
import DataComPowerNetworkException from './components/DataCom/DataComPowerNetworkException'
import DataComVideoLeaderBoard from './components/DataCom/DataComVideoLeaderBoard'
import DataComPowerNetworkFailCount from './components/DataCom/DataComPowerNetworkFailCount'
import DataComFailCount from './components/DataCom/DataComFailCount'
import DataComDeviceOverview from './components/DataCom/DataComDeviceOverview'

import { format as dateFormat } from 'date-fns'
import DataComWorkOrder from '@/views/data-dashboard/components/DataCom/DataComWorkOrder'

import monitorBigScreenApi from '@/api/monitorBigScreen'
import workOrderApi from '@/api/workorder'
import { parseTime } from '@/utils'
import { getAll } from '@/views/monitor/utils'

export default {
  name: 'DataDashboard',
  components: {
    DataComWorkOrder,
    DataComDeviceOverview,
    DataComFailCount,
    DataComPowerNetworkFailCount,
    DataComVideoLeaderBoard,
    DataComPowerNetworkException,
    DataComExceptionReport,
    DataComVideoOverview,
    DataComVideoOnlineRate,
  },

  data() {
    return {
      mCtrl: true,

      loading: true,

      timestamp: Date.now(),

      cameraTotal: 0,
      cameraErrRate: 0,
      cameraOnline: 0,
      boxTotal: 0,
      boxOnline: 0,
      boxErr: 0,
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
      workOrder: [],
      actualDataTimer: null,
      dataTimer: null,
      orderDataTimer: null,
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
      listQuery: {
        // 工单进度统计请求参数
        selfCode: '',
        selfLocation: '',
        pageNumber: 1,
        pageSize: 5,
      },
      pages: 0, // 工单进度统计数据分页总数
    }
  },

  computed: {
    timeDate() {
      const timestamp = this.timestamp
      return dateFormat(timestamp, 'YYYY年MM月DD日')
    },

    timeNumber() {
      const timestamp = this.timestamp
      return dateFormat(timestamp, 'HH:mm')
    },

    // 各大模块数据
    onlineRateInfo() {
      return { list: this.cameraLineChart, date: this.dates }
    },

    videoOverviewInfo() {
      return {
        cameraTotal: +this.cameraTotal,
        cameraErrRate: +this.cameraErrRate,
        cameraOnline: +this.cameraOnline,
      }
    },

    videoRankInfo() {
      return {
        list: this.errReport,
      }
    },

    videoLeaderBoardInfo() {
      return {
        list: this.cameraRoundList || [],
      }
    },

    deviceOverviewInfo() {
      return {
        boxTotal: this.boxTotal,
        boxOnline: this.boxOnline,
        boxErr: this.boxErr,
      }
    },

    failCountInfo() {
      return {
        list: this.errTotalCharts,
      }
    },

    powerNetworkExceptionInfo() {
      return {
        charts: this.errMonthCharts,
      }
    },

    powerNetworkFailCountInfo() {
      return {
        noNetCount: this.noNetCount,
        noNetDuration: this.noNetDuration,
        noElecCount: this.noElecCount,
        noElecDuration: this.noElecDuration,
      }
    },

    workOrderInfo() {
      return { list: this.workOrder }
    },

  },

  mounted() {
    this.initTimestampInterval()

    this.getData()
    this.getActualData()
    this.getWorkOrderData()
    setTimeout(() => {
      this.loading = false
    }, 1e3)
  },

  beforeDestroy() {
    clearTimeout(this.actualDataTimer)
    clearTimeout(this.dataTimer)
  },

  methods: {
    initTimestampInterval() {
      const handler = () => {
        this.updateTimestamp()
      }

      const intervalID = setInterval(handler, 800)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(intervalID)
      })
    },

    updateTimestamp() {
      this.timestamp = Date.now()
    },

    getActualData() {
      this.dates = getAll(this.query.startDate, this.query.endDate)
      this.dates.splice(this.dates.length - 1, 1)

      // 获取视频加监控终端的总数  异常数量
      monitorBigScreenApi.devCount().then(ret => {
        this.cameraTotal = ret.data.allCamera
        const cameraErrRate = (ret.data.cameraErr * 100 / ret.data.allCamera).toFixed(2)
        this.cameraErrRate = cameraErrRate
        this.cameraOnline = 100 - cameraErrRate
        this.boxTotal = ret.data.allBox
        this.boxErr = ret.data.devErrTotal
        this.boxOnline = ret.data.allDev - this.boxTotal
        // this.timer = setTimeout(this.getData, 5000)
      })

      // 异常报告数据
      monitorBigScreenApi.errorDetail().then(ret => {
        if (ret.data.length > 0) {
          // console.log('异常报告：', ret.data)
          this.errReport = ret.data
        }
      })

      this.query.selectType = 'total'
      // 获取设备异常总数
      monitorBigScreenApi.getErrCount(this.query).then(ret => {
        const data = []
        for (let i = 0; i < ret.data.length; i++) {
          if (ret.data[i].deviceName) {
            data.push(ret.data[i])
          }
        }
        this.errTotalCharts = data
      })

      // 视频数据排行表
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
        // console.log('视频数据排行榜：', list)
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
    getWorkOrderData() {
      // 获取工单进度统计表
      workOrderApi.findPage(this.listQuery).then(res => {
        // console.log(res)
        this.pages = res.data.pages
        this.workOrder = res.data.result
      })
      this.orderDataTimer = setTimeout(this.loadWorkOrder, 5000)
    },
    loadWorkOrder() {
      // 每触发一次定时器，请求下一页数据
      const pages = this.pages
      if (this.listQuery.pageNumber < pages) {
        this.listQuery.pageNumber += 1
        this.getWorkOrderData()
        return
      } else {
        this.listQuery.pageNumber = 1
        this.getWorkOrderData()
        return
      }
    },
  },
}
</script>

<style lang="scss">
@import "./data-dashboard";
@import "./components/DataCom/com-common";
</style>
