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
  Group,
  LinearFilter } from 'three'

import Base3dScene from './libs/scenes/Base3DScene'
import Params from './libs/util/Params'
import Data from './store/Data'
import MaskAnimMesh from './libs/objects/MaskAnimMeshGroup'
import Vibrant from 'node-vibrant/lib/browser.js'
import QuantizerWebWorker from 'node-vibrant/lib/quantizer/worker'


function createColorPlane(hex) {
  const geo = new PlaneGeometry(1, 1, 10, 10)
  const tex = new MeshBasicMaterial({
    color: hex
  })
  return new Mesh(geo, tex)
}

function createPaletteColorGroup(palette, size) {
  const group = new Group()

  Object.keys(palette).forEach((key,index)=>{
    if (!palette[key]) return
    const swatch = palette[key]
    const hex = eval(swatch.getHex().replace('#', '0x'))
    const mesh = createColorPlane(hex)
    mesh.scale.set(size,size,1)
    mesh.position.x = index * size + size / 2
    mesh.position.y = size / 2
    group.add(mesh)
  })

  return group
}

class CanvasScene extends Base3dScene {
  setup() {
    this.scene.background = 0x000000
    this.renderer.extensions.get('OES_texture_float')
    console.time('ColorPalette')
    const imgPath = '/assets/raw/image1.jpg'
    Vibrant.from(imgPath, {
      colorCount: 64,
      quality: 10
    }).useQuantizer(QuantizerWebWorker.default)
      .getPalette()
      .then((palette) => {
        const texture = Data.loader.get(imgPath)
        texture.minFilter = LinearFilter

        const geo = new PlaneGeometry(1, 1, 10, 10)
        const tex = new MeshBasicMaterial({
          map: texture
        })
        const originalImageMesh = new Mesh(geo, tex)
        originalImageMesh.scale.set(texture.image.width / 2, texture.image.height / 2, 1)
        this.scene.add(originalImageMesh)


        const size = 50
        const paletteGroup = createPaletteColorGroup(palette, size)
        paletteGroup.position.x = -Data.canvas.width / 2
        paletteGroup.position.y = -Data.canvas.height / 2
        this.scene.add(paletteGroup)
        // const vibrantHex = eval(palette.Vibrant.getHex().replace('#', '0x'))
        // const vibrantMesh = createColorPlane(vibrantHex)
        // vibrantMesh.position.x = -Data.canvas.width / 2 + colorW / 2
        // vibrantMesh.position.y = -Data.canvas.height / 2 + colorW / 2
        // vibrantMesh.scale.set(colorW,colorW,1)
        // this.scene.add(vibrantMesh)
        // const mutedHex = eval(palette.LightMuted.getHex().replace('#', '0x'))
        // const mutedMesh = createColorPlane(mutedHex)
        // mutedMesh.position.x = -Data.canvas.width / 2 + colorW / 2 + colorW
        // mutedMesh.position.y = -Data.canvas.height / 2 + colorW / 2
        // mutedMesh.scale.set(colorW, colorW, 1)
        // this.scene.add(mutedMesh)
        console.timeEnd('ColorPalette')

      })
    // this.maskMesh = new MaskAnimMesh()
    // this.scene.add(this.maskMesh.mesh)
  }


  update() {
    // this.maskMesh.update(this.renderer, this.camera)
  }
  resizeUpdate(){
    // this.maskMesh.resize()
  }

}

export default CanvasScene
