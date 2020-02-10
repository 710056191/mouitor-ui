import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchLightTimeSetList(params) {
  return request({
    url: '/lightTimeSet/page.do',
    method: 'get',
    params,
  })
}

// 添加供应商
export function addLightTimeSet(data) {
  return request({
    url: '/lightTimeSet/add.do',
    method: 'post',
    data,
  })
}

// 根据id删除供应商
export function delLightTimeSet(id) {
  return request({
    url: '/lightTimeSet/delete.do?setId=' + id,
    method: 'post',
  })
}

// 根据id查找供应商
export function findLightTimeSetById(id) {
  return request({
    url: '/lightTimeSet/find.do?setId=' + id,
    method: 'get',
  })
}

// 更新供应商信息
export function updateLightTimeSet(data) {
  return request({
    url: '/lightTimeSet/edit.do',
    method: 'post',
    data,
  })
}
