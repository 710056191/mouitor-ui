export const ruleTypeId = {
  section: 1,
  stratification: 2,
}

export const ruleType = {
  [ruleTypeId.section]: '分段计费',
  [ruleTypeId.stratification]: '分层计费',
}

export const ruleRoundingTypeId = {
  default: 0,
  rounding: 1,
  upper: 2,
  lower: 3,
}

export const ruleRoundingType = {
  [ruleRoundingTypeId.default]: '默认价格',
  [ruleRoundingTypeId.rounding]: '四舍五入',
  [ruleRoundingTypeId.upper]: '向前取整',
  [ruleRoundingTypeId.lower]: '向后取整',
}

export const alarmsStr = {
  '1,': '断网',
  '2,': '断电',
}

export const unitCode = {
  default: 1,
  oneDay: 2,
  twoDay: 3,
}

export const unitStr = {
  [unitCode.default]: '元/小时',
  [unitCode.oneDay]: '元/24小时',
  [unitCode.twoDay]: '元/48小时',
}
