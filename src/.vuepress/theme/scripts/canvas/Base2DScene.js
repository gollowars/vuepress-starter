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
      this.createScene()
    } else {
      debug('cannot use webgl')
    }
  }

  createScene() {
    this.setSize()
    this.scene = new Scene()
    this.scene.background = 0x000000
    // this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
    this.camera = new OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 1000);

    this.renderer = new WebGLRenderer({
      canvas: this.node,
      antialias: false,
      alpha: true,
      transparent: false
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

    this.plane.scale.x = this.width
    this.plane.scale.y = this.height

    this.renderer.setPixelRatio(window.devicePixelRatio || 1)
    this.renderer.setSize(this.width, this.height)

    this.camera.left = this.width / -2
    this.camera.right = this.width / 2
    this.camera.top = this.height / 2
    this.camera.bottom = this.height / -2
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

}

export default Base2dScene
