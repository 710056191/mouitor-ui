import request from '@/utils/request'

export function findPage(params) {
  return request({
    url: '/camera/page',
    method: 'get',
    params,
  })
}

export function fireQuickSetting(data) {
  return request.post('/camera/setAllPic.do', data)
}

export function startImageAnalysis(data) {
  return request.post('/camera/runPicAlarm.do', data)
}

export function getById(data) {
  return request({
    url: '/camera/getById',
    method: 'post',
    data,
  })
}

export function add(data) {
  return request({
    url: '/camera/add',
    method: 'post',
    data,
  })
}

export function update(data) {
  return request({
    url: '/camera/update',
    method: 'post',
    data,
  })
}

// list 报警记录
export function findDevAlarm(data) {
  return request({
    url: '/camera/findDevAlarm',
    method: 'post',
    data,
  })
}

export function del(data) {
  return request({
    url: '/camera/del',
    method: 'post',
    data,
  })
}

/**
 * 获取基准图片相关配置
 * @param id
 * @return {AxiosPromise}
 */
export function getBenchmarkPictureConfig(id) {
  return request({
    url: '/camera/cameraPic.do',
    method: 'get',
    params: { id },
  })
}

/**
 * 获取摄像头截图图片列表
 * @param id
 * @return {AxiosPromise}
 */
export function getCameraScreenshots(id) {
  return request({
    url: '/camera/getPic.do',
    method: 'post',
    data: { id },
  })
}

/**
 * 设置基准图片
 * @param id
 * @param {string} imageUrl
 * @return {AxiosPromise}
 */
export function setBenchmarkPic(id, imageUrl) {
  return request({
    url: '/camera/setPic.do',
    method: 'post',
    data: {
      id,
      img: imageUrl,
    },
  })
}
