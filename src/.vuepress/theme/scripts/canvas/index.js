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
  Vector2,
  Group,
  Color,
  ShaderMaterial,
  CubicBezierCurve3,
  LinearFilter } from 'three'

import Params from './libs/util/Params'
import Data from './store/Data'

import Base3dScene from './libs/scenes/Base3DScene'
import EffectPlaneScrollObj from './libs/objects/EffectPlaneScrollObj'
import SlideEffectObjGroup from './libs/objects/SlideEffectObjGroup'

class CanvasScene extends Base3dScene {
  async setup() {
    Data.renderer = this.renderer
    Data.camera = this.camera
    this.scene.background = new Color(0xffffff)
    this.renderer.extensions.get('OES_texture_float')

    this.didNavClose = true
    // const geo = new PlaneGeometry(640,440,10,10)
    // const mat = new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    // const mesh = new Mesh(geo, mat)
    // this.scene.add(mesh)
  }
  ////////////////////////////
  // Home Slide Obj
  async createSlide(node, assets){
    this.slide = new SlideEffectObjGroup(this.scene,node, assets)
  }
  ////////////////////////////
  // Scroll Nav Obj
  async createScrollArea(node) {
    this.scrollMeshGroup = new EffectPlaneScrollObj(this.scene, node)
    await this.scrollMeshGroup.initialize()
    // await this.scrollMeshGroup.show()
    // await this.scrollMeshGroup.hide()
  }

  async navOpen() {
    return new Promise(async (resolve)=>{
      if (this.scrollMeshGroup) {
        this.didNavClose = false
        this.slide.disable()
        this.scrollMeshGroup.resize()
        await this.scrollMeshGroup.show().catch((e) => {
          console.error('error:', e)
        })
        // this.scrollMeshGroup.resize()
        resolve()
      }
    })

  }
  async navClose(slideValidate, show) {
    if (this.scrollMeshGroup) {
      // if (slideValidate) {
      //   this.slide.able()
      // }

      // if (show) {
      //   await this.slide.show(this.slide.slideIndex).catch((e)=>{console.error('error:',e)})
      // }

      await this.scrollMeshGroup.hide().catch((e)=>{console.error('error:',e)})
      this.didNavClose = true
    }
  }

  update() {
    if (this.scrollMeshGroup && !this.didNavClose) this.scrollMeshGroup.update()
  }
  resizeUpdate(){
    this.scrollMeshGroup.resize()
    this.slide.resize()
  }

}

export default CanvasScene
