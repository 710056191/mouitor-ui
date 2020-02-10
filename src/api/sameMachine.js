import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchList(params) {
  return request({
    url: '/thirdDevice/thirdDevPage.do',
    method: 'get',
    params,
  })
}

export function add(data) {
  return request({
    url: '/thirdDevice/add.do',
    method: 'post',
    data,
  })
}

export function del(data) {
  return request({
    url: '/device/del',
    method: 'post',
    data,
  })
}

export function findById(id) {
  return request({
    url: '/device/getById?id=' + id,
    method: 'post',
  })
}

export function update(data) {
  return request({
    url: '/thirdDevice/thirdUpdate.do',
    method: 'post',
    data,
  })
}

export function reset(data) {
  // deviceId
  // openStatus - 0 (开启), 1 (关闭)
  return request({
    url: '/thirdDevice/reset.do',
    method: 'post',
    data,
  })
}

export function moduleId(params) {
  return request({
    url: '/thirdDevice/moduleId.do',
    method: 'get',
    params,
  })
}

export function getType() {
  return request({
    url: '/thirdDevice/getType.do',
    method: 'get',
  })
}

export function getDeviceLibrary(id) {
  return request({
    url: '/deviceLibrary/findByDevType.do?deviceTypeId=' + id,
    method: 'get',
  })
}

export default {
  fetchList,
  findById,
  add,
  del,
  update,
  moduleId,
  getType,
  reset,
  getDeviceLibrary,
}
