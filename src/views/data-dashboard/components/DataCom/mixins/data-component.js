export default {
  props: {
    info: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      chartInitOption: null,
      chartOption: null,
    }
  },

  watch: {
    info: {
      handler: function(val, old) {
        this.initChart()
      },
      deep: true,
    },
  },

  mounted() {
    this.initChart()
  },

  methods: {
    initChart() {
      const option = this.getChartOption()
      this.setMockData(option)
      const newOption = this.handleChartInfo(option)

      this.chartOption = newOption || option
    },

    // 覆盖该方法，提供默认配置
    getChartOption() {
      return {}
    },

    // 处理
    handleChartInfo(option) {
      // ...
    },

    // 覆盖改方法，用于开发时，手动 模拟 数据
    setMockData() {
      if (process.env.NODE_ENV === 'production') {
        // noinspection unnecessary return
        return
      }

      // option.xAxis[0].data = []
      // option.series[0].data = []
      // ...
    },
  },

}
