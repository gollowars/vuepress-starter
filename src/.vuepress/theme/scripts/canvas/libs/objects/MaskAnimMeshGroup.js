import {
  PlaneGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  LinearFilter
} from 'three'

import Data from '@themeCanvas/store/Data'
import Params from '@themeCanvas/libs/util/Params'
import { resizeCover } from '@themeCanvas/libs/util/Resizer'
import FilterMapRenderScene from './FilterMapRenderScene'
import BaseVertShader from '@shader/Base.vert'

export default class MaskAnimMeshGroup {
  constructor() {
    this.init()
  }

  init() {
    this.geometry = new PlaneGeometry(1, 1, 10, 10)
    this.texture = Data.loader.get('/assets/raw/image1.jpg')
    this.texture.minFilter = LinearFilter


    let material = new MeshBasicMaterial({ map: this.texture })
    this._mesh = new Mesh(this.geometry, material)
    const size = resizeCover(this.texture.image.width, this.texture.image.height, Data.canvas.width, Data.canvas.height)
    this._mesh.scale.x = size.width
    this._mesh.scale.y = size.height
    this.filterMask = new FilterMapRenderScene()
  }

  get mesh(){
    return this._mesh
  }

  resize() {
    const size = resizeCover(this.texture.image.width, this.texture.image.height, Data.canvas.width, Data.canvas.height)
    this._mesh.scale.x = size.width
    this._mesh.scale.y = size.height
    this.filterMask.size(Data.canvas.width, Data.canvas.height)
  }
}
