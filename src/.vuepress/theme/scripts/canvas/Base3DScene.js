import { Scene, PerspectiveCamera, OrthographicCamera, WebGLRenderer, PlaneGeometry, BoxGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three'
import Detector from 'three/examples/js/Detector'

import { fromEvent } from 'rxjs'

class Base2dScene {
  constructor(props) {
    this.params = Object.assign({}, props);
    this.node = this.params.node
    this.parentNode = this.params.parentNode

    this.baseUpdate = this.baseUpdate.bind(this)
    this.resize = this.resize.bind(this)
    this.init()
  }

  init() {
    if (Detector.webgl) {
      this.setSize()
      this.createScene()
    } else {
      console.log('cannot use webgl')
    }
  }

  createScene() {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(45, this.width / this.height, 0.1, 50000)
    this.camera.position.z = this.height / Math.tan(this.camera.fov * Math.PI / 360) / 2
    this.renderer = new WebGLRenderer({
      canvas: this.node,
      alpha: true,
      antialias: true,
      stencil: false,
      depth: false,
      premultipliedAlpha: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio || 1)
    this.renderer.setSize(this.width, this.height)
    this.setup()
  }

  setSize() {
    this.width = this.parentNode.clientWidth
    this.height = this.parentNode.clientHeight
    this.node.width = this.width
    this.node.height = this.height
  }

  resize() {
    this.setSize()
    this.updateRenderer()
    this.updateCamera()
    this.resizeUpdate()
  }
  updateRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio || 1)
    this.renderer.setSize(this.width, this.height)
  }
  updateCamera() {
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.camera.position.z = this.height / Math.tan(this.camera.fov * Math.PI / 360) / 2
    this.camera.updateProjectionMatrix()
  }

  start() {
    this.last = window.performance.now()
    this.baseUpdate()
    this.didStart()

    this.resizeSubscription = fromEvent(window, 'resize')
      .subscribe(this.resize)
  }

  baseUpdate() {
    this.animationID = requestAnimationFrame(this.baseUpdate)
    this.update()
    this.render()
  }

  dispose() {
    this.resizeSubscription.unsubscribe()
  }

  render() {
    let now = window.performance.now()
    let delta = (now - this.last) / 1000
    if (delta > 1) delta = 1
    let time = now / 1000
    this.last = now
    this.time = time
    this.renderer.render(this.scene, this.camera)
    // postProcessUpdate(self)
  }


  // interface
  setup() {}
  didStart() {}
  update() {}
  resizeUpdate() {}

}

export default Base2dScene
