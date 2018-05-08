import {
  PlaneGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  Mesh,
  Group,
  LinearFilter,
  Color,
  Vector2
} from 'three'

import { MeshText2D, textAlign} from 'three-text2d'
import { TimelineMax, TweenMax,Power2 } from 'gsap'

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
      noise:{value:30, min:0, max:100},
      rotation:{value:45, min:-180, max:180},
      offsetX:{value:24, min:0, max:200},
      offsetY:{value:24, min:0, max:200},
      showMask:{value:false},
      isBlank:{value:false},
      diffuseMaskMixAmount: {value:1.0, min:0.0, max:1.0},
      maskMixAmp: {value:0.4, min:0.0, max:1.0},
      diffuseLightenssAmp: {value:1.4, min:1.0, max:2.0},
      diffuseDisplaceAmount: {value:1.0, min:0.0, max:1.0},
      maskAlpha: {value:1.0, min:0.0, max:1.0}
    },'mask')

    this.params = Params.get('mask')


    this.geometry = new PlaneGeometry(1, 1, 10, 10)
    this.imageTexture = Data.loader.get('/assets/raw/image3.png')
    this.imageTexture.minFilter = LinearFilter
    this.filterMask = new FilterMapRenderScene(this.imageTexture)

    this.textRenderTexture = new TextRenderTexture(this.renderer, this.camera)
    this.textRenderTexture.setText('D')
    this.textRenderTexture.render(this.renderer, this.camera)

    const size = Resizer.cover(this.imageTexture.image.width, this.imageTexture.image.height, Data.canvas.width, Data.canvas.height)
    this.textRenderTexture.resize(size.width, size.height)


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
        resolution: {
          value: new Vector2(Data.canvas.width,Data.canvas.height)
        },
        imageResolution: {
          value: new Vector2(this.imageTexture.image.width, this.imageTexture.image.height)
        },
        strength: this.params.strength,
        showMask: this.params.showMask,
        offsetX: this.params.offsetX,
        offsetY: this.params.offsetY,
        diffuseMaskMixAmount: this.params.diffuseMaskMixAmount,
        maskMixAmp: this.params.maskMixAmp,
        diffuseLightenssAmp: this.params.diffuseLightenssAmp,
        diffuseDisplaceAmount: this.params.diffuseDisplaceAmount,
        maskAlpha: this.params.maskAlpha,
      },
    })

    this._mesh = new Mesh(this.geometry, material)
    this._group.add(this._mesh)


    this.resize()




    // test
    setTimeout(()=>{
      this.showAnimation()
    },500)
  }

  get mesh(){
    return this._group
  }

  resize() {
    const size = Resizer.cover(this.imageTexture.image.width, this.imageTexture.image.height, Data.canvas.width, Data.canvas.height)

    this._mesh.scale.x = Data.canvas.width
    this._mesh.scale.y = Data.canvas.height

    this.filterMask.resize(size.width, size.height)
    this.textRenderTexture.resize(Data.canvas.width, Data.canvas.height)


    this._mesh.material.uniforms.resolution.value = new Vector2(Data.canvas.width, Data.canvas.height)
    this._mesh.material.uniforms.resolution.value.needsUpdate = true
  }

  update() {
    this._render()
    this.filterMask.update()
    this.textRenderTexture.update()
  }

  _render(){
    this.filterMask.render(this.renderer, this.camera)
    this.textRenderTexture.render(this.renderer, this.camera)
  }

  // animation
  showAnimation() {
    this.setup().play()

    setTimeout(()=>{
      this.anim1().play()
    },500)
  }
  setup(){
    const tl = new TimelineMax({paused: true})

    const rotX =Math.PI/180 *  Math.random() * 360
    const rotY =Math.PI/180 *  Math.random() * 360
    const rotZ = Math.PI / 180 * Math.random() * 360
    const scale = Math.random() * 10

    tl
      .set(this.params.maskAlpha, {value: 0.0})
      .set(this.params.maskMixAmp, {value: 0.0})
      .set(this.params.diffuseMaskMixAmount, {value: 1.0})
      .set(this.params.noise, {value: 30.0})
      .set(this.params.diffuseLightenssAmp, {value: 1.0})
      .set(this.textRenderTexture.textGroup.rotation,{x: rotX, y: rotY, z: rotZ})
      .set(this.textRenderTexture.textGroup.scale,{x: scale, y: scale, z: scale})
    return tl
  }

  anim1(){
    const rotX = Math.PI / 180 * Math.random() * 180 +  Math.PI
    const rotY = Math.PI / 180 * Math.random() * 180 +  Math.PI
    const rotZ = Math.PI / 180 * Math.random() * 180 +  Math.PI
    const scale = 10

    const tl = new TimelineMax({paused: true})
    const duration = 1.8
    tl
      .add([
        TweenMax.to(this.textRenderTexture.textGroup.rotation, duration, {
          x: 0.0,
          y: 0.0,
          z: 0.0,
          ease: Power2.easeInOut
        }),
        TweenMax.to(this.textRenderTexture.textGroup.scale, duration, {
          x: 1.0,
          y: 1.0,
          z: 1.0,
          ease: Power2.easeInOut
        }),
        TweenMax.to(this.params.maskAlpha, duration, {
          value: 1.0,
          ease: Power2.easeIn
        }),
        TweenMax.to(this.params.diffuseLightenssAmp, duration, {
          value: 1.5,
          ease: Power2.easeIn
        })]
      )
      .add([
        // TweenMax.to(this.params.noise, 3, {
        //   value: 100,
        //   ease: Power2.easeIn
        // }),
        TweenMax.to(this.params.maskMixAmp, 2, {
          value: 1.0,
          ease: Power2.easeIn
      })])
      .add([
        // TweenMax.to(this.params.noise, 2, {
        //   value: 14,
        //   ease: Power2.easeOut
        // }),
        TweenMax.to(this.textRenderTexture.textGroup.rotation, 1.0, {
          x: rotX,
          y: rotY,
          z: rotZ,
          ease: Power2.easeInOut
        }),
        TweenMax.to(this.textRenderTexture.textGroup.scale, 1.0, {
          x: scale,
          y: scale,
          z: scale,
          ease: Power2.easeInOut
        }),
        TweenMax.to(this.params.maskAlpha, 1.0, {
          value: 0.0,
          ease: Power2.easeOut
        }),
        TweenMax.to(this.params.strength, 1.4, {
          value: 4.0,
          ease: Power2.easeOut
        }),

        TweenMax.to(this.params.diffuseMaskMixAmount, 1.4, {
          value: 0.0,
          ease: Power2.easeOut
        }),
        TweenMax.to(this.params.diffuseLightenssAmp, 1.4, {
          value: 1.0,
          ease: Power2.easeOut
        })
      ])
      .add([

      ])









      // .to(this.params.maskAlpha,1, {value: 1.0})
      // .to(this.params.diffuseLightenssAmp,1.0, {value: 1.5})
      // .to(this.params.maskMixAmp,1.0, {value: 0.8})
    return tl
  }
}
