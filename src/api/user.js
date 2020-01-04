import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/checkLogin.do',
    method: 'post',
    data,
    headers: { 'X-Non-Transform-Object-Data': true },
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
    url: '/user/page',
    method: 'get',
    params,
  })
}

export function findRecord(params) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    params,
  })
}

export function userSave(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data,
  })
}

export function deleteUsers(data) {
  // ids: 35

  return request({
    url: '/user/dels',
    method: 'post',
    data,
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

export function updateUserPwd(data) {
  // Form Data:
  // userId: 1
  // pwd: 123456
  return request({
    url: '/user/updateUserPwd',
    method: 'post',
    data,
  })
}
