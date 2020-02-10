import { APP_PREFIX } from '@/utils/project-env'
import { time33 } from '@/utils/index'
import { fromJson, toJson } from '@/utils/json'

const STORAGE_PREFIX = APP_PREFIX + '_ls_'

const SIGN_PARAM_1 = APP_PREFIX + '_ls_sign'

/*
会对数据完整性进行检验
仅能存储能用 JSON 格式化的数据
*/

export function normalizeKey(key) {
  return STORAGE_PREFIX + (String(key) || 'default')
}

function generateSignature(obj) {
  const text = toJson(obj)
  const str = text + SIGN_PARAM_1
  return `${time33(text)}-${time33(str)}`
}

// getObject
// 通不过数据完整性校验，返回 undefined
export function getObject(key) {
  const lsKey = normalizeKey(key)

  const dataStr = localStorage.getItem(lsKey)
  const data = fromJson(dataStr) || {}

  const sign = generateSignature(data.p)
  return sign === data.s
    ? fromJson(data.p)
    : undefined
}

// setObject
export function setObject(key, obj) {
  const lsKey = normalizeKey(key)

  const data = {
    // payload
    p: obj,

    // signature
    s: generateSignature(obj),
  }

  localStorage.setItem(lsKey, toJson(data))
}
