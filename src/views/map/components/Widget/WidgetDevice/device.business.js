import {
  findById,
} from '@/api/device'

import {
  getType,
  fetchList as getRelatedDevices,
} from '@/api/sameMachine'

import {
  Status,
  FaultStatusText,
  StatusText,
} from '@/config/const/device/device-status'

export function loadDevice(id) {
  return findById(id)
    .then(res => res.data)
}

// 状态不正常，则设为错误状态
const faultStatusCssFormatter = (val, oriVal, prop, data) => {
  const isFault = data.status !== Status.normal
  return isFault ? 'color-danger' : ''
}

// 如果值不为空，则设为错误状态
const faultIfNoEmptyCssFormatter = val => {
  return val ? 'color-danger' : ''
}

const DeviceInfosFields = [
  [
    { label: '网络IP', prop: 'ip' },
    { label: '网络掩码', prop: 'mask' },
    { label: '网络网关', prop: 'getway' },
    { label: '网卡地址', prop: 'last6Mac' },
    { label: '远程服务器IP', prop: 'serverIP' },
  ],
  [
    {
      label: '设备箱状态', prop: 'status',
      formatter: val => StatusText[val],
      cssFormatter: faultStatusCssFormatter,
    },
    {
      label: '设备箱状态描述', prop: 'faultStatus',
      formatter: val => FaultStatusText[val],
      cssFormatter: faultIfNoEmptyCssFormatter,
    },
    { label: '警报代码', prop: 'alarmCode', cssFormatter: faultIfNoEmptyCssFormatter },
    { label: '警报描述', prop: 'alarmDesc', cssFormatter: faultIfNoEmptyCssFormatter },
    { label: '最近湿度(hPa)', prop: 'lastDampness' },
    { label: '最近温度(℃)', prop: 'lastTemperature' },
    { label: '最近电压(V)', prop: 'last12voltage' },
  ],
  [
    { label: '总包商', prop: 'totalManufacturerName' },
    { label: '电力供应商', prop: 'electricManufacturerName' },
    { label: '网络供应商', prop: 'networkManufacturerName' },
  ],
]

export function createDeviceDisplayInfos(data) {
  return DeviceInfosFields
    .map(
      chunkInfoList =>
        chunkInfoList.map(line => transformFieldHandler(line, data)),
    )
}

function transformFieldHandler(field, data) {
  const {
    prop,
    label,
    formatter,
    cssFormatter,
  } = field

  const oriValue = data[prop]
  let value = oriValue
  if (formatter && typeof formatter === 'function') {
    value = field.formatter(oriValue, prop, data, field)
  }

  let css = {}
  if (cssFormatter && typeof cssFormatter === 'function') {
    let result = field.cssFormatter(value, oriValue, prop, data, field)
    if (!result || typeof result === 'string' || Array.isArray(result)) {
      result = {
        valueCss: result,
      }
    }
    css = {
      ...{ labelCss: null, valueCss: null },
      ...result,
    }
  }

  return {
    label,
    value,
    css,
  }
}

export function loadRelatedDevices(selfCode) {
  return getRelatedDevices({
    selfCode,
    pageNumber: 1,
    pageSize: 100,
  })
    .then(res => res.data.result)
    .then(transformer)

  function transformer(list) {
    return list.map(device => {
      device.s || (device.s = {})

      device.s.statusText = StatusText[device.status]

      return device
    })
  }
}

export async function loadDeviceTypeMap() {
  const { data: DeviceTypes } = await getType()

  const DeviceTypeMap = DeviceTypes.reduce((obj, item) => {
    obj[item.id] = item
    return obj
  }, {})
  Object.freeze(DeviceTypeMap)
  return DeviceTypeMap
}
