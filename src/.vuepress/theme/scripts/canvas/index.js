import { Scene, PerspectiveCamera, OrthographicCamera, WebGLRenderer, PlaneGeometry, BoxGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three'
import Base2dScene from './Base2DScene'

class CanvasScene extends Base2dScene{
  setup() {
    console.log('setup')
    const geometry = new PlaneGeometry(1, 1, 4, 4)
    let material = new MeshBasicMaterial({ color: 0xffff00, wireframe: true })
    this.plane = new Mesh(geometry, material)
    this.plane.scale.x = this.width
    this.plane.scale.y = this.height
    this.camera.position.z = 5
    this.camera.lookAt = this.plane
    this.scene.add(this.plane)
  }

  update() {
  }
}

export default CanvasScene
