import dateFns from 'date-fns'
import { deepFreeze } from '@/utils'
import { getAlarmCount, getAlarmAnalyzeCount } from '@/api/report'

export const chartsConfig = [
  {
    label: '设备报警次数',
    key: 'AlarmCount',
    chart: {
      title: '设备报警次数分布图',
      xAxisProp: 'name',
      yAxisProp: 'y',
    },
  },
  {
    label: '设备报警时长',
    key: 'AlarmDuration',
    chart: {
      title: '设备报警时长分布图（单位：小时）',
      xAxisProp: 'name',
      yAxisProp: 'y',
    },
  },
]

export function generatePickerShortcutsOptions() {
  const shortcuts = [
    {
      text: '本周',
      onClick(picker) {
        const start = dateFns.startOfWeek(new Date())
        const end = new Date()
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '上周',
      onClick(picker) {
        const startDateOfCurrentWeek = dateFns.startOfWeek(new Date())
        const start = dateFns.subWeeks(startDateOfCurrentWeek, 1)
        const end = dateFns.subMilliseconds(startDateOfCurrentWeek, 1)
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '本月',
      onClick(picker) {
        const start = dateFns.startOfMonth(new Date())
        const end = new Date()
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '前一个月',
      onClick(picker) {
        const startDateOfCurrentMonth = dateFns.startOfMonth(new Date())
        const start = dateFns.subMonths(startDateOfCurrentMonth, 1)
        const end = dateFns.subMilliseconds(startDateOfCurrentMonth, 1)
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '前三个月',
      onClick(picker) {
        const startDateOfCurrentMonth = dateFns.startOfMonth(new Date())
        const start = dateFns.subMonths(startDateOfCurrentMonth, 3)
        const end = dateFns.subMilliseconds(startDateOfCurrentMonth, 1)
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '前六个月',
      onClick(picker) {
        const startDateOfCurrentMonth = dateFns.startOfMonth(new Date())
        const start = dateFns.subMonths(startDateOfCurrentMonth, 6)
        const end = dateFns.subMilliseconds(startDateOfCurrentMonth, 1)
        picker.$emit('pick', [start, end])
      },
    },
  ]

  return shortcuts
}

/**
 * 获取图表配置
 *
 * lines 为图表数据
 *
 * @param {Object} config
 * @param {Array<Object>} lines
 * @returns {Object}
 */
export function generateChartData(config, lines) {
  const { label, key, chart = {}} = config
  const { yAxisName = '', title, xAxisProp = 'key', yAxisProp = 'value' } = chart

  let option
  switch (key) {
    case 'AlarmCount':
      // option = getAlarmCountChartOption()
      option = getBaseChartOption()
      break
    case 'AlarmDuration':
      // option = getAlarmDurationChartOption()
      option = getBaseChartOption()
      break
    default:
      throw new Error('No matching configuration')
  }

  option.title.text = title || label

  const xAxisData = []
  const yAxisData = []
  lines && lines.forEach((line) => {
    const key = line[xAxisProp]
    const value = line[yAxisProp]
    xAxisData.push(key)
    yAxisData.push(value)
  })

  const seriesItem = option.series[0]
  option.xAxis.data = xAxisData
  seriesItem.data = yAxisData
  yAxisName && (option.yAxis.name = yAxisName)

  return option
}

function getBaseChartOption() {
  // const option = {
  //   color: ['#3398db'],
  //   title: {
  //     text: '设备报警次数分布图',
  //     left: 'center',
  //     textStyle: {
  //       color: 'rgba(255, 255, 255, 0.8)',
  //     },
  //   },
  //   tooltip: {
  //     trigger: 'axis',
  //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
  //       type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
  //     },
  //   },
  //   grid: {
  //     left: '3%',
  //     right: '4%',
  //     bottom: '3%',
  //     containLabel: true,
  //   },
  //   xAxis: [{
  //     type: 'category',
  //     data: [],
  //     axisLine: {
  //       lineStyle: {
  //         color: 'rgba(255, 255, 255, 0.8)',
  //       },
  //     },
  //     axisLabel: {
  //       interval: 0,
  //       rotate: 30,
  //     },
  //   }],
  //   yAxis: [{
  //     type: 'value',
  //     axisLine: {
  //       lineStyle: {
  //         color: 'rgba(255, 255, 255, 0.8)',
  //       },
  //     },
  //   }],
  //   series: [{
  //     name: '数量',
  //     type: 'bar',
  //     barWidth: '50%',
  //     label: {
  //       normal: {
  //         show: true,
  //         position: 'top',
  //       },
  //     },
  //     itemStyle: {
  //       normal: {
  //         color: function(params) {
  //           // build a color map as your need.
  //           const colorList = ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5',
  //             '#8378EA', '#96BFFF']
  //           return colorList[params.dataIndex]
  //         },
  //       },
  //     },
  //     // data: [1, 2, 3, 4, 5, 6, 7, 8, 188]
  //     data: [],
  //   }],
  // }
  return {
    title: {
      text: '', // 标题
      textStyle: {
        fontWeight: 'normal ',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
      // data: [], // 数据
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        // data: [], // 数据
        type: 'bar',
        stack: 'total',
        symbolSize: 10,
        symbol: 'circle',
        smooth: true,
        itemStyle: {
          normal: {
            color: '#409EFF',
            label: {
              show: true,
              position: 'top', // 横向的时候要改成 right
              formatter(p) {
                return p.value > 0 ? p.value : ''
              },
            },
          },
        },
      }],
  }
}

// 根据配置，从服务器加载图表数据
export function loadChartDataByConfig(config, params) {
  const { key } = config

  return requestChartData(key, params).then(response => {
    return deepFreeze(response.data)
  })
}

// 请求图表数据
function requestChartData(key, params) {
  let requestFunc
  switch (key) {
    case 'AlarmCount':
      requestFunc = getAlarmCount
      break
    case 'AlarmDuration':
      requestFunc = getAlarmAnalyzeCount
      break
    default:
      throw new Error('No matching key')
  }

  return requestFunc(params)
}
