import request from '@/utils/request'

export function findPage(params) {
  return request({
    url: '/workorder/page',
    method: 'get',
    params,
  })
}

export function updateStatus(params) {
  return request.post('workorder/updateStatus', params)
}

export function deleteWorkorder(params) {
  return request.post('workorder/delete', params)
}

export default {
  findPage,
  updateStatus,
  deleteWorkorder,
}
