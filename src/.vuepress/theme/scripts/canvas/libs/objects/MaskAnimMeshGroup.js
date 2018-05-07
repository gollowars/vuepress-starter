import {
  PlaneGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  Mesh,
  LinearFilter
} from 'three'

import Data from '@canvas/store/Data'
import Params from '@canvas/libs/util/Params'
import Resizer from '@canvas/libs/util/Resizer'
import FilterMapRenderScene from './FilterMapRenderScene'
import vertShader from '@shader/Base.vert'
import fragShader from '@shader/Displace.frag'

export default class MaskAnimMeshGroup {
  constructor() {
    this.init()
  }

  init() {
    Params.add({
      shapeNum:{value:70, min:2, max:100},
      strength:{value:15, min:0, max:100},
      noise:{value:12, min:0, max:100},
      rotation:{value:45, min:-180, max:180},
      offsetX:{value:150, min:0, max:200},
      offsetY:{value:100, min:0, max:200},
      showMask:{value:false},
      isBlank:{value:false}
    },'mask')


    this.geometry = new PlaneGeometry(1, 1, 10, 10)
    this.texture = Data.loader.get('/assets/raw/image1.jpg')
    this.texture.minFilter = LinearFilter

    this.filterMask = new FilterMapRenderScene(this.texture)


    let material = new ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms: {
        tDiffuse: {
          value: this.texture
        },
        tMask: {
          value: this.filterMask.texture
        },
        strength: Params.get('mask').strength,
        showMask: Params.get('mask').showMask,
        offsetX: Params.get('mask').offsetX,
        offsetY: Params.get('mask').offsetY
      }
    })

    this._mesh = new Mesh(this.geometry, material)
    this.resize()
  }

  get mesh(){
    return this._mesh
  }

  resize() {
    const size = Resizer.cover(this.texture.image.width, this.texture.image.height, Data.canvas.width, Data.canvas.height)
    this._mesh.scale.x = size.width
    this._mesh.scale.y = size.height
    this.filterMask.resize(size.width, size.height)
  }

  update(renderer, camera) {
    this._render(renderer, camera)
    this._mesh.material.uniforms.tDiffuse.value.needsUpdate = true
    this.filterMask.update()
  }

  _render(renderer,camera){
    this.filterMask.render(renderer, camera)
  }
}
