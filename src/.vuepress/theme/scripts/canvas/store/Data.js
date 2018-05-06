import MobileDetect from 'mobile-detect'
import Loader from '../libs/util/Loader';

class Data {
  constructor() {
    this.canvas = {
      width: 0,
      height: 0
    }
    this.loader = new Loader()
  }
  init() {
    this.md = new MobileDetect(window.navigator.userAgent)
  }

  get isMobile() {
    return (this.md.mobile()) ? true : false
  }
}
export default new Data()
