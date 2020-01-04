import Cookies from '@/utils/cookie'
import * as ls from '@/utils/local-storage'

const TokenKey = 'tk'

const UseInfoKey = 'tk_u'

export function getToken() {
  try {
    return atob(Cookies.get(TokenKey))
  } catch (e) {
    return ''
  }
}

export function setToken(token) {
  try {
    return Cookies.set(TokenKey, btoa(token))
  } catch (e) {
    console.log('set cookie error', e)
    return ''
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  try {
    return ls.getObject(UseInfoKey)
  } catch (e) {
    console.warn('auth.js getUserInfo error', e)
    return null
  }
}

export function setUserInfo(userInfo) {
  try {
    ls.setObject(UseInfoKey, userInfo)
  } catch (e) {
    console.warn('auth.js setUserInfo error', e)
  }
}

export function getUserName() {
  const user = getUserInfo()
  return user && user.name || ''
}

export function saveUserName(name) {
  const user = getUserInfo()
  setUserInfo({ ...user, name })
}
