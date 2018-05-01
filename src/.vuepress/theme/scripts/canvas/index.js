import { Scene, PerspectiveCamera, OrthographicCamera, WebGLRenderer, PlaneGeometry, BoxGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three'
import Base2dScene from './Base2DScene'

class CanvasScene extends Base2dScene{
  setup() {
    this.geometry = new PlaneGeometry(1, 1, 1, 100)

    let material = new MeshBasicMaterial({ color: 0xffff00, wireframe: true })
    this.plane = new Mesh(this.geometry, material)
    this.plane.scale.x = this.width
    this.plane.scale.y = this.height
    this.camera.lookAt = this.plane

    this.scene.add(this.plane)
  }

  update() {
    for (let i = 0; i < this.geometry.vertices.length/2; i++) {
      this.geometry.vertices[2 * i].z = Math.pow(2, i / 10)
      this.geometry.vertices[2 * i + 1].z = Math.pow(2, i / 10)
    }

    // this.plane.rotation.y += Math.PI/180*1
  }
  resizeUpdate(){
    this.plane.scale.x = this.width
    this.plane.scale.y = this.height
  }
}

export default CanvasScene
