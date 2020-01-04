/*
request

数据处理：
    1. 默认转换 post data ，以 Form Data 的形式发送  ，设置 `X-Non-Transform-Object-Data` header 以跳过

错误处理：
    成功，会直接得到接口返回的 数据 <object>
    失败，进入 catch 回调
        1. 网络错误、被取消等，得到的为 axios 返回的 Error 对象 <AxiosError>
        2. 接口逻辑错误(success != true)，得到的为 Axios 的 response 对象 <AxiosResponse>
 */

import {
  autoTransformPostRequestData,
  createPureInstance,
  injectCommonRequestHeaders,
  ErrorMessageMap,
} from './common'

import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { logoutAndReLogin } from '@/utils/navigation'

const service = createPureInstance()

const localState = {
  logoutConfirm: false,
  limitedAccessConfirm: false,
}

service.interceptors.request.use(
  config => {
    injectCommonRequestHeaders(config)
    autoTransformPostRequestData(config)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  /*
   * 统一根据处理返回的 data
   */
  response => {
    const res = response.data

    if (res.success) {
      return res
    }
    /* 如果返回 success 为 false ，当成错误 */

    const apiResultCode = res.resultCode
    if (apiResultCode === -10) {
      // -10: token为空或无效
      handleSessionInvalidation()
    } else if (apiResultCode === -11) {
      // -11: 无权限
      handleLimitedAccess()
    } else {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000,
      })
    }
    return Promise.reject(response)
  },

  error => {
    console.log('err' + error) // for debug

    let displayMessage = ''
    if (error.message) {
      displayMessage = ErrorMessageMap[error.message] || ''
    }

    Message({
      message: displayMessage || error.message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

// 会话失效处理
function handleSessionInvalidation() {
  if (localState.logoutConfirm) {
    return
  }

  MessageBox
    .confirm(
      '会话无效，是否重新登录',
      '会话无效',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
      })
    .then(gotoReLogin)
    .finally(() => {
      localState.logoutConfirm = false
    })

  localState.logoutConfirm = true
}

// 访问受限处理
function handleLimitedAccess() {
  if (localState.limitedAccessConfirm) {
    return
  }

  const handler = () => {
    return logoutAndReLogin()
  }

  MessageBox
    .confirm(
      '无权限操作，是否注销并重新登录',
      '访问受限',
      {
        confirmButtonText: '注销并重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
      })
    .then(handler)
    .finally(() => {
      localState.limitedAccessConfirm = false
    })

  localState.limitedAccessConfirm = true
}

async function gotoReLogin() {
  await store.dispatch('user/clearUpLoginStatus')

  await router.push({
    name: 'Login',
    query: {
      redirect: router.currentRoute.fullPath,
    },
  })
}

export function closeReLoginConfirm() {
  if (localState.logoutConfirm || localState.limitedAccessConfirm) {
    MessageBox.close()
    localState.logoutConfirm = false
    localState.limitedAccessConfirm = false
  }
}

export default service
