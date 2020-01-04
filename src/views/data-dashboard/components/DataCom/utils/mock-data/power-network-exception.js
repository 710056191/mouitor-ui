const length = 10

const dateList = []
const powerList = []
const networkList = []

for (let i = 0; i < length; i++) {
  const date = new Date(2019, 8, i + 1)
  dateList.push(`${date.getMonth() + 1}-${date.getDate()}`)

  powerList.push(49 + i * 5 - 2 * (i % 2))
  networkList.push(4 + (i % 3))
}

export default {
  dateList,
  powerList,
  networkList,
}
