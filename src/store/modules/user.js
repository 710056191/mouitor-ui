import { login, logout } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  saveUserName,
  getUserName,
} from '@/utils/auth'
import { resetRouter } from '@/router'
import validateLicense from '../libs/license'

const state = {
  token: getToken(),
  name: getUserName(),
  avatar: '',
  roles: [], // 暂时保留 角色 这个字段，万一后续需要

  license: {},
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },

  SET_LICENSE(state, license) {
    state.license = Object.assign({}, license)
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), password: password.trim() }).then(response => {
        const { data: { user = {}, userToken: { token }}} = response
        commit('SET_TOKEN', token)
        setToken(token)

        commit('SET_NAME', user.username)
        saveUserName(user.username)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  async logout({ commit, state, dispatch }) {
    let sendLogoutError

    try {
      await logout()
    } catch (error) {
      const response = error.data
      const apiResultCode = response && response.resultCode

      // 注销接口，忽略以下错误，当做成功，继续后续逻辑
      //  -10: 登录失效
      //  -11: 无权限
      if (!(apiResultCode === -10 || apiResultCode === -11)) {
        sendLogoutError = error
      }
    }

    if (sendLogoutError) {
      return Promise.reject(sendLogoutError)
    }

    await dispatch('clearUpLoginStatus')
  },

  // 清除登录状态
  async clearUpLoginStatus({ dispatch }) {
    dispatch('resetToken')
    resetRouter()
  },

  // remove token
  resetToken({ commit }) {
    commit('SET_TOKEN', '')
    commit('permission/SET_LOAD_STATUS', { loaded: false, pending: null }, { root: true })
    removeToken()
  },

  // 验证许可证
  async verifyLicense({ commit }) {
    const info = await validateLicense()
    commit('SET_LICENSE', info)
    return info
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

