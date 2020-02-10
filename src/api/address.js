import request from '@/utils/request'

// params参数：{ code: code,selfAddress1: selfAddress1,selfAddress2: selfAddress2}
export function addressAdd(params) {
  return request.post('/addressDevice/addressAdd', params)
}

// desc：获取定义地址
// params参数：{ code: code,selfAddress1: selfAddress1 }
export function getSelfAddr(params) {
  return request.get('/addressDevice/selfAddr', { params })
}

// desc：获取行政区
// params参数：{ code: code }，code为空返回最高级行政区域,不为空返回子级行政区域
export function getDistrict(params) {
  return request.get('/addressDevice/getDistrict', { params })
}

// desc：通过地址查询设备
// parmas参数：{ pageNumber: pageNumber,pageSize: pageSize, addressName: addressName ,deviceTypeId:deviceTypeId }deviceTypeId为1时获取设备箱数据，为2时获取摄像头数据
export function getDevByAddr(params) {
  return request({
    url: '/addressDevice/findAddressDev.do',
    method: 'get',
    params,
  })
}

export default {
  addressAdd,
  getSelfAddr,
  getDistrict,
  getDevByAddr,
}
