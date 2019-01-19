import { Scene, PerspectiveCamera, OrthographicCamera, WebGLRenderer, PlaneGeometry, BoxGeometry, MeshBasicMaterial, Mesh, Vector3, GridHelper, AxisHelper, DirectionalLightHelper } from 'three'
import Resizer from '../util/Resizer'
import Config from '../../store/Config'
import Data from '../../store/Data'
import Params from '../util/Params'

class Base3dScene {
  constructor(props) {
    Data.init()

    this.params = Object.assign({}, props);
    this.node = this.params.node
    this.parentNode = this.params.parentNode
    this.baseUpdate = this.baseUpdate.bind(this)
    this.resize = this.resize.bind(this)
  }

  async init() {
    const Detector = await import('three/examples/js/Detector')
    await Params.init()
    if (Detector.webgl) {
      this.setSize()
      this.createScene()
      this.createCamera()
      this.createRenderer()
      if (Config.SHOW_HELPER) {
        this.addHelper()
      }
      this.setup()
    } else {
      console.log('cannot use webgl')
    }
  }

  createScene() {
    this.scene = new Scene()
  }

  createRenderer() {
    const ratio = window.devicePixelRatio || 1
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
  }

  createCamera() {
    this.camera = new PerspectiveCamera(45, this.width / this.height, 0.1, 50000)
    // this.camera = new PerspectiveCamera(1, this.width / this.height, 0.1, 50000)
    this.camera.position.z = this.height / Math.tan(this.camera.fov * Math.PI / 360) / 2
  }

  setSize() {
    Data.canvas.width = this.parentNode.clientWidth
    Data.canvas.height = this.parentNode.clientHeight
    this.width = Data.canvas.width
    this.height = Data.canvas.height
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
    this.camera.position.z = this.height / Math.tan(this.camera.fov * Math.PI / 360) / 2
    this.camera.updateProjectionMatrix()
  }

  start() {
    Data.last = window.performance.now()
    this.baseUpdate()
    this.didStart()
    Resizer.start()
    Resizer.add('sceneResize', this.resize)
  }

  baseUpdate() {
    this.animationID = requestAnimationFrame(this.baseUpdate)
    this.updateTime()
    this.update()
    this.render()
  }

  addHelper() {
    this.helper = {}
    this.helper.grid = new GridHelper(1000, 50)
    this.scene.add(this.helper.grid)
    this.helper.axis = new AxisHelper(1000, 50)
    this.scene.add(this.helper.axis)
    // this.helper.light = new DirectionalLightHelper(this.light, 20)
    // this.scene.add(this.helper.light)
  }

  dispose() {

  }

  updateTime() {
    let now = window.performance.now()
    let delta = (now - Data.last) / 1000
    if (delta > 1) delta = 1
    let time = now / 1000
    Data.last = now
    Data.time = time
  }

  render() {
    this.renderer.render(this.scene, this.camera)
    // postProcessUpdate(self)
  }


  // interface
  setup() {}
  didStart() {}
  update() {}
  resizeUpdate() {}

}

export default Base3dScene
