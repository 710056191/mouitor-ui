const length = 8

const rateList = []
const dateList = []

for (let i = 0; i < length; i++) {
  rateList.push(60 + i * 3)

  const date = new Date(2019, 8, i + 1)
  dateList.push(`${date.getMonth() + 1}-${date.getDate()}`)
}

export default {
  rateList,
  dateList,
}
