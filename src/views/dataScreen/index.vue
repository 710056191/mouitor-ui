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
        element-loading-background="rgba(11, 13, 48, 0.8)"
        class="dashboard-main"
      >
        <div class="panel-vertical panel-main">
          <!-- 报警信息 -->
          <MapData :info="deviceList" />
        </div>

        <div class="panel-vertical">
          <!-- 地图 -->
          <!-- <DataScreen /> -->
          <!-- <Map :data="deviceList" :info="configInfo" /> -->
          <Map :childdata="childData" />

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import DataScreen from './components/DataScreen'
import MapData from './components/mapData'
import { format as dateFormat } from 'date-fns'
import { getDevice } from '@/api/map'
import Map from './test/Map'
import { getConfigInfo } from '@/api/config'

export default {
  name: 'Index',
  components: {
    DataScreen,
    MapData,
    Map,
  },
  data() {
    return {
      timestamp: Date.now(),
      deviceList: [],
      configInfo: {},
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
    childData() {
      return {
        data: this.deviceList,
        info: this.configInfo,
      }
    },

  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const { data: deviceList } = await getDevice()
      this.deviceList = deviceList
      await getConfigInfo()
        .then(res => {
          // console.log(res)
          this.configInfo = res.data.server
        })
      // console.log(this.deviceList)
      setTimeout(this.getData, 1 * 60 * 1000)
    },
  },
}
</script>

<style lang="scss">
@import './data-dashboard.scss';
@import './components/com-common.scss';

// .data-screen{
//     width: 100%;
//     height: 100%;
//     background:
// }

</style>
