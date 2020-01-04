/**
 * Created by PanJiaChen on 16/11/18.
 */

import { getFileExtname } from '@/utils/index'

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isSupportFile(filePath, supportExtNames = []) {
  let extname = getFileExtname(filePath)
  if (!extname) {
    return false
  }
  extname = extname.toLowerCase()
  return supportExtNames.some(ext => ext.toLowerCase() === extname)
}

export const DefaultImageFileExtNames = [
  '.jpeg',
  '.jpg',
  '.png',
  '.gif',
  '.bmp',
]
Object.freeze(DefaultImageFileExtNames)

export function isImageFilePath(filePath, supportExtNames = DefaultImageFileExtNames) {
  return isSupportFile(filePath, supportExtNames)
}
