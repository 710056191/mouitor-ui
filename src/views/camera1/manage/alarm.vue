<template>
  <div>
    <SuiteTable
      ref="table"
      :table-props="tableProps"
    />
  </div>
</template>

<script>
import { format as dateFormat } from 'date-fns'

import { findDevAlarm } from '@/api/camera'
import SuiteTable from '@/components/FormSuites/SuiteTable'

export default {
  name: 'CameraManageAlarm',
  components: {
    SuiteTable,
  },
  props: ['id'],

  data() {
    const tablePropsValue = () => {
      const columns = [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'devSelfCode',
          label: '点位编号',
        },
        {
          prop: 'devSelfLocation',
          label: '设备点位位置',
        },
        {
          prop: 'devName',
          label: '设备名称',
        },
        {
          prop: 'devIp',
          label: '网络IP',
        },
        {
          prop: 'alarmDesc',
          label: '警报描述',
        },
        {
          prop: 'alarmCreateTime',
          label: '时间',
          formatter: (row, column, val) => {
            return dateFormat(val, 'YYYY-MM-DD HH:mm:ss')
          },
        },
      ]

      columns.forEach(col => {
        col.minWidth = '-'
      })
      Object.freeze(columns)

      const transformData = (res) => {
        const {
          alarmList = [],
          device = {},
        } = res.data

        const deviceProps = {
          devSelfCode: device.selfCode,
          devSelfLocation: device.selfLocation,
          devName: device.devName,
          devIp: device.ip,
        }

        const list = alarmList.map(item => {
          return {
            ...deviceProps,
            alarmDesc: item.alarmDesc,
            alarmCreateTime: item.createTime,
          }
        })

        return {
          data: {
            result: list,
            total: list.length, // 该接口目前没有返回总数
          },
        }
      }

      const params = {
        devId: this.id ? this.id : '',
        pageSize: 8,
      }

      return {
        columns,

        fetch(params) {
          // console.log(params)
          if (params) {
            return findDevAlarm(params)
              .then(transformData)
          } else {
            return []
          }
        },

        params,
      }
    }

    return {
      tableProps: tablePropsValue(),
    }
  },
}
</script>

<style lang="sass">

</style>
