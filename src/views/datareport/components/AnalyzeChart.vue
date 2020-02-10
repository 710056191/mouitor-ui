<template>
  <div class="analyze-chart">
    <div
      ref="chartElem"
      class="chart-wrap"
      :class="{'chart-crosswise-wrap': isCrosswise}"
    ></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { generateChartData, loadChartDataByConfig } from '../utils'
import resize from './mixins/resize'

export default {
  name: 'AnalyzeChart',

  mixins: [resize],

  props: {
    config: {
      type: Object,
      required: true,
    },

    data: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      chart: null,

      internalChartData: null,
    }
  },

  computed: {
    isCrosswise() {
      let b = false
      try {
        if (this.config.chart.type === 'crosswise-bar') {
          b = true
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
      }
      return b
    },

    colItems() {
      return this.config.table && this.config.table.items
    },
  },

  watch: {
    data(val) {
      this.internalChartData = val
      this.updateChartOptions()
    },
  },

  mounted() {
    this.initChart()
  },

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    async loadData() {
      const data = await loadChartDataByConfig(this.config)
      this.internalChartData = data
      console.log('[AnalyzeChart] loadData', data)
    },

    async initChart() {
      // 获取基本配置
      // 加载数据
      // 设置 chart option

      // await this.loadData()
      this.chart = echarts.init(this.$refs.chartElem)
      this.updateChartOptions()
    },

    updateChartOptions() {
      const options = generateChartData(this.config, this.internalChartData)
      this.chart.setOption(options)
    },
  },
}

</script>

<style lang="scss" scoped>
  .analyze-chart {
    .chart-wrap {
      position: relative;
      width: 100%;
      height: 500px;
      padding: 20px;

      &.chart-crosswise-wrap {
        height: 900px;
      }
    }

    .table-list-wrap {
      padding: 30px 20px;
    }
  }

</style>
