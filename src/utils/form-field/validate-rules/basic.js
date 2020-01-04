export const requiredRule = {
  required: true,
  trigger: 'blur',
  validator(rule, value, callback) {
    if (!value || value.length < 1) {
      callback(new Error(`${rule.fullField}不能为空`))
    } else {
      callback()
    }
  },
}
