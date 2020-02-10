import apiCache from './api-cache'

import {
  listTotalManufacturer,
  listElectricManufacturer,
  listNetManufacturer,
} from '@/api/manufacturer'

const GeneralSupplierKey = '/manufacturer/listTotalManufacturer'
const ElectricSupplierKey = '/manufacturer/listElectricManufacturer'
const networkSupplierKey = '/manufacturer/listNetManufacturer'

// 总包商
apiCache.register(GeneralSupplierKey, () => {
  return listTotalManufacturer()
    .then(res =>
      res.data.map(item => ({
        label: item.manufacturerName,
        value: item.manufacturerId,
      })))
})

export function getGeneralSupplier() {
  return apiCache.fetch(GeneralSupplierKey)
}

// 电力供应商
apiCache.register(ElectricSupplierKey, () => {
  return listElectricManufacturer()
    .then(res =>
      res.data.map(item => ({
        label: item.manufacturerName,
        value: item.manufacturerId,
      })))
})

export function getElectricSupplier() {
  return apiCache.fetch(ElectricSupplierKey)
}

// 网络供应商
apiCache.register(networkSupplierKey, () => {
  return listNetManufacturer()
    .then(res =>
      res.data.map(item => ({
        label: item.manufacturerName,
        value: item.manufacturerId,
      })))
})

export function getNetworkSupplier() {
  return apiCache.fetch(networkSupplierKey)
}
