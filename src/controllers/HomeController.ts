import { IRequest, IResponse } from '@/interfaces'

class HomeController {
  static get(req: IRequest, res: IResponse) {
    res.send('from home controller~!')
  }
}

export default HomeController
