import { createToBeValidMatcher } from '../../../helper/matchers'

import {
  isIpv4Address,
  isPortNumber,
} from '@/utils/validation/network'

describe('Utils:validation:network', () => {
  beforeAll(() => {
    expect.extend(createToBeValidMatcher())
  })

  it('isIpv4Address', () => {
    const validatorOptions = { name: 'Ipv4Address' }

    const matching = [
      '0.0.0.0',
      '127.0.0.1',
      '1.12.123.255',
      '255.123.12.0',
      '255.255.255.255',
    ]

    const mismatching = [
      '0',
      '1.',
      '1.1.1',
      'a.b.c.d',
      '1.1.1.1234',
      '1.1.1.123.1',
      '1.1.1.123a',
      '0001.1.1.123',
      '256.255.255.255',
      '255.256.255.255',
      '255.255.256.255',
      '255.255.255.256',
      '-1.1.1.1',
    ]

    matching.forEach(item => {
      expect(item).toBeValid(isIpv4Address, validatorOptions)
    })
    mismatching.forEach(item => {
      expect(item).not.toBeValid(isIpv4Address, validatorOptions)
    })
  })

  it('isPortNumber', () => {
    const validatorOptions = { name: 'PortNumber' }

    const matching = [
      1,
      10,
      1234,
      65535,
      '1',
      '10',
      '1234',
      '65535',
    ]

    const mismatching = [
      -1,
      0,
      65536,
      '-1',
      '0',
      '65536',
      'a',
      '+1',
      '1.0',
    ]

    matching.forEach(item => {
      expect(item).toBeValid(isPortNumber, validatorOptions)
    })
    mismatching.forEach(item => {
      expect(item).not.toBeValid(isPortNumber, validatorOptions)
    })
  })
})
