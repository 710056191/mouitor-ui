import request from '@/utils/request'
import { download } from '@/utils'

// fetchList
// pageNumber
// pageSize
export function fetchManufacturerList(params) {
  return request({
    url: '/manufacturer/page',
    method: 'get',
    params,
  })
}

// 添加供应商
export function addManufacturer(data) {
  return request({
    url: '/manufacturer/add',
    method: 'post',
    data,
  })
}

// 根据id删除供应商
export function delManufacturer(data) {
  return request({
    url: '/manufacturer/del',
    method: 'post',
    data,
  })
}

// 根据id查找供应商
export function findManufacturerById(id) {
  return request({
    url: '/manufacturer/findById?manufacturerId=' + id,
    method: 'post',
  })
}

// 根据id查找供应商
export function findManufacturer() {
  return request({
    url: '/manufacturer/findMan.do',
    method: 'get',
  })
}

// 更新供应商信息
export function updateManufacturer(data) {
  return request({
    url: '/manufacturer/update',
    method: 'post',
    data,
  })
}

export function listElectricManufacturer() {
  return request({
    url: '/manufacturer/listElectricManufacturer',
    method: 'post',
  })
}

export function listTotalManufacturer() {
  return request({
    url: '/manufacturer/listTotalManufacturer',
    method: 'post',
  })
}

export function listNetManufacturer() {
  return request({
    url: '/manufacturer/listNetManufacturer',
    method: 'post',
  })
}

// 下载excel上传模板
export function fetchManufacturerTemplate() {
  download('/common/load.do?type=2')
}

export default {
  fetchManufacturerList,
  addManufacturer,
  delManufacturer,
  findManufacturerById,
  findManufacturer,
  updateManufacturer,
  fetchManufacturerTemplate,
  listElectricManufacturer,
  listTotalManufacturer,
  listNetManufacturer,
}
