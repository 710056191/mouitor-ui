import { getContractList, findPage, ruleDelete } from '@/api/fee-rule'
import { deepFreeze } from '@/utils'
import { alarmsStr, ruleRoundingType, ruleType, unitStr } from '@/config/const/report/fee-rule-status'
import { format as dateFormat } from 'date-fns'
import { Message, MessageBox } from 'element-ui'

const columns = [
  {
    type: 'index',
    label: '序号',
  },
  {
    label: '计费方式',
    prop: 'ruleTypeId',
    minWidth: '',
    formatter: (row, col, val) => ruleType[val],
  },
  {
    label: '计费名称',
    prop: 'ruleName',
    minWidth: '200px',
    // width: '',
  },
  {
    label: '计费时间',
    prop: 'ruleTime',
    minWidth: '100px',
    // width: '',
  },
  {
    label: '计费单价',
    prop: 'priceStr',
    minWidth: '100px',
    // width: '',
  },
  {
    label: '最低费用',
    prop: 'totalPriceLowerLimit',
    minWidth: '80px',
    // width: '',
    formatter: (row, col, val) => {
      if (val) {
        return val + '元'
      } else {
        return ''
      }
    },
  },
  {
    label: '最高费用',
    prop: 'totalPriceUpperLimit',
    minWidth: '80px',
    // width: '',
    formatter: (row, col, val) => {
      if (val) {
        return val + '元'
      } else {
        return ''
      }
    },
  },
  {
    label: '计费规则',
    prop: 'ruleRoundingId',
    minWidth: '100px',
    // width: '',
    formatter: (row, col, val) => ruleRoundingType[val],
  },
  {
    label: '计费范围',
    prop: 'alarms',
    // width: '',
    formatter: (row, col, val) => alarmsStr[val],
  },
  {
    label: '创建时间',
    prop: 'createTime',
    minWidth: '200px',
    // width: '',
    formatter: (row, col, val) => dateFormat(val, 'YYYY-MM-DD HH:mm:ss'),
  },
  {
    label: '操作',
    prop: '',
    slotName: 'col_operation',
    minWidth: '',
    width: '280px',
    align: 'center',
  },
]

const formOptions = {
  inline: true,

  forms: [
    {
      label: '',
      prop: 'ruleTypeId',
      placeholder: '请选择计费方式',
      itemType: 'select',
      options: [
        { value: 2, label: '分层收费' },
        { value: 1, label: '分段收费' },
      ],
    },
    {
      label: '',
      prop: 'feeContractId',
      placeholder: '请选择合同编号',
      itemType: 'select',
      selectFetch: getContract,
    },
  ],
}

deepFreeze(columns)
deepFreeze(formOptions)

export async function getContract() {
  const temp = []
  await getContractList().then(res => {
    for (let i = 0; i < res.data.length; i++) {
      temp.push({
        value: res.data[i].id,
        label: res.data[i].contractCode })
    }
  })
  return temp
}

export const fetchHandler = (params) => {
  console.log(params)
  return findPage(params)
    .then(res => {
      res.data.result.forEach(item => {
        let unit = ''
        if (item.ruleTypeId === 2) {
          unit = unitStr[item.unitId]
        }

        if (item.rangeLowerLimit && item.rangeUpperLimit) {
          item.ruleTime = item.rangeLowerLimit + ' ~ ' + item.rangeUpperLimit + '小时'
        } else {
          item.ruleTime = '∞ ~ ∞'
        }

        item.priceStr = item.price + unit
      })
      return res
    })
}

export const tablePropsValue = () => {
  return {
    columns: columns,
    fetch: fetchHandler,
    // formOptions,
  }
}

export const confirmDeleteData = async(row = {}) => {
  const {
    ruleId,
    ruleName,
  } = row

  if (!ruleId) {
    Message.error('找不到 id ，无法删除')
    console.error('confirmDeleteUser cannot found user id', row)
    return
  }

  const descriptionTitle = ruleName

  const confirmTask = (task) => {
    const type = 'warning'
    return MessageBox.confirm(
      `此操作将删除计费方式 ${descriptionTitle} ，是否继续？`,
      '删除',
      {
        type,
        beforeClose(action, instance, done) {
          if (action !== 'confirm') {
            return done()
          }

          instance.confirmButtonLoading = true
          instance.confirmButtonText = '执行中...'

          task().finally(function() {
            instance.confirmButtonLoading = false
            done()
          })
        },
      })
      .catch(() => Promise.reject(null))
  }

  const deleteTask = async() => {
    await ruleDelete({ ruleId: ruleId })
      .catch(() => Promise.reject(null))

    Message.success(`${descriptionTitle} 已删除`)
  }

  try {
    await confirmTask(function() {
      return deleteTask()
    })

    return { success: true }
  } catch (thrown) {
    switch (typeof thrown) {
      case 'string':
        Message.error(thrown)
        break

      case 'object':
      default:
        thrown && console.error(thrown)
    }
  }
}
