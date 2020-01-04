/**
 * Created by PanJiaChen on 16/11/18.
 */
import { APP_BASE_API } from './project-env'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  if (!time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number|string|Object} time
 * @param {string=} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 深冻结函数
 */
export function deepFreeze(o) {
  const oIsFunction = typeof o === 'function'
  const hasOwnProp = Object.prototype.hasOwnProperty

  Object.getOwnPropertyNames(o).forEach(function(name) {
    const valid = hasOwnProp.call(o, name) &&
      (oIsFunction
        ? name !== 'caller' && name !== 'callee' && name !== 'arguments'
        : true)

    if (!valid) {
      return
    }

    const prop = o[name]
    if (
      prop !== null &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      (oIsFunction && name === 'prototype'
        ? prop.constructor !== o
        : true) &&
      !Object.isFrozen(prop)
    ) {
      deepFreeze(prop)
    }
  })

  return Object.freeze(o)
}

export function getBackstageUrl() {
  return `${APP_BASE_API}`
}

export function download(path) {
  const url = getBackstageUrl() + path
  window.open(url)
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function isObjectObject(val) {
  const isObject = val != null && typeof val === 'object' && Array.isArray(val) === false
  return isObject && Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * 延迟
 * @param {number=} timeout
 * @param {boolean=} doReject
 * @returns {Promise}
 */
export function delay(timeout = 300, doReject) {
  return new Promise((resolve, reject) => {
    setTimeout(doReject ? reject : resolve, timeout)
  })
}

/**
 * 获取文件路径的扩展名
 *  eg: 'readme.md' => '.md'
 * @param p
 * @return {string}
 */
export function getFileExtname(p) {
  if (typeof p !== 'string') {
    return ''
  }
  const idx = p.lastIndexOf('.')
  return idx === -1
    ? ''
    : p.substring(idx)
}

/**
 字符串哈希函数，基于 time 33 hash 算法实现
 @param {string} text - String to hash
 @return {number} Resulting number.
 */
export function time33(text) {
  let hash = 5381
  for (let i = 0, len = text.length; i < len; ++i) {
    hash += (hash << 5) + text.charAt(i).charCodeAt(0)
  }
  return hash & 0x7fffffff
}

// ucs-2 string to base64 encoded ascii
function utoa(str) {
  return window.btoa(unescape(encodeURIComponent(str)))
}

// base64 encoded ascii to ucs-2 string
function atou(str) {
  return decodeURIComponent(escape(window.atob(str)))
}
