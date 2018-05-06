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
import MaskAnimMesh from './libs/objects/MaskAnimMeshGroup'

class CanvasScene extends Base3dScene {
  setup() {
    this.scene.background = 0x000000
    this.renderer.extensions.get('OES_texture_float')

    this.maskMesh = new MaskAnimMesh()
    this.scene.add(this.maskMesh.mesh)
  }

  update() {
    this.maskMesh.update(this.renderer, this.camera)
  }
  resizeUpdate(){
    this.maskMesh.resize()
  }

}

export default CanvasScene
