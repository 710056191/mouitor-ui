import request from '@/utils/request'
import { download } from '@/utils'

// fetchList
// pageNumber
// pageSize
export function fetchProcurementList(params) {
  return request({
    url: '/procurement/findPage.do',
    method: 'get',
    params,
  })
}

// 添加采购库
export function addProcurement(data) {
  return request({
    url: '/procurement/add.do',
    method: 'post',
    data,
  })
}

// 根据id删除采购库
export function delProcurement(id) {
  return request({
    url: '/procurement/delete.do?procurementId=' + id,
    method: 'post',
  })
}

// 根据id查找采购库
export function findProcurementById(id) {
  return request({
    url: '/procurement/findById.do?procurementId=' + id,
    method: 'get',
  })
}

// 更新采购库信息
export function updateProcurement(data) {
  return request({
    url: '/procurement/update.do',
    method: 'post',
    data,
  })
}

// 下载excel上传模板
export function fetchProcurementTemplate() {
  download('/common/load.do?type=4')
}

export default {
  fetchProcurementList,
  addProcurement,
  delProcurement,
  findProcurementById,
  updateProcurement,
  fetchProcurementTemplate,
}
