import {
  Scene,
  WebGLRenderTarget,
  UnsignedByteType,
  FloatType,
  Object3D,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  Color
} from 'three'

import Data from '@canvas/store/Data'
import Params from '../util/Params';
import { map } from '../util/Util'

export default class FilterMapRenderScene extends Scene {
  constructor(texture) {
    super()
    this.maskTexture = texture
    this.renderTarget = null
    this.colorOffset = 0
    this.shapeNum = 100
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
    this._updateShape()
  }

  _maskMake() {
    this.mask = new Group()

    this._makeShapes()

    this.add(this.mask)
  }
  _makeShapes(){
    const number = this.shapeNum
    for(let i = 0;i<number;i++) {
      const red = Math.round(i * 255 / number)
      const blue = Math.round(i * 255 / number)
      const color = new Color(`rgb(${red}, ${blue}, 0)`);
      const shape = new Mesh(
        new PlaneBufferGeometry(1, 1),
        new MeshBasicMaterial({
          color: color
        }))
      this.shapes.push(shape)
      this.mask.add(shape)
    }

    this._maskResize()
  }

  _updateShape() {
    const number = this.shapeNum

    this.shapes.forEach((shape,i)=>{
      let col = shape.material.color
      let radian = i * (Params.get('mask').noise.value*0.01) + Data.time*4
      col.r = map(Math.sin(radian), 0, 1, -1, 1)
      col.b = map(Math.cos(radian), 0, 1, -1, 1)
    })

    this.mask.rotation.z = Math.PI/180 * Params.get('mask').rotation.value
  }

  _maskResize() {
    const number = this.shapeNum
    const shapeW = this.width / number
    const hypo = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2))
    this.shapes.forEach((shape, i) => {
      shape.scale.set(shapeW, hypo)
      const posx = i * this.width / number
      const posy = 0
      shape.position.x = posx - this.width / 2
      shape.position.y = posy
    })
  }
}
