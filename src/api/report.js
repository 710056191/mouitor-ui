import request from '@/utils/request'
import { getBackstageUrl } from '@/utils'

export function findPage(params) {
  return request({
    url: '/fee/page',
    method: 'get',
    params,
  })
}

export function calculateFeeApi(params) {
  return request({
    url: '/fee/calculateFee.do',
    method: 'post',
    params,
  })
}

export function findPDFOrExcel(params) {
  window.open(getBackstageUrl() + '/fee/report.do' + objToUrlParam(params))
}

export function select() {
  return request({
    url: '/fee/select',
    method: 'get',
  })
}

export function getAlarmCount(params) {
  return request({
    url: '/report/getAlarmCount.do',
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

// 报警次数
export function alarmCountExcel(params) {
  window.open(getBackstageUrl() + '/report/exportAlarmExcel' + objToUrlParam(params))
}

// 报警时长
export function alarmDetailExcel(params) {
  window.open(getBackstageUrl() + '/report/exportAlarmAnalyzeData' + objToUrlParam(params))
}

/**
 * 拼接url后面的参数
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export function objToUrlParam(obj) {
  let paramStr = '?'
  for (const param in obj) {
    paramStr += param + '=' + obj[param] + '&'
  }
  return paramStr
}

// 电力申诉编辑
export function appealElect(data) {
  return request({
    url: '/fee/discount.do',
    method: 'post',
    data,
  })
}

// 电力申诉获取
export function findElectById(params) {
  return request({
    url: '/fee/findModifyById.do',
    method: 'post',
    params,
  })
}

// 网络申诉编辑
export function appealNetwork(data) {
  return request({
    url: '/fee/discount.do',
    method: 'post',
    data,
  })
}

// 网络申诉获取
export function findNetworkById(params) {
  return request({
    url: '/fee/findModifyById.do',
    method: 'post',
    params,
  })
}

export default {
  appealElect,
  findElectById,
  appealNetwork,
  findNetworkById,
}
