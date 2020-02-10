import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/checkLogin.do',
    method: 'post',
    data,
  })
}

export function getPermission() {
  return request({
    url: '/getPermission',
    method: 'get',
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token },
  })
}

export function logout() {
  return request({
    url: '/logout.do',
    method: 'post',
  })
}

export function findPage(params) {
  return request({
    url: '/role/page',
    method: 'get',
    params,
  })
}

export function findRecord(params) {
  return request({
    url: '/role/getRoleById.do',
    method: 'get',
    params,
  })
}

export function roleSave(params) {
  return request({
    url: '/role/save.do',
    method: 'post',
    params,
  })
}

// 删除角色（2019.8.28）
export function roleDel(params) {
  return request({
    url: '/role/deleteRole',
    method: 'post',
    params,
  })
}

export function getResource(params) {
  return request({
    url: '/role/getResource.do',
    method: 'get',
    params,
  })
}

export function setResource(params) {
  return request({
    url: '/role/bindResource.do',
    method: 'post',
    params,
  })
}

// 获取用户未设置的角色列表
export function waitRoles(params) {
  return request({
    url: '/user/waitGrantedRoleList',
    method: 'get',
    params,
  })
}

// 获取用户已设置的角色列表
export function alreadyRoles(params) {
  return request({
    url: '/user/grantedRoleList',
    method: 'get',
    params,
  })
}

export function setRoles(params) {
  return request({
    url: '/user/bindRoles',
    method: 'post',
    params,
  })
}
