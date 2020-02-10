import request from '@/utils/request'

// 获取许可证信息
export function verifyLicense() {
  return request.get('/common/verifyLicense')
}
