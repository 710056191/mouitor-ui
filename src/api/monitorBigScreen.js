import { requestPure } from '@/utils/request'
import request from '@/utils/request'

// 异常报告
export function errorDetail(params) {
  return requestPure({
    url: '/index/indexErrorDetail.do',
    method: 'get',
    params,
  })
}

// 设备数量统计
export function devCount() {
  return requestPure({
    url: '/index/countDev.do',
    method: 'get',
  })
}

// 设备数据
export function deviceDetail(params) {
  return request({
    url: '/index/indexPage',
    method: 'post',
    params,
  })
}

// 设备异常数据
export function errInfo(params) {
  return request({
    url: '/index/errPage',
    method: 'post',
    params,
  })
}

export function getAlarmCount(params) {
  return request({
    url: '/report/getAlarmCount.do',
    method: 'get',
    params,
  })
}

/**
 * 按日期获取摄像头数据
 * startDate，endDate 格式yyyy-MM-dd
 * @param params
 * @returns {AxiosPromise}
 */
export function getCameraData(params) {
  return request({
    url: '/bigScreen/cameraCount',
    method: 'get',
    params,
  })
}

/**
 * 获取监控终端数据
 * startDate，endDate 格式yyyy-MM-dd
 * 按日期获取参数： all 不为空即可
 * @param params
 * @returns {AxiosPromise}
 */
export function countDuration(params) {
  return request({
    url: '/bigScreen/countDuration',
    method: 'get',
    params,
  })
}

export function getAlarmAnalyzeCount(params) {
  return request({
    url: '/report/getAlarmAnalyzeCount.do',
    method: 'get',
    params,
  })
}

export function getNoNetAndNoElec(params) {
  return request({
    url: '/report/getNoNetAndNoElec',
    method: 'get',
    params,
  })
}

export function getErrCount() {
  return request({
    url: '/bigScreen/getErrCount',
    method: 'get',
  })
}

export function getCameraCount(params) {
  return request({
    url: '/index/getCameraCount',
    method: 'get',
    params,
  })
}

export function getCameraCountRound(params) {
  return request({
    url: '/index/getCameraCountRound',
    method: 'get',
    params,
  })
}

export default {
  errorDetail,
  deviceDetail,
  errInfo,
  devCount,
  getAlarmCount,
  getAlarmAnalyzeCount,
  getNoNetAndNoElec,
  getErrCount,
  getCameraCount,
  getCameraCountRound,
  getCameraData,
  countDuration,
}
