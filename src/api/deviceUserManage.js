import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchDeviceUserList(params) {
  return request({
    url: '/deviceUser/deviceUserPage.do',
    method: 'get',
    params,
  })
}

export function addDeviceUser(data) {
  return request({
    url: '/deviceUser/userDevRelationAdd.do',
    method: 'post',
    data,
  })
}

export function delDeviceUser(id) {
  return request({
    url: '/deviceUser/deleteRelation.do?relationId=' + id,
    method: 'post',
  })
}

export function getRelation() {
  return request({
    url: '/deviceUser/addRelation.do',
    method: 'post',
  })
}

// 返回：
// devices：未和用户关联的设备
// users：用户
export function findDevNoRelation() {
  return request.get('deviceUser/findUserAndDev')
}
