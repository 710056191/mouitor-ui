import Vue from 'vue'
import Router from 'vue-router'

/* Router Modules */
import baseRoutes from '@/router/modules/base'

import beforeGuardRedirectSafely from './before-guard-redirect-safely'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面；！！现已无用
 *                                或者如一些编辑页面/edit/1
 * alwaysShow: true               如果设置为 true ，一直显示根路由
 *                                如果设为 false ，当路由 children 声明的路由大于1个时，自动会变成嵌套的模式
 *                                只有一个时，不显示根路由，会将那个子路由当做根路由显示在侧边栏
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    设置该路由进入的权限，支持多个权限叠加
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字，也会用在浏览器标题
    icon: 'svg-name'             路由的图标
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示 (默认 true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页
 * 所有用户都可以访问
 */
export const constantRoutes = baseRoutes

/**
 * asyncRoutes
 * 需要根据用户权限动态加载的路由
 */
export const asyncRoutes = [
  // 通配路由，一定要放置在最后！！！
  { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

const router = createRouter()

if (!(process.env.NODE_ENV === 'production')) {
  // beforeGuardRedirectSafely 检测不完善，仅开发时启用
  router.beforeEach(beforeGuardRedirectSafely)
}

export function resetRouter() {
  // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 生成 /map 路径的路由
// 把导航菜单添加至 /map 下
export function attachToMapRoute(navRoutes) {
  return {
    path: '/map',
    name: 'Map',
    meta: { title: '地图' },
    component: () => import('@/layout/MapOverlay'),
    props: {
      registerRoutePath: '/map',
    },
    children: navRoutes,
  }
}

export default router
