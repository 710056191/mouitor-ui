import { findById } from '@/api/device'
import {
  StatusText,
  FaultStatusText,
} from '@/config/const/device/device-status'
import { format as dateFormat } from 'date-fns'

const deviceDetailFields = [
  { label: '点位编号', prop: 'selfCode' },
  { label: '点位位置', prop: 'selfLocation' },
  { label: '设备名称', prop: 'devName' },
  { label: '网络IP', prop: 'ip' },
  { label: '网络掩码', prop: 'mask' },
  { label: '网络网关', prop: 'getway' },
  { label: '网卡地址', prop: 'last6Mac' },
  { label: '设备箱状态', prop: 'status', formatter: val => StatusText[val] },
  { label: '设备箱故障状态', prop: 'faultStatus', formatter: val => FaultStatusText[val] },
  // { label: '关联设备状态', prop: 'relaStatusMap' },
  { label: '修改时间', prop: 'updateTime', formatter: val => dateFormat(val, 'YYYY-MM-DD HH:mm:ss') },
  { label: '警报代码', prop: 'alarmCode' },
  { label: '警报描述', prop: 'alarmDesc' },
  { label: '最近湿度(hPa)', prop: 'lastDampness' },
  { label: '最近温度(℃)', prop: 'lastTemperature' },
  { label: '最近电源电压(V)', prop: 'last12voltage' },
  { label: '远程服务器IP', prop: 'serverIP' },
  { label: '总包商', prop: 'totalManufacturerName' },
  { label: '电力供应商', prop: 'electricManufacturerName' },
  { label: '网络供应商', prop: 'networkManufacturerName' },
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

        return findById(config.id)
          .then((res) => {
            return res.data
          })
      },

      columns: [{ width: '150px' }],
    },
  }
}
