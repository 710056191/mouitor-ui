import request from '@/utils/request'

// fetchList
// pageNumber
// pageSize
export function fetchList(params) {
  return request.get('/config/page', {
    params,
  })
}

export function findById(params) {
  return request.get('/config/findById.do', {
    params,
  })
}

export function editSysConfig(data) {
  return request.post('/config/editSysConfigConfirm.do', data)
}

/**
 * 更新某条配置的状态
 * @param {number} id
 * @param {boolean} valid - 要更改的状态
 */
export function updateItmStatusById(id, valid) {
  if (!id) {
    throw new Error('id is required')
  }
  if (typeof valid !== 'boolean') {
    throw new Error('valid must be a boolean')
  }

  const url = valid ? '/config/beValid.do' : '/config/beInValid.do'
  return request.post(
    url,
    { id },
  )
}

export function getConfigInfo() {
  return request.get('/sysConfig/info')
}

export default {
  fetchList,
  findById,
  editSysConfig,
  updateItmStatusById,
  getConfigInfo,
}
