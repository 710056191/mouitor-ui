// 全局前置守卫
// 用于检测短时间内路由连续重定向
// 若发生，直接报错、中断导航，避免短时间连续跳转导致浏览器卡住

// 记录最近进入的 路由 以及 时间
// 若相同的路由连续重复进入超过 n 次 (15 次)
// 或短时间内（3s），进入超过 10 次
// 直接中断导航

import { Message } from 'element-ui'

// 相同路由连续重复最大次数
const MAX_REPEAT_TIMES = 15

// 重定向最大次数
const MAX_REDIRECTS_TIMES = 10
// 间隔
const REDIRECTS_INTERVAL = 1e3 * 3

const recentPaths = []
const recentTimeList = []

export default function(to, from, next) {
  const recentLength = recentPaths.length

  // 判断：相同路由连续重复 n 次
  if (recentLength >= MAX_REPEAT_TIMES) {
    let isAllMatched = true

    // 从 倒数第 1 个(length-1) 至 倒数第 n 个(length-n)
    for (let i = recentLength - 1; i >= (recentLength - MAX_REPEAT_TIMES); i--) {
      if (to.path !== recentPaths[i]) {
        isAllMatched = false
        break
      }
    }

    if (isAllMatched) {
      showErrorMsg()
      console.error('Too many redirects. recentPaths:', recentPaths)
      next(false)
      return
    }
  }

  // 判断：短时间内重定向 n 次
  if (recentLength >= MAX_REDIRECTS_TIMES) {
    // 与倒数第 n 个比较时间差
    const now = Date.now()
    const recentTime = recentTimeList[recentLength - MAX_REDIRECTS_TIMES]

    if (now - recentTime < REDIRECTS_INTERVAL) {
      showErrorMsg()
      console.error('Too many redirects. recentPaths:', recentPaths)
      next(false)
      return
    }
  }

  recentPaths.push(to.path)
  recentTimeList.push(Date.now())

  next()
}

function showErrorMsg(msg) {
  Message({
    type: 'error',
    message: msg || '短时间内重定向次数过多，尝试清除浏览器缓存',
    duration: 10 * 1e3,
  })
}
