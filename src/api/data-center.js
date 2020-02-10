import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/dataCenter/page',
    method: 'post',
    data,
  })
}

export function getById(data) {
  return request.post('/dataCenter/findBackUpById', data)
}

export function addBackUp(data) {
  return request({
    url: '/dataCenter/backUp',
    method: 'post',
    data,
  })
}

export function editBackUp(data) {
  return request({
    url: '/dataCenter/editBackUp',
    method: 'post',
    data,
  })
}

// 根据id删除备份
export function delBackUp(data) {
  return request({
    url: '/dataCenter/delBackUp',
    method: 'post',
    data,
  })
}

export default {
  fetchList,
  getById,
  addBackUp,
  editBackUp,
  delBackUp,
}
