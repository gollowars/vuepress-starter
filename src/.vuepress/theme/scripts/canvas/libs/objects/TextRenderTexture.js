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
import { MeshText2D, textAlign} from 'three-text2d'
import Data from '@canvas/store/Data'
import Params from '../util/Params';
import { map } from '../util/Util'

export default class TextRenderTexture extends Scene {
  constructor(renderer, camera) {
    super()
    this.renderer = renderer
    this.camera = camera
    // this.background = 0x000000
    this.renderTarget = new WebGLRenderTarget(16, 16, {
      type: (Data.isMobile) ? UnsignedByteType : FloatType,
      depthBuffer: false,
      stencilBuffer: false
    })
    this.renderTarget.texture.generateMipmaps = false

    this.plane = new Mesh(
      new PlaneBufferGeometry(1, 1),
      new MeshBasicMaterial({
        color: 0x000000
      })
    )

    this.add(this.plane)
    this.textGroup = new Group()
    this.add(this.textGroup)
    this.textStr = ''
    this.makeText()
  }

  makeText() {
    if(this.text){
      this.textGroup.remove(this.text)
      this.text.mesh.material.dispose()
      this.text.mesh.geometry.dispose()
      this.text = null
    }

    this.text = new MeshText2D(this.textStr, {
      align: textAlign.center,
      font: `${Data.canvas.height}px YuuriFont`,
      fillStyle: '#FFFFFF',
      antialias: true
    })

    this.textGroup.add(this.text)
  }

  resize(width, height) {
    const ratio = window.devicePixelRatio || 1

    this.renderTarget.setSize(width * ratio, height * ratio)
    this.makeText()
    this.text.position.y = height / 2
    this.plane.scale.set(width, height, 1)
  }

  update(){

  }

  setText(text) {
    this.textStr = text
    this.text.text = text
  }

  get texture(){
    return this.renderTarget.texture
  }
  render(){
    this.renderer.render(this, this.camera, this.renderTarget)
  }

}
