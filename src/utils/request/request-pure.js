import { createPureInstance, injectCommonRequestHeaders } from './common'

const service = createPureInstance()

service.interceptors.request.use(
  config => {
    injectCommonRequestHeaders(config)
    return config
  },
)

export default service
