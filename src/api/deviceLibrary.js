import request from '@/utils/request'
import { download } from '@/utils'

// fetchList
// pageNumber
// pageSize
export function fetchDeviceLibraryList(params) {
  return request({
    url: '/deviceLibrary/findPage.do',
    method: 'get',
    params,
  })
}

// 添加设备
export function addDeviceLibrary(data) {
  return request({
    url: '/deviceLibrary/add.do',
    method: 'post',
    data,
  })
}

// 根据id删除设备
export function delDeviceLibrary(id) {
  return request({
    url: '/deviceLibrary/delete.do?deviceLibraryId=' + id,
    method: 'post',
  })
}

// 根据id查找设备
export function findDeviceLibraryById(id) {
  return request({
    url: '/deviceLibrary/findById.do?deviceLibraryId=' + id,
    method: 'get',
  })
}

// 根据id查找设备
export function findDeviceLibraryTypes(params) {
  return request({
    url: '/deviceLibrary/deviceTypes.do',
    method: 'get',
    params,
  })
}

// 更新设备信息
export function updateDeviceLibrary(data) {
  return request({
    url: '/deviceLibrary/update.do',
    method: 'post',
    data,
  })
}

// 下载excel上传模板
export function fetchDeviceLibraryTemplate() {
  download('/common/load.do?type=3')
}

export default {
  fetchDeviceLibraryList,
  addDeviceLibrary,
  delDeviceLibrary,
  findDeviceLibraryById,
  findDeviceLibraryTypes,
  updateDeviceLibrary,
  fetchDeviceLibraryTemplate,
}
