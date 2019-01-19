import {
  LinearFilter
} from 'three'
import Data from '@canvas/store/Data'
import EffectPlaneSimpleMesh from './EffectPlaneSimpleMesh'


export default class SlideObjGroup {
  constructor(scene,node, assets) {
    this.scene = scene
    this.node = node
    this.assets = assets
    this.textureList = null
    this.initialList = null
    this.slideIndex = 0
    this.slideMeshList = []


    this._init()
  }

  _init() {
    // create obj
    this.textureList = this.assets.map((asset) => {
      let texture = Data.loader.get(asset.image)
      texture.minFilter = LinearFilter
      return texture
    })

    this.initialList = this.assets.map((asset) => {
      return asset.initial
    })

    this.assets.forEach((asset,index)=>{
      let slideMeshObj = new EffectPlaneSimpleMesh(this.node, this.textureList[index], this.initialList[index])
      this.scene.add(slideMeshObj.mesh)
      this.slideMeshList.push(slideMeshObj)
    })

    this.resize()
    this.disable()
    // addEvent
    // fromEvent(window, 'scroll').subscribe(this._setScrollPosition)
  }


  ////////////////////////////////
  // Public
  update() {

  }

  resize() {
    this.slideMeshList.forEach((slideMeshObj)=>{
      slideMeshObj.resize()
    })
  }

  able() {
    this.ableReset()
  }
  ableReset() {
    this.slideMeshList.forEach((slideMeshObj, index) => {
      slideMeshObj.mesh.position.z = 0
      slideMeshObj.mesh.visible = true
      slideMeshObj.mesh.material.uniforms.opacity.value = 0.0
    })
  }

  currentShow() {
    this.slideMeshList.forEach((slideMeshObj, index) => {
      slideMeshObj.mesh.position.z = 0
      slideMeshObj.mesh.visible = true
      slideMeshObj.mesh.material.uniforms.opacity.value = 0.0
    })

    this.slideMeshList[this.slideIndex].mesh.material.uniforms.opacity.value = 1.0
    this.slideMeshList[this.slideIndex].mesh.position.z = 0
  }

  disable() {
    this.slideMeshList.forEach((slideMeshObj, index) => {
      slideMeshObj.mesh.position.z = -10
      slideMeshObj.mesh.visible = false
      slideMeshObj.mesh.material.uniforms.opacity.value = 0.0
    })
  }

  async slideTo(prevIndex,nextIndex){
    this.slideIndex = nextIndex
    this.slideMeshList.forEach((mesh,index)=>{
      if (index !== prevIndex && index !== nextIndex) {
        mesh.mesh.material.uniforms.opacity.value = 0.0
        mesh.mesh.position.z = -1
      }
    })
    this.slideMeshList[prevIndex].mesh.position.z = -1
    this.slideMeshList[nextIndex].mesh.position.z = 0

    await Promise.all([
      this.slideMeshList[prevIndex].hide(),
      this.slideMeshList[nextIndex].show()
    ]).catch((e) => {
      console.error('error:', e)
    })
  }

  async show(index) {
    await this.slideMeshList[index].show().catch((e) => {
      console.error('error:', e)
    })
    this.slideIndex = index
  }

  async hide(index) {
    await this.slideMeshList[index].hide().catch((e) => {
      console.error('error:', e)
    })
    this.slideIndex = index
  }

  changeShowOffset(pos,index){
    this.slideMeshList[index].transite(pos)
  }


  ////////////////////////////////
  // private

}
