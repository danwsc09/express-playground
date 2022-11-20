import { IRequest, IResponse } from '@/interfaces'
import { HomeService } from '@/services'

class HomeController {
  static get(req: IRequest, res: IResponse) {
    res.send(HomeService.getMain())
  }
}

export default HomeController
