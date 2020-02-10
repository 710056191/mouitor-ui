import LRU from 'lru-cache'

const apiCacheDefaultOption = {
  max: 500,
  maxAge: 1000 * 60 * 5, // 5 minutes
}

const defaultCache = new LRU(apiCacheDefaultOption)

export class ApiCache {
  cache = defaultCache

  state = {}

  constructor(option) {
    if (option && option.cache) {
      this.cache = option.cache
    }
  }

  register(key, fetchHandler) {
    if (this.state[key]) {
      throw new Error(`${key} already registered`)
    }

    this.state[key] = {
      fetchHandler,
      pending: null,
    }
  }

  fetch(key) {
    return new Promise((resolve, reject) => {
      const value = this.cache.get(key)
      if (value !== undefined) {
        return resolve(value)
      }

      const ctrl = this.state[key]
      if (!ctrl) {
        return reject(new Error(`${key} not registered`))
      }

      if (ctrl.pending) {
        return resolve(ctrl.pending)
      }

      const fetchRet = ctrl.fetchHandler()
      if (!fetchRet.then) {
        this.cache.set(key, fetchRet)
        return resolve(fetchRet)
      }

      ctrl.pending = fetchRet
        .then((res) => {
          this.cache.set(key, res)
          return res
        })
        .finally(() => {
          ctrl.pending = null
        })
      return resolve(ctrl.pending)
    })
  }
}

export default new ApiCache()
