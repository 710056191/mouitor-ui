import request from '@/utils/request'
import { requestPure } from '@/utils/request'

export function getDevice() {
  return request.get('/map/getDev')
}

export async function findKml(params) {
  let response
  try {
    response = await requestPure.get('/map/findKml', { params })
  } catch (e) {
    return Promise.reject(e)
  }
  const result = response.data

  if (typeof result !== 'string') {
    return Promise.reject(result)
  }

  return result
  // console.log('findKml', response)
}

export function loadMapConfig() {
  return request.get('/map/dataInit')
}
