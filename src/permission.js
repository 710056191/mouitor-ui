import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { closeReLoginConfirm } from '@/utils/request'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// no redirect whitelist
const whiteList = [
  '/login',
  '/404',
  '/403',
]

const freePermissionList = [
  '/404',
  '/403',
]

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置 页面 title
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  /* 没有 token */
  if (!hasToken) {
    if (whiteList.includes(to.path)) {
      // 在免登录白名单中，直接进入
      closeReLoginConfirm()
      next()
    } else {
      // 其他需要权限访问的页面将重定向到登录页面
      // next(`/login?redirect=${to.path}`)
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
        },
      })
      NProgress.done()
    }
    return
  }

  /* 有 token */

  /* 跳转的是登录页 */
  if (to.path === '/login') {
    // 已登录，重定向到主页
    next({ path: '/' })
    NProgress.done()
    return
  }

  /* 跳转的不是登录页 */

  /* 确定是否获取了当前用户的权限信息 */
  if (store.getters.permissionLoaded) {
    // 已获取，有权限
    if (store.getters.havePermission) {
      next()
      return
    }

    // 已获取，无权限
    // 跳转 403 页面

    if (freePermissionList.includes(to.path)) {
      // 在免权限名单中，直接进入
      next()
    } else {
      next({
        name: 'Page403',
        query: {
          redirect: to.fullPath,
        },
      })
    }
    return
  }

  /* 没有权限信息，进行获取 */
  try {
    const permissions = await store.dispatch('permission/loadPermission')

    // 根据菜单生成可访问路由映射
    const accessRoutes = await store.dispatch('permission/generateRoutes', permissions)

    // 动态添加路由
    router.addRoutes(accessRoutes)

    // hack method to ensure that addRoutes is complete
    // set the replace: true, so the navigation will not leave a history record
    next({ ...to, replace: true })
  } catch (error) {
    let errorMsg = ''

    if (typeof error === 'string') {
      errorMsg = error
    } else if (error && error.data && error.data.message) {
      errorMsg = error.data.message
    }
    errorMsg && Message.error(errorMsg)

    // 清除登录状态，进入登录页面重新登录
    await store.dispatch('user/clearUpLoginStatus')
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

