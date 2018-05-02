import {
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  LinearFilter } from 'three'

import Base3dScene from './libs/scenes/Base3DScene'
import Params from './libs/util/Params'
import Data from './store/Data'
import FilterMapRenderScene from './libs/objects/FilterMapRenderScene'
import { resizeCover } from './libs/util/Resizer'

class CanvasScene extends Base3dScene {
  setup() {
    Params.add({
      amp: {value: 10, min: 1, max: 30}
    })
    this.scene.background = 0x000000
    this.geometry = new PlaneGeometry(1, 1, 10, 10)
    this.renderer.extensions.get('OES_texture_float')

    this.texture = this.loader.get('/assets/raw/image1.jpg')
    this.texture.minFilter = LinearFilter
    let material = new MeshBasicMaterial({ map: this.texture })
    this.plane = new Mesh(this.geometry, material)

    this.camera.lookAt = this.plane
    this.scene.add(this.plane)

    const size = resizeCover(this.texture.image.width, this.texture.image.height, Data.canvas.width, Data.canvas.height)
    this.plane.scale.x = size.width
    this.plane.scale.y = size.height

    this.filterMask = new FilterMapRenderScene()
  }

  update() {

  }
  resizeUpdate(){
    const size = resizeCover(this.texture.image.width, this.texture.image.height, Data.canvas.width, Data.canvas.height)
    this.plane.scale.x = size.width
    this.plane.scale.y = size.height

    this.filterMask.size(Data.canvas.width,Data.canvas.height)
  }
}

export default CanvasScene
