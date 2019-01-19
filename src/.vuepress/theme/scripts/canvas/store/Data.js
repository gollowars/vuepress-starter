import MobileDetect from 'mobile-detect'
import Loader from '../libs/util/Loader';
import ColorDetector from '../libs/util/ColorDetector'

class Data {
  constructor() {
    this.canvas = {
      width: 0,
      height: 0
    }
    this.renderer = null
    this.camera = null
    this.loader = new Loader()
    this.colorDetector = ColorDetector
    this.time = 0
    this.last = 0


    // this.scene = null
    // this.didCreatedCanvas = false
    // this.items = []
    // this.store = Request
  }
  init() {
    this.md = new MobileDetect(window.navigator.userAgent)
  }

  get isMobile() {
    return (this.md.mobile()) ? true : false
  }
}
export default new Data()
