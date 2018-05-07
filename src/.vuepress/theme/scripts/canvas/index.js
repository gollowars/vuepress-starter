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
  Group,
  LinearFilter } from 'three'

import Base3dScene from './libs/scenes/Base3DScene'
import Params from './libs/util/Params'
import Data from './store/Data'
import MaskAnimMesh from './libs/objects/MaskAnimMeshGroup'
import ColorDetector, { createPaletteMesh } from './libs/util/ColorDetector'


class CanvasScene extends Base3dScene {
  async setup() {
    this.scene.background = 0x000000
    this.renderer.extensions.get('OES_texture_float')
    // console.time('ColorPalette')

    const imgPath = '/assets/raw/image2.png'
    const texture = Data.loader.get(imgPath)
    texture.minFilter = LinearFilter
    const palette = await ColorDetector.detect(imgPath)
    console.log('palette:',palette)
    const paletteMesh = createPaletteMesh(palette, texture)
    this.scene.add(paletteMesh)
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
