<template>
  <DataComWrapper
    :nest-border="true"
    title="异常报告"
  >
    <div class="DataComExceptionReport">
      <!-- <div class="empty-tip">暂无数据</div> -->
      <el-table
        ref="table"
        :data="info.list"
        height="265px"
      >
        <el-table-column
          prop="selfAddr2"
          label="地点"
        />
        <el-table-column
          prop="selfCode"
          label="点位编号"
          width="100"
        />
        <el-table-column
          prop="alarmDesc"
          label="状况"
          width="140"
        >
          <template slot-scope="scope">
            <span style="color:#ffd52b">{{ scope.row.alarmDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="时间"
        />
      </el-table>
    </div>
    <!-- <VueECharts
      v-show="false"
      :init-options="chartInitOption"
      :options="chartOption"
      autoresize
    /> -->

  </DataComWrapper>

</template>

<script>
import 'echarts'
import DataComponent from './mixins/data-component'
import mockChartData from './utils/mock-data/video-online-rate'
import DataComWrapper from './common/DataComWrapper'

export default {
  name: 'DataComExceptionReport',

  components: {
    DataComWrapper,
  },
  mixins: [DataComponent],

  data() {
    return {
      scrollInfoTime: null,
      dom: null,
    }
  },

  methods: {
    getChartOption() {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },

        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: '#18478b',
              },
              symbol: ['none', 'arrow'],
              symbolSize: 5,
            },
            axisLabel: {
              color: '#489eff',
            },
            axisTick: false,
            data: [],
          },
        ],
        yAxis: [
          {
            name: '在线率',
            type: 'value',
            nameGap: 20,
            nameRotate: 0.1, // trick: 用于将 name 居左显示
            axisLine: {
              lineStyle: {
                color: '#18478b',
              },
              symbol: ['none', 'arrow'],
              symbolSize: 5,
            },
            axisLabel: {
              show: false,
              color: '#489eff',
            },
            nameTextStyle: {
              color: '#489eff',
            },
            splitLine: {
              show: false,
            },
            axisTick: false,
          },
        ],

        series: [
          {
            name: '视频在线率',
            type: 'line',
            label: {
              show: true,
              position: 'top',
              color: '#288dff',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgb(8, 216, 195)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(8, 216, 195, 0)',
                  },
                ],
                global: false,
              },
            },
            itemStyle: {
              color: 'rgb(236, 214, 25)',
              borderColor: 'rgb(236, 214, 25)',
              shadowBlur: 10,
              shadowColor: 'rgb(236, 214, 25)',
            },
            lineStyle: {
              color: '#08D8C3',
            },
            symbol: 'circle',
            symbolSize: 5,
            data: [],
          },
        ],
      }
      return option
    },

    setMockData(option) {
      if (process.env.NODE_ENV === 'production') {
        return
      }
      option.xAxis[0].data = mockChartData.dateList
      option.series[0].data = mockChartData.rateList
    },

    mounted() {

    },

    handleChartInfo(e) {
      this.scrollInfoTime = setTimeout(this.scrollInfo, 3000)
    },

    scrollInfo() {
      // 获取需要绑定的table
      this.dom = this.$refs.table.bodyWrapper
      // 滚动距离 this.dom.scrollTop
      // 变量windowHeight是可视区的高度
      const windowHeight = this.dom.clientHeight || this.dom.clientHeight
      // console.log(windowHeight)
      // 变量scrollHeight是滚动条的总高度
      const scrollHeight = this.dom.scrollHeight || this.dom.scrollHeight
      if (this.dom.scrollTop + windowHeight === scrollHeight) {
        this.dom.scrollTop = 0
        return
      } else {
        this.dom.scrollTop = this.dom.scrollTop + 43 * 5
        return
      }
    },

  },
}
</script>

<style lang="scss">
.DataComExceptionReport {
  min-height: 250px;

  .empty-tip {
    text-align: center;
    padding-top: 20px;
    color: #ffd52b;
  }
  .el-table,/deep/ .el-table tr,/deep/ .el-table th,/deep/ .el-table td{
    background-color: transparent;
    border: none;
  }

  /deep/ .el-table td{
    color: #288dff;
    font-size: 14px;
  }

  /deep/ .el-table__body tr:hover,/deep/ .el-table__body tr:hover>td{
    background-color: #18478b
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar{
    display: none;
  }
  .el-table::before{
    background-color: transparent;
  }
  /deep/ .el-table__header thead tr th .cell{
    font-size: 16px;
  }

  /deep/ .el-table__body tbody tr td .cell{
    overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
  }
  /deep/ .el-table td{
    color: #288dff;
    font-size: 16px;
  }
}
</style>
