import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchList(params) {
  return request({
    url: '/monitorset/page',
    method: 'get',
    params,
  })
}

export function update(data) {
  return request({
    url: '/monitorset/update',
    method: 'post',
    data,
  })
}

// 更新供应商信息
export function getById(id) {
  return request({
    url: '/monitorset/getById?setId=' + id,
    method: 'post',
  })
}

export default {
  fetchList, update, getById,
}
