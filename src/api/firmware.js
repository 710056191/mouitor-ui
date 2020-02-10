import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchList(params) {
  return request.get('/firmware/page.do', {
    params,
  })
}

export function getById(data) {
  return request.post('/firmware/getById.do', data)
}

export function updateFirmware(data) {
  return request.post('/firmware/update.do', data)
}

// 新增固件(2019.8.29)
export function addFirmware(data) {
  return request.post('/firmware/add.do', data)
}

// 删除固件(2019.8.28)
// export function delFirmware(data) {
//   return request.post('/firmware/delete.do', data)
// }

export function delFirmware(data) {
  return request({
    url: '/firmware/delete.do',
    method: 'post',
    data,
  })
}

export function fetchDeviceList(data) {
  return request.post('/firmware/devicePage.do', data)
}

// 固件列表
export function exitFirmwareList() {
  return request.get('/firmware/getFirmware')
}

export function upgrade(params) {
  return request.post('/firmware/upgrade.do', params)
}

export default {
  fetchList,
  getById,
  fetchDeviceList,
  exitFirmwareList,
  upgrade,
  delFirmware,
  addFirmware,
  updateFirmware,
}
