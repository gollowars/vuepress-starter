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
import { TimelineMax, TweenMax,Power2,Power1 } from 'gsap'

import Data from '@canvas/store/Data'
import Params from '@canvas/libs/util/Params'
import Resizer from '@canvas/libs/util/Resizer'
import FilterMapRenderScene from './FilterMapRenderScene'
import TextRenderTexture from './TextRenderTexture'
import vertShader from '@shader/Base.vert'
import fragShader from '@shader/Displace.frag'
import FontFaceObserver from 'fontfaceobserver'

export default class MaskAnimMeshGroup {
  constructor(renderer,camera) {
    this.renderer = renderer
    this.camera = camera

  }

  initialize(title,url) {
    this._group = new Group()

    Params.add({
      shapeNum:{value:70, min:2, max:100},
      strength:{value:8, min:0, max:100},
      noise:{value:30, min:0, max:100},
      rotation:{value:-180, min:-180, max:180},
      offsetX:{value:24, min:0, max:200},
      offsetY:{value:24, min:0, max:200},
      showMask:{value:false},
      isBlank:{value:false},
      diffuseLightenssAmp: {value:1.0, min:1.0, max:2.0},
      diffuseDisplaceAmount: { value: 1.0, min: 0.0, max: 1.0 },
      transitionMix: {value:0.0, min:0.0, max:1.0},
    },'mask')

    this.params = Params.get('mask')

    this.titleText = title

    this.geometry = new PlaneGeometry(1, 1, 10, 10)
    this.imageTexture = Data.loader.get(url)
    this.imageTexture.minFilter = LinearFilter
    this.filterMask = new FilterMapRenderScene(this.imageTexture)


    this.nextImageTexture = this.imageTexture
    this.nextImageTexture.minFilter = LinearFilter

    this.textRenderTexture = new TextRenderTexture(this.renderer, this.camera)
    this.textRenderTexture.setText(this.titleText)

    this.textRenderTexture.render(this.renderer, this.camera)

    const ratio = window.devicePixelRatio || 1
    this.textRenderTexture.resize(Data.canvas.width, Data.canvas.height)

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
        nexttDiffuse: {
          value: this.nextImageTexture
        },
        currentMaskColor: {
          value: new Color(this.imageTexture.vibrant)
        },
        nextMaskColor: {
          value: new Color(this.nextImageTexture.vibrant)
        },
        resolution: {
          value: new Vector2(Data.canvas.width,Data.canvas.height)
        },
        imageResolution: {
          value: new Vector2(this.imageTexture.image.width * ratio, this.imageTexture.image.height * ratio)
        },
        nextImageResolution: {
          value: new Vector2(this.nextImageTexture.image.width * ratio, this.nextImageTexture.image.height * ratio)
        },
        time: {
          value: Data.time
        },
        strength: this.params.strength,
        showMask: this.params.showMask,
        offsetX: this.params.offsetX,
        offsetY: this.params.offsetY,
        diffuseLightenssAmp: this.params.diffuseLightenssAmp,
        diffuseDisplaceAmount: this.params.diffuseDisplaceAmount,
        transitionMix: this.params.transitionMix,
      },
    })

    this._mesh = new Mesh(this.geometry, material)
    this._group.add(this._mesh)

    this.resize()
  }

  get mesh(){
    return this._group
  }

  resize() {

    this._mesh.scale.x = Data.canvas.width
    this._mesh.scale.y = Data.canvas.height

    this.filterMask.resize(Data.canvas.width, Data.canvas.height)
    this.textRenderTexture.resize(Data.canvas.width, Data.canvas.height)

    const ratio = window.devicePixelRatio || 1
    this._mesh.material.uniforms.resolution.value = new Vector2(Data.canvas.width * ratio, Data.canvas.height * ratio)
    this._mesh.material.uniforms.resolution.value.needsUpdate = true
  }

  update() {
    this._render()
    this.filterMask.update()
    this.textRenderTexture.update()
    this._mesh.material.uniforms.time.value = Data.time;
  }

  _render(){
    this.filterMask.render(this.renderer, this.camera)
    this.textRenderTexture.render(this.renderer, this.camera)
  }

  ////////////////////////////////////////////////////////////////
  //// animation

  showSetup() {
    const tl = new TimelineMax({ paused: true })

    const rotX = Math.PI / 180 * Math.random() * 360
    const rotY = Math.PI / 180 * Math.random() * 360
    const rotZ = Math.PI / 180 * Math.random() * 360
    const scale = 4

    this.filterMask.maskShaderControlAnim(new Color(0, 0, 0.0), 0.00)
    tl
      .set(this.params.noise, { value: 30.0 })
      .set(this.params.strength, { value: 10.0 })
      .set(this.params.transitionMix, {value: 0.0})
    return tl
  }
  showAnimation() {
    return new Promise((resolve)=>{
      this.showSetup().play()

      TweenMax.to(this.params.strength, 2.0, {
        value: 5.0,
        ease: Power2.easeInOut
      })
      // blue => textmask
      // red => overlay mask
      // green => overlay opacity

      this.filterMask.maskShaderControlAnim(new Color(0, 0, 1.0), 0.03)
      .then(()=>{
        this.filterMask.maskShaderControlAnim(new Color(1.0, 0, 1.0), 0.03)
        setTimeout(() => {
          TweenMax.to(this.params.strength, 2.0, {
            value: 3.0,
            ease: Power2.easeInOut
          })
          this.filterMask.maskShaderControlAnim(new Color(1.0, 1.0, 1.0), 0.03)
          .then(()=>{
            resolve()
          })
        }, 300)
      })
    })
  }

  transition(path,nextText) {
    const ratio = window.devicePixelRatio || 1
    this.nextImageTexture = Data.loader.get(path)
    this.nextImageTexture.minFilter = LinearFilter
    this.titleText = nextText
    this._mesh.material.uniforms.nextImageResolution.value = new Vector2(this.nextImageTexture.image.width * ratio, this.nextImageTexture.image.height * ratio)
    this._mesh.material.uniforms.nextImageResolution.value.needsUpdate = true
    this._mesh.material.uniforms.nexttDiffuse.value = this.nextImageTexture
    this._mesh.material.uniforms.nexttDiffuse.value.needsUpdate = true
    this._mesh.material.uniforms.nextMaskColor.value = new Color(this.nextImageTexture.vibrant)
    this._mesh.material.uniforms.nextMaskColor.value.needsUpdate = true


    return new Promise((resolve) => {
      this.transitionSetup().play()

      this.filterMask.maskShaderControlAnim(new Color(1.0, 1.0, 0.0), 0.0)
      const tl = new TimelineMax({ paused: false })
      tl.add([
        TweenMax.to(this.params.strength, 0.8, {
          value: 100.0,
          ease: Power1.easeOut,
          delay: 0.5
        }),
        TweenMax.to(this.params.transitionMix, 1.0, {
          value: 1.0,
          ease: Power2.easeOut,
          delay: 0.5,
        })
      ])
      // .add([
      //   TweenMax.to(this.params.strength, 0.5, {
      //     value: 10.0,
      //     ease: Power2.easeOut,
      //     onComplete: () => {
      //       this.transitionSwitch()
      //       resolve()
      //     }
      //   })
      // ])

      setTimeout(()=>{
        this.filterMask.maskShaderControlAnim(new Color(1.0, 0.0, 0.0), 0.03)
        .then(()=>{
          TweenMax.to(this.params.strength, 1.2, {
            value: 10.0,
            ease: Power1.easeInOut,
            onComplete:()=>{
              this.transitionSwitch()
              resolve()
            }
          })
        })
      },600)

    })
  }

  transitionSwitch(){
    this.imageTexture = this.nextImageTexture
    this.textRenderTexture.setText(this.titleText)

    const ratio = window.devicePixelRatio || 1
    this._mesh.material.uniforms.tDiffuse.value = this.imageTexture
    this._mesh.material.uniforms.tDiffuse.value.needsUpdate = true

    this._mesh.material.uniforms.currentMaskColor.value = new Color(this.imageTexture.vibrant)
    this._mesh.material.uniforms.currentMaskColor.value.needsUpdate = true

    this._mesh.material.uniforms.imageResolution.value = new Vector2(this.imageTexture.image.width * ratio, this.imageTexture.image.height * ratio)
    this._mesh.material.uniforms.imageResolution.value.needsUpdate = true
  }

  transitionSetup() {
    const tl = new TimelineMax({ paused: true })

    // tl
    //   .set(this.params.strength, { value: 0.9 })

    return tl
  }



}
