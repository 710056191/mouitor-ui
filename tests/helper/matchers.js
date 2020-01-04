/*
createToBeValid('Email')

expect.extend(matchers)
 */

export function createToBeValidMatcher(name = '', options = {}) {
  const outputName = name

  const { matcherName = 'toBeValid' } = options

  return {
    [matcherName](received, validator, options = {}) {
      const { name = outputName } = options

      if (validator(received)) {
        return {
          message: () => `${name} "${received}" should NOT be valid`,
          pass: true,
        }
      } else {
        return {
          message: () => `${name} "${received}" should be valid`,
          pass: false,
        }
      }
    },
  }
}
