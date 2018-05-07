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

    // const { vibrant, muted } = ColorDetector.getDominantColors(palette)
    this.maskMesh = new MaskAnimMesh(this.renderer,this.camera)
    this.scene.add(this.maskMesh.mesh)


    // const imgPath = '/assets/raw/image2.png'
    // const texture = Data.loader.get(imgPath)
    // texture.minFilter = LinearFilter
    // const detect = await ColorDetector.detect(imgPath)
    // const palette = detect.palette
    // const paletteMesh = createPaletteMesh(palette, texture)
    // this.scene.add(paletteMesh)

  }


  update() {
    this.maskMesh.update()
  }
  resizeUpdate(){
    this.maskMesh.resize()
  }

}

export default CanvasScene
