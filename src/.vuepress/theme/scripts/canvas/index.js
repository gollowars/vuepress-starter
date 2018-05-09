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
    this.maskMesh.initialize('V', '/assets/raw/image4.jpg')
    this.animLoop()

    this.scene.add(this.maskMesh.mesh)


    // const imgPath = '/assets/raw/image2.png'
    // const texture = Data.loader.get(imgPath)
    // texture.minFilter = LinearFilter
    // const detect = await ColorDetector.detect(imgPath)
    // const palette = detect.palette
    // const paletteMesh = createPaletteMesh(palette, texture)
    // this.scene.add(paletteMesh)

  }

  async animLoop(){
    const strlist = ['v', 'u', 'e', 'p', 'r', 'e', 's', 's', 'g', 'l']
    const nextIndex = Math.round(Math.random() * (strlist.length - 1))
    const str = strlist[nextIndex].toUpperCase()

    const imageIndex = Math.round(Math.random() * 4) + 1
    const path = `/assets/raw/image${imageIndex}.jpg`

    await this.maskMesh.showAnimation()
    await this.interval(4000)
    await this.maskMesh.transition(path,str)
    this.animLoop()
  }
  interval(time){
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve()
      },time)
    })
  }


  update() {
    this.maskMesh.update()
  }
  resizeUpdate(){
    this.maskMesh.resize()
  }

}

export default CanvasScene
