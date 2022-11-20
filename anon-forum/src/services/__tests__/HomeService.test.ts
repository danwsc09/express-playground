import { HomeService } from '..'

describe('main controller', () => {
  it('should return a simple hello', () => {
    const result = HomeService.getMain()
    expect(result).toEqual('from home controller~')
  })
})
