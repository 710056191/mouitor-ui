import request from '@/utils/request'

export function getContractList() {
  return request.get('/procurement/findList.do')
}

export function findPage(params) {
  return request({
    url: '/feeRule/feeRulePage.do',
    method: 'get',
    params,
  })
}

export function addFeeRule(params) {
  return request.post('/feeRule/add', params)
}

export function findById(params) {
  return request({
    url: '/feeRule/findById',
    method: 'post',
    params,
  })
}

export function ruleEdit(params) {
  return request.post('/feeRule/edit', params)
}

export function ruleDelete(params) {
  return request.post('/feeRule/del', params)
}
