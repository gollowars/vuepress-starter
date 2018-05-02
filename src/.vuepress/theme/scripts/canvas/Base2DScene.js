import { Scene, PerspectiveCamera, OrthographicCamera, WebGLRenderer, PlaneGeometry, BoxGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three'
import Detector from 'three/examples/js/Detector'
import Base3dScene from './Base3DScene'
import { fromEvent } from 'rxjs'

class Base2dScene extends Base3dScene {
  createCamera() {
    this.camera = new OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 10000)
    this.camera.position.z = 1000
    this.renderer = new WebGLRenderer({
      canvas: this.node,
      alpha: true,
      antialias: true,
      stencil: false,
      depth: false,
      premultipliedAlpha: true
    })
  }

  updateCamera() {
    this.camera.left = this.width / -2
    this.camera.right = this.width / 2
    this.camera.top = this.height / 2
    this.camera.bottom = this.height / -2
    this.camera.updateProjectionMatrix()
  }
}

export default Base2dScene
