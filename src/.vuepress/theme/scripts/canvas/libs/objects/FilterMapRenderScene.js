import {
  Scene,
  WebGLRenderTarget,
  UnsignedByteType,
  FloatType
} from 'three'

import Data from '../../store/Data'

export default class FilterMapRenderScene extends Scene {
  constructor() {
    super()
    this.renderTarget = null
    this.init()
  }

  init() {
    this.renderTarget = new WebGLRenderTarget(16,16, {
      type: (Data.isMobile) ? UnsignedByteType : FloatType,
      depthBuffer: false,
      stencilBuffer: false
    })
    this.renderTarget.texture.generateMipmaps = false
  }

  get texture(){
    return this.renderTarget.texture
  }

  size(width, height) {
    ratio = window.devicePixelRatio || 1
    this.renderTarget.setSize(width*ratio, height*ratio)
  }

  render(renderer, camera) {
    renderer.render(this,camera,this.renderTarget)
  }
}
