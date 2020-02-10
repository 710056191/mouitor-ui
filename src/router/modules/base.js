import Layout from '@/layout'
import EmptyWrapper from '@/layout/EmptyWrapper'

const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    meta: { title: '登录页' },
    hidden: true,
  },

  {
    path: '/403',
    name: 'Page403',
    component: () => import('@/views/403'),
    meta: { title: '无权限访问' },
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    meta: { title: '404' },
    hidden: true,
  },

  {
    path: '/demo',
    component: EmptyWrapper,
    children: [
      {
        path: '',
        name: 'demo',
        component: () => import('@/views/data-dashboard/components/DataCom/DataComVideoOnlineRate'),
        meta: { title: 'demo', icon: 'link' },
      },
    ],
  },

  {
    path: '/',
    component: Layout,
    redirect: '/map',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' },
    },
    {
      path: '/uploadTest',
      name: 'UploadTest',
      meta: { title: '上传测试' },
      component: () => import('@/views/demo/uploadTest.vue'),
      props: {
        registerRoutePath: '/map',
      },
    },
    {
      path: '/scrollTest',
      name: 'ScrollTest',
      meta: { title: '异常报告' },
      component: () => import('@/views/demo/scrollTest'),
    },
    ],
  },

  {
    path: '/bg-old',
    name: 'Bg',
    meta: { title: '设备环境智能监控系统' },
    component: () => import('@/views/monitor'),
  },
]

export default constantRoutes
