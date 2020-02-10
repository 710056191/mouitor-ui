/*
网络相关 检验函数
 */

export function isIpv4Address(str) {
  return /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(str)
}

// 判断 端口号 1-65535
export function isPortNumber(value) {
  if (typeof value === 'string') {
    const isValidInteger = /^[1-9]\d{0,4}$/.test(value)
    if (!isValidInteger) {
      return false
    }
    value = +value
  }

  return Number.isInteger(value) && value >= 1 && value <= 65535
}
