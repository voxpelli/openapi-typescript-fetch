import {
  FetchArgType,
  Fetcher,
  FetchErrorType,
  FetchReturnType,
  OpArgType,
  OpDefaultReturnType,
  OpErrorType,
  OpReturnType,
} from '../src'
import { paths as paths2 } from './examples/stripe-openapi2'
import { paths as paths3 } from './examples/stripe-openapi3'

type Op2 = paths2['/v1/account_links']['post']

// currently only application/json is supported for body
type Op3 = Omit<paths3['/v1/account_links']['post'], 'requestBody'> & {
  requestBody: {
    content: {
      'application/json': paths3['/v1/account_links']['post']['requestBody']['content']['application/x-www-form-urlencoded']
    }
  }
}

interface Openapi2 {
  Argument: OpArgType<Op2>
  Return: OpReturnType<Op2>
  Default: Pick<OpDefaultReturnType<Op2>['error'], 'type' | 'message'>
  Error: Pick<OpErrorType<Op2>['data']['error'], 'type' | 'message'>
}

interface Openapi3 {
  Argument: OpArgType<Op3>
  Return: OpReturnType<Op3>
  Default: Pick<OpDefaultReturnType<Op3>['error'], 'type' | 'message'>
  Error: Pick<OpErrorType<Op3>['data']['error'], 'type' | 'message'>
}

type Same<A, B> = A extends B ? (B extends A ? true : false) : false

describe('infer', () => {
  it('argument', () => {
    const same: Same<Openapi2['Argument'], Openapi3['Argument']> = true
    expect(same).toBe(true)

    const arg: Openapi2['Argument'] = {} as any
    expect(arg.account).toBeUndefined()
  })

  it('return', () => {
    const same: Same<Openapi2['Return'], Openapi3['Return']> = true
    expect(same).toBe(true)

    const ret: Openapi2['Return'] = {} as any
    expect(ret.url).toBeUndefined()
  })

  it('default', () => {
    const same: Same<Openapi2['Default'], Openapi3['Default']> = true
    expect(same).toBe(true)
  })

  it('error', () => {
    const same: Same<Openapi2['Error'], Openapi3['Error']> = true
    expect(same).toBe(true)
  })

  describe('fetch', () => {
    const fetcher = Fetcher.for<paths2>()
    const createLink = fetcher.path('/v1/account_links').method('post').create()

    type Arg = FetchArgType<typeof createLink>
    type Ret = FetchReturnType<typeof createLink>
    type Err = FetchErrorType<typeof createLink>

    it('argument', () => {
      const same: Same<Arg, Openapi2['Argument']> = true
      expect(same).toBe(true)
    })

    it('return', () => {
      const same: Same<Ret, Openapi2['Return']> = true
      expect(same).toBe(true)
    })

    it('error', () => {
      const same: Same<
        Err,
        OpErrorType<paths2['/v1/account_links']['post']>
      > = true
      expect(same).toBe(true)
    })

    const err: Err = { data: { error: {} } } as any
    expect(err.data.error.charge).toBeUndefined()
  })
})
