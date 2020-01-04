import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchGroupingManageList(params) {
  return request({
    url: '/groupingManage/pageGrouping',
    method: 'get',
    params,
  })
}

// 添加供应商
export function addGroupingManage(data) {
  return request({
    url: '/groupingManage/defineAdd.do',
    method: 'post',
    data,
  })
}

// 根据id删除供应商
export function delGroupingManage(id) {
  return request({
    url: '/groupingManage/defineDelete.do?devGroupId=' + id,
    method: 'post',
  })
}

// 根据id查找供应商
export function findGroupingManageById(id) {
  return request({
    url: '/groupingManage/defineEdit.do?devGroupId=' + id,
    method: 'post',
  })
}

// 更新供应商信息
export function updateGroupingManage(data) {
  return request({
    url: '/groupingManage/defineEditConfirm.do',
    method: 'post',
    data,
  })
}
