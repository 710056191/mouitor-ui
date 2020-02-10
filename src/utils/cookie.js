import JSCookies from 'js-cookie'
import { APP_PREFIX } from '@/utils/project-env'

const COOKIE_PREFIX = APP_PREFIX + '_'

const _instance = JSCookies.withConverter(() => {})

const Cookies = function(key, ...args) {
  // return _instance.apply(this, [COOKIE_PREFIX + key, ...args])
  return _instance.call(this, COOKIE_PREFIX + key, ...args)
}

for (const func of ['set', 'get', 'getJSON', 'remove']) {
  Cookies[func] = function(key, ...args) {
    // return _instance[func].apply(this, [COOKIE_PREFIX + key, ...args])
    return _instance[func].call(this, COOKIE_PREFIX + key, ...args)
  }
}

export default Cookies
