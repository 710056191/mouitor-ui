import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: 'sysLog/page',
    method: 'post',
    data,
  })
}

// 根据 id 获取日志类型
// data: {parentlogTypeId: string}
export function findChildTypesById(id) {
  return request({
    url: '/sysLog/findChildType.do',
    method: 'post',
    data: { parentlogTypeId: id },
  })
}

export default {
  fetchList,
  findChildTypesById,
}
