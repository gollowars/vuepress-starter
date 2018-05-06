import {
  Scene,
  WebGLRenderTarget,
  UnsignedByteType,
  FloatType,
  Object3D,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three'

import Data from '@canvas/store/Data'

export default class FilterMapRenderScene extends Scene {
  constructor() {
    super()
    this.renderTarget = null

    this.shape = null
    this.shapes = []
    this.init()
  }

  init() {
    this.renderTarget = new WebGLRenderTarget(16,16, {
      type: (Data.isMobile) ? UnsignedByteType : FloatType,
      depthBuffer: false,
      stencilBuffer: false
    })
    this.renderTarget.texture.generateMipmaps = false
    this._maskMake()
  }

  get texture(){
    return this.renderTarget.texture
  }

  resize(width, height) {
    const ratio = window.devicePixelRatio || 1
    this.width = width
    this.height = height
    this.renderTarget.setSize(this.width*ratio, this.height*ratio)
    this._maskResize()
  }

  render(renderer, camera) {
    renderer.render(this,camera,this.renderTarget)
  }

  update() {
    this.shape.rotation.z += Math.PI/180 * 1
  }

  _maskMake() {
    this.mask = new Object3D()
    const shape = new Mesh(
      new PlaneBufferGeometry(1, 1),
      new MeshBasicMaterial({
        color: 0xff0000
      }))
    this.shape = shape
    this.shapes.push(shape)
    this.add(shape)
  }

  _maskResize() {
    this.shape.scale.set(this.width , this.height, 1)
  }
}
