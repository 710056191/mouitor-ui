import request from '@/utils/request'
import { download } from '@/utils'

// fetchList
// pageNumber
// pageSize
export function fetchList(params) {
  return request({
    url: '/device/page',
    method: 'get',
    params,
  })
}

// 添加供应商
export function add(data) {
  return request({
    url: '/device/add.do',
    method: 'post',
    data,
  })
}

// 根据id删除供应商
export function del(data) {
  return request({
    url: '/device/del',
    method: 'post',
    data,
  })
}

// 根据id查找供应商
export function findById(id) {
  return request({
    url: '/device/getById?id=' + id,
    method: 'post',
  })
}

// 更新供应商信息
export function update(data) {
  return request({
    url: '/device/update',
    method: 'post',
    data,
  })
}

export function setAllDefaultValue() {
  return request({
    url: '/device/allDeviceSet.do',
    method: 'post',
  })
}
export function setSingleDefaultValue(id) {
  return request({
    url: '/device/thresholdSet.do?devId=' + id,
    method: 'post',
  })
}

export function getLog(params) {
  return request.get('/device/deviceLogPage.do', { params })
}

export function findDevAlarm(id) {
  return request({
    url: '/device/findDevAlarm?devId=' + id,
    method: 'post',
  })
}

// 下载excel上传模板
export function fetchTemplate() {
  download('/common/load.do?type=1')
}

// 查看下载上传模板接口
export function getuploadError() {
  download('/cameraExcel/uploadError')
}

export default {
  fetchList,
  findById,
  setAllDefaultValue,
  setSingleDefaultValue,
  getLog,
  findDevAlarm,
  update,
  add,
  del,
  fetchTemplate,
  getuploadError,
}
