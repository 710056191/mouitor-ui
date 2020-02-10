import request from '@/utils/request'
import { download } from '@/utils'

export function findPage(params) {
  return request({
    url: '/tempDeviceInfo/page',
    method: 'get',
    params,
  })
}

export function fetchTemplate() {
  download('/common/exportIpInfo')
}

export function del(data) {
  return request({
    url: '/tempDeviceInfo/delete',
    method: 'post',
    data,
  })
}

export function getTempDeviceListById(data) {
  return request({
    url: '/tempDeviceInfo/findById',
    method: 'post',
    data,
  })
}

export function editTempDevice(data) {
  return request({
    url: '/tempDeviceInfo/update',
    method: 'post',
    data,
  })
}

export function updateIp(params) {
  return request({
    url: '/tempDeviceInfo/sendCommand',
    method: 'post',
    params,
  })
}

export default {
  findPage,
  fetchTemplate,
  del,
  getTempDeviceListById,
  editTempDevice,
  updateIp,
}
