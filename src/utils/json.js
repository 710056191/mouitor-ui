function isWindow(obj) {
  return obj && obj.window === obj
}

function isVue(obj) {
  return obj && obj._isVue
}

function toJsonReplacer(key, value) {
  let val = value

  if (isWindow(value)) {
    val = '$WINDOW'
  } else if (value && window.document === value) {
    val = '$DOCUMENT'
  } else if (isVue(value)) {
    val = '$VUE'
  }

  return val
}

/**
 * toJson
 * @param {Object|Array|Date|string|number|boolean} obj
 * @param {boolean|number} [pretty=2]
 * @return {string|undefined}
 */
export function toJson(obj, pretty) {
  if (obj === undefined) return undefined

  const space = typeof pretty === 'number'
    ? pretty
    : (pretty ? 2 : null)
  return JSON.stringify(obj, toJsonReplacer, space)
}

/**
 * fromJson
 * @param {string} json
 * @return {Object|Array|string|number}
 */
export function fromJson(json) {
  return typeof json === 'string'
    ? JSON.parse(json)
    : json
}
