import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchList(data) {
  return request({
    url: '/threshold/page',
    method: 'post',
    data,
  })
}

export function getById(data) {
  return request({
    url: '/threshold/getById.do',
    method: 'post',
    data,
  })
}

export function update(data) {
  return request({
    url: '/threshold/update',
    method: 'post',
    data,
  })
}
