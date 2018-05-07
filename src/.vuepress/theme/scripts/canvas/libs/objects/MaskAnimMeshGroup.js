import {
  PlaneGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  Mesh,
  Group,
  LinearFilter,
  Color
} from 'three'

import { MeshText2D, textAlign} from 'three-text2d'


import Data from '@canvas/store/Data'
import Params from '@canvas/libs/util/Params'
import Resizer from '@canvas/libs/util/Resizer'
import FilterMapRenderScene from './FilterMapRenderScene'
import TextRenderTexture from './TextRenderTexture'
import vertShader from '@shader/Base.vert'
import fragShader from '@shader/Displace.frag'
import { GroupedObservable } from 'rxjs';
import FontFaceObserver from 'fontfaceobserver'

export default class MaskAnimMeshGroup {
  constructor(renderer,camera) {
    this.renderer = renderer
    this.camera = camera
    this.init()
  }

  init() {
    this._group = new Group()

    Params.add({
      shapeNum:{value:70, min:2, max:100},
      strength:{value:15, min:0, max:100},
      noise:{value:14, min:0, max:100},
      rotation:{value:45, min:-180, max:180},
      offsetX:{value:24, min:0, max:200},
      offsetY:{value:24, min:0, max:200},
      showMask:{value:false},
      isBlank:{value:false}
    },'mask')


    this.geometry = new PlaneGeometry(1, 1, 10, 10)
    this.imageTexture = Data.loader.get('/assets/raw/image4.png')
    this.imageTexture.minFilter = LinearFilter

    this.filterMask = new FilterMapRenderScene(this.imageTexture)

    this.textRenderTexture = new TextRenderTexture(this.renderer, this.camera)
    this.textRenderTexture.setText('D')
    this.textRenderTexture.render(this.renderer, this.camera)


    let material = new ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms: {
        tTextMask: {
          value: this.textRenderTexture.texture
        },
        tMask: {
          value: this.filterMask.texture
        },
        tDiffuse: {
          value: this.imageTexture
        },
        maskColor: {
          value: new Color(this.imageTexture.vibrant)
        },
        strength: Params.get('mask').strength,
        showMask: Params.get('mask').showMask,
        offsetX: Params.get('mask').offsetX,
        offsetY: Params.get('mask').offsetY
      }
    })

    this._mesh = new Mesh(this.geometry, material)
    this._group.add(this._mesh)


    this.resize()
  }

  get mesh(){
    return this._group
  }

  resize() {
    const size = Resizer.cover(this.imageTexture.image.width, this.imageTexture.image.height, Data.canvas.width, Data.canvas.height)
    this._mesh.scale.x = Data.canvas.width
    this._mesh.scale.y = Data.canvas.height
    this.filterMask.resize(size.width, size.height)
    this.textRenderTexture.resize()
    this.textRenderTexture.render(this.renderer, this.camera)
  }

  update() {
    this._render()
    // this._mesh.material.uniforms.tTextMask.value.needsUpdate = true
    this.filterMask.update()
  }

  _render(){
    this.filterMask.render(this.renderer, this.camera)
  }
}
