// TODO: 将 行政地区 相关操作统一至这里复用

// 设置 locationData
// 设置 options ，可设置是否必选一个
// 返回 地区 列表
// 获取当前位置
// 更改位置

class LocationHelper {
  #provinces
  #cities
  #areas
  #streets

  #locationData
  #options

  constructor(locationData, options = {}) {
    this.#locationData = locationData
    this.#options = {
      required: false, // 地区是否必选
      ...options,
    }
    this.#updateData()
  }

  #updateData = () => {
    console.log('#updateData')
  }

  getCurrentAddress() {
    // @return
    // {province: {code, name}, city, area, street}
  }

  getCurrentAddressList() {
    // @return
    // [{code, name}]
  }

  getProvinces() {}

  changeLocation(/* province, city, area, street */...args) {
    return this.changeProvince(...args)
  }

  changeProvince(province, city, area, street) {
  }

  changeCity(city, area, street) {
  }

  changeArea() {
  }

  changeStreet() {
  }
}

export default LocationHelper
