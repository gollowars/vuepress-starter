import {
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3 } from 'three'

import Base3dScene from './libs/scenes/Base3DScene'
import Params from './libs/util/Params'
import Data from './store/Data'

class CanvasScene extends Base3dScene {
  setup() {
    Params.add({
      amp: {value: 10, min: 1, max: 30}
    })
    this.scene.background = 0x000000
    this.geometry = new PlaneGeometry(1, 1, 1, 100)
    this.renderer.extensions.get('OES_texture_float')

    let material = new MeshBasicMaterial({ color: 0xffff00, wireframe: true })
    this.plane = new Mesh(this.geometry, material)
    this.plane.scale.x = this.width / 2
    this.plane.scale.y = this.height / 2
    this.camera.lookAt = this.plane

    this.scene.add(this.plane)
  }

  update() {
    for (let i = 0; i < this.geometry.vertices.length/2; i++) {
      this.geometry.vertices[2 * i].z = Math.pow(2, i / 10)
      this.geometry.vertices[2 * i + 1].z = Math.pow(2, i / 10)
    }
    // console.log(Params.get('plane').amp.value)
    // this.plane.rotation.y += Math.PI / 180
  }
  resizeUpdate(){
    this.plane.scale.x = this.width / 2
    this.plane.scale.y = this.height / 2
  }
}

export default CanvasScene
