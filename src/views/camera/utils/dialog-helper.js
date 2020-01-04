import { deepFreeze } from '@/utils'
import { format as dateFormat } from 'date-fns'

import {
  getById,
} from '@/api/camera'

import {
  StatusText as CameraStatusText,
  FaultStatusText as CameraFaultStatusText,
} from '@/config/const/device/camera-status'

const CameraManageDialogDetailFields = [
  { label: '点位编号', prop: 'selfCode' },
  { label: '点位位置', prop: 'selfLocation' },
  { label: '设备名称', prop: 'devName' },
  { label: '网络IP', prop: 'ip' },
  { label: '端口号', prop: 'port' },
  { label: '网络掩码', prop: 'mask' },
  { label: '网络网关', prop: 'getway' },
  { label: '网卡地址', prop: 'mac' },
  { label: '接口编号', prop: 'outputNumber' },
  { label: '设备状态', prop: 'status', formatter: val => CameraStatusText[val] },
  { label: '设备故障状态', prop: 'faultStatus', formatter: val => CameraFaultStatusText[val] },
  { label: '修改时间', prop: 'updateTime', formatter: val => dateFormat(val, 'YYYY-MM-DD HH:mm:ss') },
  { label: '警报代码', prop: 'alarmCode' },
  { label: '警报描述', prop: 'alarmDesc' },
  { label: '总包商', prop: 'totalManufacturerName' },
  { label: '电力供应商', prop: 'electricManufacturerName' },
  { label: '网络供应商', prop: 'networkManufacturerName' },
]
CameraManageDialogDetailFields.forEach(field => {
  field.label += '：'
})
deepFreeze(CameraManageDialogDetailFields)

export function CameraManageDetailDialogValue() {
  return {
    visible: false,

    config: {
      fields: CameraManageDialogDetailFields,

      params: null,

      fetch(config) {
        if (!config || !config.devid) {
          throw new Error('No target deviceId')
        }

        return getById({ deviceId: config.devid })
          .then((res) => {
            return res.data
          })
      },
    },
  }
}
