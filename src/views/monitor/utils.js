import { parseTime } from '@/utils'

export function getAll(begin, end) {
  var arr = []
  var ab = begin.split('-')
  var ae = end.split('-')
  var db = new Date()
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
  var de = new Date()
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
  var unixDb = db.getTime() - 24 * 60 * 60 * 1000
  var unixDe = de.getTime() - 24 * 60 * 60 * 1000
  for (var k = unixDb; k <= unixDe;) {
    // console.log((new Date(parseInt(k))).format());
    k = k + 24 * 60 * 60 * 1000
    arr.push(parseTime(new Date(parseInt(k)), '{m}-{d}'))
  }
  return arr
}

export function getDateCount(date = [], data = [], dateParam, dataParam) {
  const result = []
  date.forEach(item => {
    let flag = false
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (parseTime(new Date(data[i][dateParam]), '{m}-{d}') === item) {
          flag = true
          result.push(data[i][dataParam])
          break
        }
      }
      if (!flag) {
        result.push(0)
      }
    } else {
      result.push(0)
    }
  })
  return result
}
