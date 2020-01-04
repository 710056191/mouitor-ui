import { APP_BASE_API, isProductionMode } from '@/utils/project-env'
import axios from 'axios'
import { stringify } from 'qs'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { isObjectObject } from '@/utils'

const defaultsConfig = {
  baseURL: APP_BASE_API,
  withCredentials: true,
  timeout: isProductionMode ? 30e3 : 60e3,
}

/**
 * 创建一个实例
 * @param {AxiosRequestConfig=} config
 * @return {AxiosInstance}
 */
export function createPureInstance(config) {
  return axios.create({
    ...defaultsConfig,
    ...config,
  })
}

/**
 * 注入公共的请求头
 * @param { AxiosRequestConfig } config
 * @return { AxiosRequestConfig }
 */
export function injectCommonRequestHeaders(config) {
  if (store.getters.token) {
    config.headers['token'] = getToken()
  }
  return config
}

/**
 * 自动转换 post 的 请求数据
 *
 *  config.headers['X-Non-Transform-Object-Data'] 为 truthy 时跳过
 * @param { AxiosRequestConfig } config
 * @return { AxiosRequestConfig }
 */
export function autoTransformPostRequestData(config) {
  if (config.method !== 'post') {
    return config
  }

  const keyName = 'X-Non-Transform-Object-Data'
  let nonTransformObjectData = false

  if (keyName in config.headers) {
    (config.headers[keyName]) && (nonTransformObjectData = true)
    delete config.headers[keyName]
  }

  if (!nonTransformObjectData) {
    const data = config.data
    if (data && isObjectObject(data)) {
      config.data = stringify(data)
    }
  }
  return config
}

export const ErrorMessageMap = {
  'Network Error': '网络错误',
}
