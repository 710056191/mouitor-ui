import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/protocol/page',
    method: 'POST',
    data,
  })
}

export function getById(data) {
  return request({
    url: '/protocol/getById.do',
    method: 'post',
    data,
  })
}

export function add(data) {
  return request({
    url: '/protocol/add',
    method: 'post',
    data,
  })
}

export function update(data) {
  return request({
    url: '/protocol/update',
    method: 'post',
    data,
  })
}

export function del(data) {
  return request({
    url: '/protocol/del',
    method: 'post',
    data,
  })
}
