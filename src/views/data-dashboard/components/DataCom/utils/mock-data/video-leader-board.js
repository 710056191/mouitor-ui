const length = 8

const list = []

for (let i = 0; i < length; i++) {
  list.push({
    name: '骏和广场6楼监控群组',
    value: 0.99 - (0.1 * i),
  })
}

export default {
  list,
}
