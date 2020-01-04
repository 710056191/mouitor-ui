import { loadLocationData, LocationHelper } from '@/utils/location'
import { deepFreeze } from '@/utils'

describe('Utils:location', () => {
  let locationData

  beforeEach(() => {
    locationData = import('china-location/dist/location.json')
    locationData = deepFreeze(locationData)
  })

  it('loadLocationData should return a frozen object', async() => {
    const locationData = await loadLocationData()
    expect(typeof locationData === 'object').toBe(true)
    expect(Object.isFrozen(locationData)).toBe(true)
  })

  it('get location immediately after create instance', () => {
    const location = new LocationHelper(locationData)

    const addressList = location.getCurrentAddressList()

    expect(Array.isArray(addressList)).toBe(true)
    expect(addressList.length === 0).toBe(true)

    const address = location.getCurrentAddress()
    ;['province', 'city', 'area', 'street'].forEach(key => {
      expect(address[key]).toBeNull()
    })
  })

  it('get location immediately after create instance with required option', () => {
    const defaultAddress = {
      'province': {
        'code': '110000',
        'name': '北京市',
      },
      'city': {
        'code': '110000',
        'name': '北京市',
      },
      'area': {
        'code': '110101',
        'name': '东城区',
      },
    }

    const location = new LocationHelper(locationData, { required: true })

    const addressList = location.getCurrentAddressList()
    const { province, city, area } = defaultAddress
    expect(addressList).toEqual([province, city, area])

    const address = location.getCurrentAddress()
    expect(address).toEqual(defaultAddress)
  })

  it('getProvinces', () => {
  })
})
