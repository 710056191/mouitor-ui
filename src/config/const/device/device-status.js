// 状态
export const Status = {
  normal: '0', // 正常
  abnormal: '1', // 故障
  alarmed: '2', // 报警
  disable: '3', // 停用
  initialized: '4', // 未启用 // 设置成该状态时，代表 "停用" ，其他的都代表 "启用"
}

// 状态文本
export const StatusText = {
  [Status.normal]: '正常',
  [Status.abnormal]: '故障',
  [Status.alarmed]: '报警',
  [Status.disable]: '停用',
  [Status.initialized]: '未启用',
}

// 故障状态
export const FaultStatus = {
  temperature: '1', // 温度
  humidity: '2', // 湿度
  voltage: '3', // 电压
  network: '4', // 网络
  power: '5', // 断电
  other: '6', // 其他
}

// 故障状态文本
export const FaultStatusText = {
  [FaultStatus.temperature]: '温度异常',
  [FaultStatus.humidity]: '湿度异常',
  [FaultStatus.voltage]: '电压异常',
  [FaultStatus.network]: '网络异常',
  [FaultStatus.power]: '断电异常',
  [FaultStatus.other]: '其他',
}

// ip批量修改进度状态
export const ipUpdateStatus = {
  wait: '0', // 待修改
  waiting: '1', // 修改中
  success: '2', // 修改成功
  fail: '3', // 修改失败
}

// ip批量修改状态文本
export const ipUpdateStatusText = {
  [ipUpdateStatus.wait]: '待修改',
  [ipUpdateStatus.waiting]: '修改中',
  [ipUpdateStatus.success]: '修改成功',
  [ipUpdateStatus.fail]: '修改失败',
}
