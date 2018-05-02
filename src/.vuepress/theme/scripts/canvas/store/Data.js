import MobileDetect from 'mobile-detect'

class Data {
  constructor() {
    this.canvas = {
      width: 0,
      height: 0
    }
  }
  init() {
    this.md = new MobileDetect(window.navigator.userAgent)
  }

  get isMobile() {
    return (this.md.mobile()) ? true : false
  }
}
export default new Data()
