import { getTempDeviceListById } from '@/api/temp-device'
import {
  StatusText,
  FaultStatusText,
} from '@/config/const/device/camera-status'
import { format as dateFormat } from 'date-fns'

const deviceDetailFields = [
  { label: '点位编号', prop: 'selfCode' },
  { label: '点位位置', prop: 'selfLocation' },
  { label: '设备名称', prop: 'selfName' },
  { label: '网络IP', prop: 'ip' },
  { label: '网络掩码', prop: 'mask' },
  { label: '网络网关', prop: 'getway' },
  { label: '网卡地址', prop: 'mac' },
  { label: '监测器状态', prop: 'status', formatter: val => StatusText[val] },
  { label: '监测器故障状态', prop: 'faultStatus', formatter: val => FaultStatusText[val] },
  // { label: '关联设备状态', prop: 'relaStatusMap' },
  { label: '修改时间', prop: 'updateTime', formatter: val => dateFormat(val, 'YYYY-MM-DD HH:mm:ss') },
  { label: '警报代码', prop: 'alarmCode' },
  { label: '警报描述', prop: 'alarmDesc' },
]

export function deviceDetailDialogValue() {
  return {
    visible: false,

    config: {
      fields: deviceDetailFields,

      params: null,

      fetch(config) {
        if (!config || !config.id) {
          throw new Error('No target id')
        }
        return getTempDeviceListById(config)
          .then((res) => {
            return res.data
          })
      },

      columns: [{ width: '150px' }],
    },
  }
}
