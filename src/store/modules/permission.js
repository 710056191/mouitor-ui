// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import EmptyWrapper from '@/layout/EmptyWrapper'
import { asyncRoutes, attachToMapRoute, constantRoutes } from '@/router'
import managementModuleMap from '@/router/modules/management-modules'

import { getPermission } from '@/api/user'
import { deepFreeze } from '@/utils'

// -----------------------------------------------------------------------------
// 类型声明
// -----------------------------------------------------------------------------

/**
 * 后端返回的权限相关信息
 *
 * 权限信息就是菜单信息
 * @typedef {Object} permission~item
 * @property {number} id
 * @property {string} name
 * @property {number | null} parentID
 * @property {string} permission - 目前使用该唯一标识符匹配前端路由
 * @property {number} level - 表示菜单层级，目前前端没有使用
 * @property {number} orderVal - 顺序，目前没有使用
 * @property {number} type - unknown property
 * @property {string} url - 无用，因为 url 是旧系统的 url，所以目前由前端自行定义路由
 */

/**
 * 菜单 item
 * @typedef {Object} menu~item
 * @property {number} id
 * @property {string} name
 * @property {Array<menu~item>} children
 * @property {string} viewId
 * @property {number|null} parentID
 * @property {number} orderVal
 * @property {boolean} isTop
 */

// -----------------------------------------------------------------------------
// store
// -----------------------------------------------------------------------------

const state = {
  // 所有注册的路由
  routes: [],

  // 接口返回的权限信息
  /** @type {Array<permission~item>} */
  permissions: [],

  // 动态添加的路由
  addedRoutes: [],

  // 导航路由，页面 view
  navRoutes: [],

  // 加载权限信息的状态
  loadStatus: {
    pending: null,
    loaded: false, // 加载完成；注意：成功才算完成
  },
}

const mutations = {
  SET_NAV_ROUTES: (state, navRoutes) => {
    state.navRoutes = navRoutes
  },

  SET_ROUTES: (state, routes) => {
    state.addedRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },

  SET_LOAD_STATUS: (state, status) => {
    state.loadStatus = {
      ...state.loadStatus,
      ...status,
    }
  },
}

const actions = {
  // 加载权限信息
  loadPermission({ commit, state }) {
    if (state.loadStatus.pending) {
      return Promise.resolve(state.loadStatus.pending)
    }

    const pending = getPermission()
      .then(response => {
        const { data } = response

        if (!Array.isArray(data)) {
          console.warn('loadPermission: getPermission 加载的菜单不是数组', data)
        }

        commit('SET_PERMISSIONS', deepFreeze(data))
        commit('SET_LOAD_STATUS', { loaded: true, pending: null })
        return data
      })
      .catch((error) => {
        commit('SET_LOAD_STATUS', { loaded: false, pending: null })
        return Promise.reject(error)
      })

    commit('SET_LOAD_STATUS', { pending })
    return pending
  },

  // 生成路由
  generateRoutes({ commit }, permissions) {
    return new Promise(resolve => {
      // 生成导航菜单
      const navMenus = generateMenuTree(permissions)
      orderMenu(navMenus)
      // 生成导航菜单路由
      const navRoutes = generateRoutesByMenu(navMenus)
      // 添加至 地图 路由下面
      const mapRoute = attachToMapRoute(navRoutes)
      const accessedRoutes = [mapRoute].concat(asyncRoutes)

      commit('SET_NAV_ROUTES', navRoutes)
      commit('SET_ROUTES', accessedRoutes)

      resolve(accessedRoutes)
    })
  },

}

const getters = {
  // hasLoad
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

/**
 * 生成树状菜单
 * @param {Array<permission~item>} permissions
 * @returns {Array<menu~item>}
 */
function generateMenuTree(permissions) {
  const top = []
  const sub = []
  const menuMap = {}

  for (const permissionItem of permissions) {
    const isTop = permissionItem.parentID == null
    const menuItem = createMenuItem(permissionItem, { isTop })

    isTop ? top.push(menuItem) : sub.push(menuItem)
    menuMap[permissionItem.id] = menuItem
  }

  for (const subItem of sub) {
    const parent = menuMap[subItem.parentID]
    if (!parent) {
      continue
    }
    parent.children.push(subItem)
  }
  return top
}

/**
 * 递归遍历菜单 ，根据 orderVal 从小到大排序
 * @param {Array<menu~item>} menus
 * @returns {undefined}
 */
function orderMenu(menus) {
  if (!Array.isArray(menus) || !menus.length) {
    return
  }

  for (let i = 0; i < menus.length; i++) {
    menus[i].children && orderMenu(menus[i].children)
  }

  menus.sort((a, b) => {
    return a.orderVal - b.orderVal
  })
}

/**
 * 递归遍历菜单，生成路由对象
 * @param {Array<menu~item>} menus
 * @return {Array|undefined}
 */
function generateRoutesByMenu(menus) {
  if (!Array.isArray(menus) || !menus.length) {
    return undefined
  }

  const routes = []
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    const route = createRouteConfig(menu)
    if (!route) {
      // 跳过无法创建路由的 menu item
      continue
    }

    let children = route.children || []

    if (menu.children && menu.children.length) {
      const added = generateRoutesByMenu(menu.children)
      added && (children = children.concat(added))
    }

    children.length && (route.children = children)
    if (menu.isTop) {
      route.redirect = 'noRedirect'
    }
    routes.push(route)
  }
  return routes
}

/**
 * createMenuItem
 * @param {permission~item} item
 * @param isTop
 * @return {menu~item}
 */
function createMenuItem(item, { isTop } = {}) {
  const {
    id,
    name,
    permission,
    parentID,
    orderVal,
  } = item
  return {
    id,
    name,
    children: [],
    viewId: permission, // 将用该属性匹配 前端 的 view
    parentID,
    orderVal,
    isTop,
  }
}

/**
 * 生成 RouteConfig
 * @param {menu~item} menuItem
 * @return {RouteConfig|null}
 */
function createRouteConfig(menuItem) {
  const viewId = menuItem.viewId
  const isTop = menuItem.isTop

  const module = managementModuleMap.get(viewId)
  if (!module) {
    console.warn(`[${menuItem.viewId}(${menuItem.name})] can't find the corresponding config`)
    return null
  }

  const moduleRoute = module.route
  const oneNodeOnly = isTop || !(Array.isArray(module.routes) && module.routes.length)

  let title = menuItem.name || moduleRoute.meta.title
  if (!title) {
    console.warn(`[${menuItem.viewId}] is no name`)
    title = 'Unknown Name'
  }

  if (!(process.env.NODE_ENV === 'production')) {
    if (menuItem.name !== moduleRoute.meta.title) {
      console.warn(`[${menuItem.viewId}(${menuItem.name})] ` +
        `The default name(${moduleRoute.meta.title}) is different from the latest name(${menuItem.name})` +
        ', please update to consistency')
    }
  }

  const newModuleRoute = Object.assign(
    {},
    moduleRoute,
  )
  newModuleRoute.meta = Object.assign(
    {},
    moduleRoute.meta,
    { title },
  )

  let routeConfig

  if (oneNodeOnly) {
    routeConfig = {
      ...newModuleRoute,
      path: module.path,
    }
    isTop && (routeConfig.component = EmptyWrapper)
  } else {
    routeConfig = {
      path: module.path,
      component: EmptyWrapper,
      meta: {
        title,
        isModuleWrapper: true,
      },
      children: [
        newModuleRoute,
        ...module.routes,
      ],
    }
  }
  return routeConfig
}
