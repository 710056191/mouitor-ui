import { deepFreeze } from '@/utils'
import { format as dateFormat } from 'date-fns'

import { findById } from '@/api/fee-rule'

import { ruleType, ruleRoundingType, alarmsStr, unitStr } from '@/config/const/report/fee-rule-status'

let unit = '元/小时'
// 分层收费
const FeeRuleStratificationDialogDetailFields = [
  { label: '计费方式', prop: 'ruleTypeId', formatter: val => ruleType[val] },
  { label: '计费名称', prop: 'ruleName' },
  { label: '计费时间', prop: 'ruleTime', formatter: val => val + '小时' },
  { label: '计费单价', prop: 'price', formatter: val => val + unit },
  { label: '最低费用', prop: 'totalPriceLowerLimit', formatter: val => val ? val + '元' : '' },
  { label: '最高费用', prop: 'totalPriceUpperLimit', formatter: val => val ? val + '元' : '' },
  { label: '计费规则', prop: 'ruleRoundingId', formatter: val => ruleRoundingType[val] },
  { label: '计费范围', prop: 'alarms', formatter: val => alarmsStr[val] },
  { label: '创建时间', prop: 'createTime', formatter: val => dateFormat(val, 'YYYY-MM-DD HH:mm:ss') },
]

// 分段收费
const FeeRuleSectionDialogDetailFields = [
  { label: '计费方式', prop: 'ruleTypeId', formatter: val => ruleType[val] },
  { label: '计费名称', prop: 'ruleName' },
  { label: '计费时间', prop: 'ruleTime', formatter: val => val + '小时' },
  { label: '计费范围', prop: 'alarms', formatter: val => alarmsStr[val] },
  { label: '创建时间', prop: 'createTime', formatter: val => dateFormat(val, 'YYYY-MM-DD HH:mm:ss') },
]

FeeRuleStratificationDialogDetailFields.forEach(field => {
  field.label += '：'
})

FeeRuleSectionDialogDetailFields.forEach(field => {
  field.label += '：'
})

deepFreeze(FeeRuleStratificationDialogDetailFields)

export function FeeRuleDialogValue(value) {
  return {
    visible: false,

    config: {
      fields: value === '2' ? FeeRuleStratificationDialogDetailFields : FeeRuleSectionDialogDetailFields,

      params: null,

      fetch(params) {
        if (!params || !params.ruleId) {
          throw new Error('No target ruleId')
        }

        return findById({ ruleId: params.ruleId }).then((res) => {
          if (res.data.ruleTypeId === 2) {
            unit = unitStr[res.data.unitId]
          }

          if (res.data.rangeLowerLimit && res.data.rangeUpperLimit) {
            res.data.ruleTime = res.data.rangeLowerLimit + ' ~ ' + res.data.rangeUpperLimit
          } else {
            res.data.ruleTime = '∞ ~ ∞'
          }

          return res.data
        })
      },
    },
  }
}

