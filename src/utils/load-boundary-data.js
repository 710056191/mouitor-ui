import { findKml } from '@/api/map'
import toGeoJSON from '@mapbox/togeojson'

export async function loadBoundaryData(address) {
  // address
  // { code, list: [{code, name, key}]}

  const { list: addrList } = address
  if (!addrList || !addrList.length) {
    return Promise.reject(new Error('invalid [address.list] '))
  }

  let kmlContent
  const params = addrList.reduce((params, addrItem) => {
    params[addrItem.key] = addrItem.name
    params[addrItem.key + 'Code'] = addrItem.code
    return params
  }, {})

  try {
    kmlContent = await findKml(params)
  } catch (e) {
    return Promise.reject(e)
  }

  const parse = new DOMParser()
  const doc = parse.parseFromString(kmlContent, 'application/xml')

  return toGeoJSON.kml(doc)
}
