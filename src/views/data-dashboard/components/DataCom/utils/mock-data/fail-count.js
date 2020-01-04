// 故障数量统计

const list = [
  { name: '风扇', value: 1 },
  { name: '设备箱', value: 46 },
  { name: '摄像头', value: 2 },
  { name: '光猫', value: 1 },
]

const names = list.map(item => item.name)

const values = list.map(item => item.value)

export default {
  list,
  names,
  values,
}
