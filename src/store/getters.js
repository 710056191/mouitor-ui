const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userName: state => state.user.name,
  permission_routes: state => state.permission.routes,
  navRoutes: state => state.permission.navRoutes,
  permissionLoaded: state => state.permission.loadStatus.loaded,
  havePermission: state => state.permission.permissions && state.permission.permissions.length > 0,
}
export default getters