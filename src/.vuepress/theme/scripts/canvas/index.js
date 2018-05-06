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
import Vibrant from 'node-vibrant/lib/browser.js'
import QuantizerWebWorker from 'node-vibrant/lib/quantizer/worker'


class CanvasScene extends Base3dScene {
  setup() {
    this.scene.background = 0x000000
    this.renderer.extensions.get('OES_texture_float')
    Vibrant.from('/assets/raw/image1.jpg')
      .useQuantizer(QuantizerWebWorker.default)
      .getPalette()
      .then((palette) => {
        console.log('pallette:', palette)
      })
    // this.maskMesh = new MaskAnimMesh()
    // this.scene.add(this.maskMesh.mesh)
  }

  update() {
    // this.maskMesh.update(this.renderer, this.camera)
  }
  resizeUpdate(){
    // this.maskMesh.resize()
  }

}

export default CanvasScene
