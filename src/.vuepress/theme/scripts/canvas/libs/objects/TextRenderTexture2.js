import {
  Scene,
  WebGLRenderTarget,
  UnsignedByteType,
  FloatType,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three'
import { MeshText2D, textAlign} from 'three-text2d'
import Data from '@canvas/store/Data'


export default class TextRenderTexture {
  constructor(text, width, height) {
    this.text = text
    this.width = width
    this.height = height

    this._init()
  }

  resize(width,height){
    this.width = width
    this.height = height
    this.renderTarget.setSize(this.width,this.height)
    this.plane.scale.x = this.width
    this.plane.scale.y = this.height
    this.textMesh.font = `${this.height * 100.5}px YuuriFont`
    this.textMesh.position.y = this.height * 2.5 / 2
    this.render()
  }

  _init() {
    this.scene = new Scene()
    const ratio = window.devicePixelRatio || 1
    this.renderTarget = new WebGLRenderTarget(this.width, this.height , {
      type: (Data.isMobile) ? UnsignedByteType : FloatType,
      antialias: true,
      depthBuffer: false,
      stencilBuffer: false
    })

    this.renderTarget.texture.generateMipmaps = false


    this.plane = new Mesh(
      new PlaneBufferGeometry(1, 1),
      new MeshBasicMaterial({
        color: 0x000000
      })
    )
    this.plane.scale.x = this.width
    this.plane.scale.y = this.height

    this.scene.add(this.plane)


    this.textMesh = new MeshText2D(this.text, {
      align: textAlign.center,
      font: `${this.height*1.38}px YuuriFont`,
      fillStyle: '#FFFFFF',
      antialias: true
    })
    this.textMesh.position.x = - this.height * 1.38 / 12
    if (this.text == 'R'){
      this.textMesh.position.x = -this.height * 1.38 / 8
    }
    this.textMesh.position.y = this.height *1.38 / 2

    this.scene.add(this.textMesh)


    // const geo = new PlaneGeometry(200,200,10,10)
    // const mat = new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    // const mesh = new Mesh(geo, mat)
    // this.scene.add(mesh)

    this.render()
  }


  render() {
    Data.camera.aspect = this.width / this.height
    Data.camera.position.z = this.height / Math.tan(Data.camera.fov * Math.PI / 360) / 2
    Data.renderer.setSize(this.width, this.height)
    Data.camera.updateProjectionMatrix()

    Data.renderer.render(this.scene, Data.camera, this.renderTarget)

    Data.camera.aspect = Data.canvas.width / Data.canvas.height
    Data.camera.position.z = Data.canvas.height / Math.tan(Data.camera.fov * Math.PI / 360) / 2
    Data.renderer.setSize(Data.canvas.width, Data.canvas.height)
    Data.camera.updateProjectionMatrix()

  }
  updateCamera() {
    this.camera.left = this.width / -2
    this.camera.right = this.width / 2
    this.camera.top = this.height / 2
    this.camera.bottom = this.height / -2
    this.camera.updateProjectionMatrix()
  }


  get texture() {
    return this.renderTarget.texture
  }

}
