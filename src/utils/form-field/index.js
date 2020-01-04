// 使用 ElFormRenderer 组件时的帮助函数

import {
  requiredRule,
} from './validate-rules/basic'

export function complementFields(fields) {
  // complement field:
  //
  // type:
  // 若未定义，默认设置为 input
  //
  // field:
  // 生成 input, select 的 placeholder
  // select 添加 clearable 可清空选项 属性
  //
  // rule:
  // 填充 rule 的 fullField 属性
  // 以及默认给没有 rules 属性( rules === undefined, null 不算)的 item 加上 requiredRule

  return fields.map(iterator)

  function iterator(item) {
    item = Object.assign({}, {
      type: 'input',
    }, item)

    const {
      type,
      label,
      el = {},
    } = item

    // field
    item.el = Object.assign({
      placeholder: (type === 'select' ? '请选择' : '请输入') + label,
    }, el)

    if (item.type === 'select') {
      item.el.clearable = true
    }

    // rule
    let rules = item.rules
    if (rules === undefined) {
      rules = [requiredRule]
    }

    if (rules && Array.isArray(rules) && rules.length) {
      item.rules = rules.map(rule =>
        Object.assign({ fullField: item.label }, rule),
      )
    }

    // item.label += '：'
    return item
  }
}
