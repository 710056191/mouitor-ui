/**
 * module 说明
 *
 * moduleId: 'permission'         与接口的 permission 匹配
 * path: ''                       该模块的 路由 path ，如果未设置，默认为 moduleId
 *
 * route                          该模块默认 view 的 RouteConfig
 *  path: ''                      PS: 不可设置，固定为 ''
 *  name: 'RouteName'             路由的名字，一定要写；使用 PascalCase ；与对应 Vue 组件 name 一致；保持唯一
 *  meta.title                    模块标题，会被接口里的名称覆盖
 *
 * routes                         该模块的其他 views 的 RouteConfig
 */

const modules = [
  /* 基本数据 */
  {
    moduleId: 'basicData',
    path: 'basic-data',
    route: {
      name: 'BasicData',
      meta: {
        title: '基本数据',
        icon: 'nav-basic',
      },
    },
  },
  {
    moduleId: 'manufacturer',
    route: {
      name: 'Manufacturer',
      component: () => import('@/views/baseData/manufacturer'),
      meta: {
        title: '供应商库',
      },
    },
    routes: [
    ],
  },
  {
    moduleId: 'deviceLibrary',
    route: {
      name: 'DeviceLibrary',
      component: () => import('@/views/baseData/deviceLibrary'),
      meta: {
        title: '设备库',
      },
    },
    routes: [
      // {
      //   name: 'DeviceLibraryAdd',
      //   path: 'deviceLibraryAdd',
      //   component: () => import('@/views/baseData/deviceLibrary/DeviceLibraryAdd'),
      //   meta: {
      //     title: '新增设备库',
      //   },
      // },
      {
        name: 'DeviceLibraryEdit',
        path: 'deviceLibraryEdit',
        component: () => import('@/views/baseData/deviceLibrary/components/DeviceLibraryEdit'),
        meta: {
          title: '编辑设备库',
        },
      },
    ],
  },
  {
    moduleId: 'procurement',
    route: {
      name: 'Procurement',
      component: () => import('@/views/baseData/procurement'),
      meta: {
        title: '采购库',
      },
    },
    routes: [
      // {
      //   name: 'ProcurementAdd',
      //   path: 'procurementAdd',
      //   component: () => import('@/views/baseData/procurement/ProcurementAdd'),
      //   meta: {
      //     title: '新增采购商',
      //   },
      // },
      {
        name: 'ProcurementEdit',
        path: 'ProcurementEdit',
        component: () => import('@/views/baseData/procurement/components/ProcurementEdit'),
        meta: {
          title: '编辑采购商',
        },
      },
    ],
  },

  /* 设备管理 */
  {
    moduleId: 'machineSetting',
    path: 'device',
    route: {
      name: 'MachineSetting',
      meta: {
        title: '设备箱管理',
        icon: 'nav-device',
      },
    },
  },
  {
    moduleId: 'device',
    path: 'setting',
    route: {
      name: 'DeviceSetting',
      component: () => import('@/views/device/setting'),
      meta: {
        title: '设备箱设置',
      },
    },
    routes: [
      {
        name: 'DeviceRelatedDevice',
        path: 'related-device',
        component: () => import('@/views/device/setting/related-device'),
        meta: {
          title: '关联设备',
        },
      },
      {
        name: 'DeviceSettingThreshold',
        path: 'threshold',
        component: () => import('@/views/device/setting/threshold'),
        meta: {
          title: '设备阈值',
        },
      },
    ],
  },
  {
    moduleId: 'deviceV1',
    path: 'settingV1',
    route: {
      name: 'V1DeviceSetting',
      component: () => import('@/views/device/settingV1'),
      meta: {
        title: '设备箱设置（改版）',
      },
    },
    routes: [
      {
        name: 'V1DeviceRelatedDevice',
        path: 'related-devicev1',
        component: () => import('@/views/device/settingV1/related-device'),
        meta: {
          title: '关联设备(改版)',
        },
      },
      {
        name: 'V1DeviceSettingThreshold',
        path: 'threshold',
        component: () => import('@/views/device/settingV1/threshold'),
        meta: {
          title: '设备阈值',
        },
      },
    ],
  },
  {
    moduleId: 'groupingManage',
    route: {
      name: 'GroupingManage',
      component: () => import('@/views/device/GroupingManage.vue'),
      meta: {
        title: '设备分组定义',
      },
    },
  },
  {
    moduleId: 'deviceGrouping',
    route: {
      name: 'DeviceGrouping',
      component: () => import('@/views/device/DeviceGrouping.vue'),
      meta: {
        title: '设备分组管理',
      },
    },
  },
  {
    moduleId: 'tempDevice',
    route: {
      name: 'TempDevice',
      component: () => import('@/views/uninit-device'),
      meta: {
        title: '未初始化设备',
      },
    },
  },
  {
    moduleId: 'deviceUser',
    route: {
      name: 'DeviceUserManage',
      component: () => import('@/views/device/DeviceUserManage.vue'),
      meta: {
        title: '用户与设备关联',
      },
    },
  },
  {
    moduleId: 'lightTimeSet',
    route: {
      name: 'LightTimeSet',
      component: () => import('@/views/device/LightTimeSet.vue'),
      meta: {
        title: '补光灯时间设置',
      },
    },
  },

  /* 摄像头管理 */
  {
    moduleId: 'cameraManage',
    path: 'camera',
    route: {
      name: 'Camera',
      meta: {
        title: '摄像头管理',
        icon: 'nav-camera',
      },
    },
  },
  {
    moduleId: 'camera',
    path: 'manage',
    route: {
      name: 'CameraManage',
      component: () => import(/* webpackChunkName: "views/camera/manage" */'@/views/camera/manage.vue'),
      meta: {
        title: '摄像头设置',
      },
    },
    routes: [
      {
        name: 'CameraManageThreshold',
        path: 'threshold',
        component: () => import('@/views/camera/manage/threshold.vue'),
        meta: {
          title: '图片分析阀值',
        },
      },
      {
        name: 'CameraManageAlarm',
        path: ':id/alarm',
        component: () => import('@/views/camera/manage/alarm.vue'),
        meta: {
          title: '报警记录',
        },
      },
      {
        name: 'CameraManageProtocol',
        path: ':id/protocol',
        component: () => import('@/views/camera/manage/protocol.vue'),
        meta: {
          title: '通信协议',
        },
      },
      {
        name: 'CameraManageBenchmarkPic',
        path: ':id/benchmark-pic',
        component: () => import('@/views/camera/manage/benchmark-pic.vue'),
        meta: {
          title: '基准图片',
        },
      },
    ],
  },
  {
    moduleId: 'cameraV1',
    path: 'manageV1',
    route: {
      name: 'V1CameraManage',
      component: () => import(/* webpackChunkName: "views/camera/manage" */'@/views/camera1/manage.vue'),
      meta: {
        title: '摄像头设置（改版）',
      },
    },
    routes: [
      {
        name: 'CameraManageThreshold',
        path: 'threshold',
        component: () => import('@/views/camera/manage/threshold.vue'),
        meta: {
          title: '图片分析阀值',
        },
      },
      {
        name: 'CameraManageAlarm',
        path: ':id/alarm',
        component: () => import('@/views/camera/manage/alarm.vue'),
        meta: {
          title: '报警记录',
        },
      },
      {
        name: 'CameraManageProtocol',
        path: ':id/protocol',
        component: () => import('@/views/camera/manage/protocol.vue'),
        meta: {
          title: '通信协议',
        },
      },
      {
        name: 'CameraManageBenchmarkPic',
        path: ':id/benchmark-pic',
        component: () => import('@/views/camera/manage/benchmark-pic.vue'),
        meta: {
          title: '基准图片',
        },
      },
    ],
  },

  /* 数据报表 */
  {
    moduleId: 'reportMenu',
    path: 'data-report',
    route: {
      name: 'DataReport',
      meta: {
        title: '数据报表',
        icon: 'nav-data',
      },
    },
  },
  {
    moduleId: 'feeRule',
    route: {
      name: 'FeeRule',
      component: () => import('@/views/datareport/feeRule.vue'),
      meta: {
        title: '费用规则管理',
      },
    },
  },
  {
    moduleId: 'electricReport',
    route: {
      // name: '', // TODO: 更改组件 name
      component: () => import('@/views/datareport/electricReport.vue'),
      meta: {
        title: '电力',
      },
    },
  },
  {
    moduleId: 'networkReport',
    route: {
      // name: '', // TODO: 更改组件 name
      component: () => import('@/views/datareport/netReport.vue'),
      meta: {
        title: '网络',
      },
    },
  },
  {
    moduleId: 'feeList',
    route: {
      // name: '', // TODO: 更改组件 name
      component: () => import('@/views/datareport/faultReport.vue'),
      meta: {
        title: '故障清单',
      },
    },
  },
  {
    moduleId: 'report',
    route: {
      path: 'analyze',
      name: 'ReportAnalyze',
      component: () => import('@/views/datareport/analyze.vue'),
      meta: {
        title: '统计分析',
      },
    },
  },

  /* 系统管理 */
  {
    moduleId: 'system',
    path: 'system',
    route: {
      name: 'System',
      meta: {
        title: '系统管理',
        icon: 'nav-system',
      },
    },
  },
  {
    moduleId: 'user',
    route: {
      name: 'User',
      component: () => import('@/views/system/user.vue'),
      meta: {
        title: '用户信息',
      },
    },
  },
  {
    moduleId: 'role',
    route: {
      // name: '', // TODO: 更改组件 name
      component: () => import('@/views/system/role.vue'),
      meta: {
        title: '角色管理',
      },
    },
  },
  {
    moduleId: 'config',
    route: {
      name: 'SysConfig',
      component: () => import('@/views/system/config.vue'),
      meta: {
        title: '系统配置管理',
      },
    },
  },
  {
    moduleId: 'installDevice',
    route: {
      name: 'InstallDevice',
      component: () => import('@/views/system/install.vue'),
      meta: {
        title: '搜索设备',
      },
    },
  },
  {
    moduleId: 'firmware',
    route: {
      name: 'SysFirmware',
      component: () => import('@/views/system/firmware.vue'),
      meta: {
        title: '固件设置',
      },
    },
  },
  {
    moduleId: 'firmwareUpdate',
    route: {
      name: 'FirmwareUpdate',
      component: () => import('@/views/system/firmware-update.vue'),
      meta: {
        title: '设备固件升级',
      },
    },
  },
  {
    moduleId: 'dataCenter',
    path: 'backup',
    route: {
      name: 'SystemDataBackup',
      component: () => import('@/views/system/backup.vue'),
      meta: {
        title: '数据备份',
      },
    },
  },
  {
    moduleId: 'sysLog',
    path: 'log',
    route: {
      name: 'SysLog',
      component: () => import('@/views/system/log.vue'),
      meta: {
        title: '日志管理',
      },
    },
  },

  /* 工单管理 */
  {
    moduleId: 'workorder',
    path: 'workorder',
    route: {
      name: 'Workorder',
      meta: {
        title: '工单管理',
        icon: 'nav-workorder',
      },
    },
  },
  {
    moduleId: 'accendant',
    path: 'accendant',
    route: {
      name: 'Accendant',
      component: () => import('@/views/workorder/accendant.vue'),
      meta: {
        title: '工单设置',
      },
    },
  },
  {
    moduleId: 'workorderSet',
    path: 'workorderSet',
    route: {
      name: 'WorkorderSet',
      component: () => import('@/views/workorder/workorder.vue'),
      meta: {
        title: '工单管理',
      },
    },
  },
]

const moduleMap = new Map()

modules.forEach(module => {
  const { moduleId, route } = module
  if (moduleMap.has(moduleId)) {
    console.error(`There is a duplicate moduleId[${moduleId}]`)
    return
  }

  if (module.path === undefined) {
    module.path = moduleId
  }
  route.path = ''
  route.meta || (route.meta = {})

  moduleMap.set(moduleId, module)
})

export default moduleMap
