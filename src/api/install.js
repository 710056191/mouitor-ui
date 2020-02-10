import request from '@/utils/request'

export function scanDevice(params) {
  return request.post('/install/scanDevice', params)
}

export function initDevice(params) {
  return request.post('install/initDevice', params)
}
