import LocationHelper from './Location'
import { deepFreeze } from '@/utils'

// 加载地区数据
export async function loadLocationData() {
  const { default: list } = await import(/* webpackChunkName: "china-location-data" */'china-location/dist/location.json')
  return deepFreeze(list)
}

export {
  LocationHelper,
}
