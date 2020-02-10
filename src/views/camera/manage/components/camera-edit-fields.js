import { deepFreeze } from '@/utils'
import {
  isIpv4Address,
  isPortNumber,
} from '@/utils/validation/network'

import {
  Status as CameraStatus,
} from '@/config/const/device/camera-status'

const requiredRule = {
  required: true,
  trigger: 'blur',
  validator(rule, value, callback) {
    if (!value || value.length < 1) {
      callback(new Error(`${rule.fullField}不能为空`))
    } else {
      callback()
    }
  },
}

const ipv4AddressRule = {
  message: 'IP 格式不正确',
  validator(rule, value, callback) {
    if (!value || typeof value !== 'string') {
      return callback()
    }

    isIpv4Address(value)
      ? callback()
      : callback(new Error())
  },
}

const interfaceNumberRule = {
  validator(rule, value, callback) {
    if (!value || typeof value !== 'string') {
      return callback()
    }
    const isValid = value && /^0[0-8]$/.test(value)
    callback(isValid ? undefined : new Error('接口编号仅支持01 ~ 08八种输入'))
  },
}

const portNumberRule = {
  message: '端口号不正确',
  validator(rule, value, callback) {
    if (!value || typeof value !== 'string') {
      return callback()
    }

    return isPortNumber(value)
      ? callback()
      : callback(new Error())
  },
}

const Fields = [
  {
    id: 'selfCode',
    label: '点位编号',
  },
  {
    id: 'selfAddr1',
    label: '点位路名',
  },
  {
    id: 'selfAddr2',
    label: '点位位置',
  },
  {
    id: 'devName',
    label: '设备名称',
  },
  {
    id: 'ip',
    label: '网络IP',
    rules: [requiredRule, ipv4AddressRule],
  },
  {
    id: 'port',
    label: '端口号',
    rules: [requiredRule, portNumberRule],
  },
  {
    id: 'mask',
    label: '网络掩码',
    rules: [ipv4AddressRule], // todo: 是否需要更具体的限制
  },
  {
    id: 'getway',
    label: '网络网关',
    rules: [ipv4AddressRule],
  },
  {
    id: 'mac',
    label: '网卡地址',
    rules: [],
  },
  {
    id: 'outputNumber',
    label: '接口编号',
    rules: [requiredRule, interfaceNumberRule],
  },
  // {
  //   id: 'modelNumber',
  //   label: '设备型号',
  // },
  {
    id: 'totalManufacturerId',
    label: '总包商',
    type: 'select',
    rules: [],
  },
  {
    id: 'electricManufacturer',
    label: '电力供应商',
    type: 'select',
    rules: [],
  },
  {
    id: 'networkManufacturer',
    label: '网络供应商',
    type: 'select',
    rules: [],
  },
  {
    id: 'status',
    label: '是否启用设备',
    type: 'switch',
    el: {
      activeText: '启用',
      activeValue: 'active',
      inactiveText: '不启用',
      inactiveValue: 'inactive',
    },
    inputFormat(data) {
      const disable = data.status === CameraStatus.initialized
      const active = !disable
      return active ? 'active' : 'inactive'
    },
    outputFormat(value) {
      const active = value === 'active'
      return active ? CameraStatus.normal : CameraStatus.initialized
    },
    rules: null,
  },
]

// complement field:
//
// field:
// select 添加 clearable 可清空选项 属性
//
// rule:
// 填充 rule 的 fullField 属性
// 以及默认给没有 rules 属性( rules === undefined)的 item 加上 requiredRule
Fields.forEach(field => {
  // field
  if (field.type === 'select') {
    field.el || (field.el = {})
    field.el.clearable = true
  }

  // rule
  let rules = field.rules
  if (rules === undefined) {
    rules = [requiredRule]
  }

  if (rules && Array.isArray(rules) && rules.length) {
    field.rules = rules.map(rule =>
      Object.assign({ fullField: field.label }, rule),
    )
  }
})

deepFreeze(Fields)

const formContentValue = () => {
  return Fields
    .map(item => {
      item = Object.assign({}, {
        type: 'input',
      }, item)

      const {
        type,
        label,
        el = {},
      } = item

      item.el = Object.assign({
        placeholder: (type === 'select' ? '请选择' : '请输入') + label,
      }, el)

      // item.label += '：'
      return item
    })
}

export {
  Fields,
  formContentValue,
}
