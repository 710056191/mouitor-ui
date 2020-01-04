import {
  getObject,
  normalizeKey,
  setObject,
} from '@/utils/local-storage'

describe('Utils:local-storage', function() {
  it('should secure read and write from localStorage', function() {
    const key = 'key'
    const data = {
      b: true,
      n: 1,
      s: 'str',
    }

    setObject(key, data)
    const result = getObject(key)

    expect(result).toEqual(data)
  })

  it('should return undefined when modifying data', function() {
    const key = 'key'
    const data = {
      b: true,
      n: 1,
      s: 'str',
    }

    setObject(key, data)

    // 直接修改 localStorage item 的值
    const normalizationKey = normalizeKey(key)
    const lsItem = JSON.parse(localStorage.getItem(normalizationKey))
    const lsItemStr = JSON.stringify({
      p: { ...data, s: 'str_v2' },
      s: lsItem.s,
    })
    localStorage.setItem(normalizationKey, lsItemStr)

    // console.log(lsItem)
    // console.log(localStorage.getItem(normalizationKey))

    const result = getObject(key)
    expect(result).toBeUndefined()
  })
})
