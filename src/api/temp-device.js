import request from '@/utils/request'

export function getTempDeviceList(params) {
  return request({
    url: '/tempDevice/page',
    method: 'post',
    params,
  })
}

// 获取某一数据详情
export function getTempDeviceListById(params) {
  return request({
    url: '/tempDevice/getById',
    method: 'post',
    params,
  })
}

export function editTempDevice(params) {
  return request({
    url: '/tempDevice/editConfirm.do',
    method: 'post',
    params,
  })
}

export function addTempDevice(params) {
  return request({
    url: '/tempDevice/tempDeviceAdd.do',
    method: 'post',
    params,
  })
}

// 批量删除(deviceIds:[])
export function delAll(params) {
  return request({
    url: '/tempDevice/dels.do',
    method: 'post',
    params,
  })
}

export default {
  getTempDeviceList,
  getTempDeviceListById,
  editTempDevice,
  addTempDevice,
  delAll,
}
