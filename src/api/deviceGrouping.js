import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchDeviceGroupingList(params) {
  return request({
    url: '/deviceGrouping/devGroupPage.do',
    method: 'get',
    params,
  })
}

export function addDeviceGrouping(data) {
  return request({
    url: '/deviceGrouping/deviceGroupAdd.do',
    method: 'post',
    data,
  })
}

export function delDeviceGrouping(id) {
  return request({
    url: '/deviceGrouping/deviceGroupDelete.do?relationId=' + id,
    method: 'post',
  })
}

export function getDevAndGro() {
  return request({
    url: '/deviceGrouping/getDevAndGro.do',
    method: 'post',
  })
}
