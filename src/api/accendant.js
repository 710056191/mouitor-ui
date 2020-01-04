import request from '@/utils/request'

export function findPage(params) {
  return request({
    url: '/accendant/page',
    method: 'get',
    params,
  })
}

export function saveRecord(params) {
  return request.post('/accendant/add', params)
}

export function findById(id) {
  return request.get('/accendant/findById?id=' + id)
}

export function edit(params) {
  return request.post('accendant/update', params)
}

export function recordDelete(params) {
  return request.post('accendant/delete', params)
}

export function setAlarm(params) {
  return request.post('accendant/setAlarm', params)
}

export function alarmCode() {
  return request.get('accendant/alarmCode')
}

export default {
  findPage,
  saveRecord,
  findById,
  edit,
  recordDelete,
  setAlarm,
  alarmCode,
}
