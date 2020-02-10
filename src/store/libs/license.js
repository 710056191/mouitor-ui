import { verifyLicense } from '@/api/common'
import { format as dateFormat } from 'date-fns'

/**
 * 接口返回的许可证信息
 * @typedef {Object} LicenseData
 * @property {string} licenseVerifyEnum - 已知值 `SUCCESS`
 * @property {boolean} useableInlicenseFai - license 是否可用
 * @property {boolean} tryVersion - 是否试用版
 * @property {Date | string | number} expireTime - 过期日期
 * @property {number} remainingDays - 剩余有效天数，试用版许可证下无效
 */

export default async function validateLicense() {
  const res = await verifyLicense()

  /** @type {LicenseData | *} */
  const licenseData = res.data

  const ret = {
    usable: false, // 是否可能
    isTrial: false, // 是否试用版
    name: '', // license 名称

    expireDate: 0, // 过期日期
    expireDateStr: '', // 过期日期 字符串

    remainingDays: '', // 剩余有效天数
  }

  // `licenseVerifyEnum` `useableInlicenseFai` 任一字段符合要求，即许可证可用
  ret.usable = licenseData.licenseVerifyEnum === 'SUCCESS' ||
    !!licenseData.useableInlicenseFai

  ret.isTrial = !!licenseData.tryVersion

  ret.name = ret.isTrial ? '试用版 License' : 'License'

  // 有效期
  ret.expireDate = licenseData.expireTime
  ret.expireDateStr = dateFormat(ret.expireDate, 'YYYY-MM-DD HH:mm:ss')

  ret.remainingDays = licenseData.remainingDays

  return ret
}
