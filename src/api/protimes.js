import request from '@/utils/request'

export function getProTimesList() {
  return request.get('device/getProTimes')
}

// params参数：{ name: name }
export function addProTimes(params) {
  return request.post('device/proTimesAdd', params)
}

// params参数：{ id: id}
export function delProTimes(params) {
  return request.post('device/delProTimes', params)
}

export default {
  addProTimes,
  getProTimesList,
  delProTimes,
}
