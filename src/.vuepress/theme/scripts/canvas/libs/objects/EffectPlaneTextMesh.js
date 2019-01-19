import {
  PlaneGeometry,
  Mesh,
  Vector2,
  Color,
  ShaderMaterial,
} from 'three'


import { TimelineMax, TweenMax, Back, Power4 } from 'gsap'
import BaseVert from '@shader/Base.vert'
import DisplaceFrag from '@shader/Displace.frag'
import Data from '@canvas/store/Data'

import TextRenderTexture from './TextRenderTexture2'

export default class EffectPlaneMesh {
  constructor(el, texture, text) {
    this.el = el
    this.texture = texture
    this.text = text
    this.tweens = []
    this.isMouseEnter = false

    this._init()
  }

  _init(){
    this.textRenderTexture = new TextRenderTexture(this.text, this.el.clientWidth, this.el.clientHeight)
    const maskOverlayColor = new Color(this.texture.vibrant)
    const maskTextColor = new Color(this.texture.muted)



    const geo = new PlaneGeometry(1, 1, 20, 20)
    const mat = new ShaderMaterial({
      vertexShader: BaseVert,
      fragmentShader: DisplaceFrag,
      uniforms: {
        tDiffuse: {
          value: this.texture
        },
        tMaskText: {
          value: this.textRenderTexture.texture
        },
        maskOverlayColor: {
          value: maskOverlayColor
        },
        maskTextColor: {
          value: maskTextColor
        },
        resolution: {
          value: new Vector2(this.el.clientWidth, this.el.clientHeight)
        },
        imageResolution: {
          value: new Vector2(this.texture.image.width, this.texture.image.height)
        },
        windowResolution: {
          value: new Vector2(Data.canvas.width, Data.canvas.height)
        },
        time: {
          value: Data.time
        },
        radius: {
          value: 0.8
        },
        bendPosition: {
          value: 0.0
        },
        bendAmp: {
          value: 2.0
        },
        textMaskMix: {
          value: 0.0
        },
        maskOverlayValidateRectOffsetX: {
          value: 0.0
        },
        scrollStrength: {
          value: 0.0
        },
        waveNoise: {
          value: 0.0
        },
        noise: {
          value: 0.3
        },
        opacity: {
          value: 0.0
        }
      },
    })

    mat.transparent = true
    this._mesh = new Mesh(geo, mat)

    this.createShowTimeline()
    this.createHideTimeline()
  }

  get mesh(){
    return this._mesh
  }

  createShowTimeline() {
    this.showTl = new TimelineMax({
      paused: true
    })
    this.showTl.add([
      TweenMax.to(this._mesh.material.uniforms.radius, 1.2,{
        value: 4.0,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.noise, 1.2, {
        value: 0.0,
        ease: Power4.easeOut,
      }),
      TweenMax.to(this._mesh.material.uniforms.opacity, 1.2, {
        value: 1.0,
        delay: 0.0,
        ease: Power4.easeOut,
        onComplete: ()=>{
          this.stopFragWave()
        }
      }),
      TweenMax.to(this._mesh.material.uniforms.bendAmp, 2.0, {
        value: 0.0,
        ease: Power4.easeOut,
        onComplete: () => {
          if (this.showResolve) {
            this.showResolve()
          }
        }
      }),
      TweenMax.to(this._mesh.material.uniforms.textMaskMix, 1.2, {
        value: 1.0,
        delay: 0.8,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.maskOverlayValidateRectOffsetX, 1.0, {
        value: 0.5,
        delay: 1.3,
        ease: Power4.easeOut
      })
    ])
  }

  createHideTimeline() {
    this.hideTl = new TimelineMax({
      paused: true
    })
    this.hideTl.set(
      this._mesh.material.uniforms.maskOverlayValidateRectOffsetX,
      {
        value: 0.0,
        ease: Power4.easeOut
      }
    )
    this.hideTl.add([
      TweenMax.to(this._mesh.material.uniforms.radius, 1.2, {
        value: 0.8,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.noise, 1.2, {
        value: 0.1,
        ease: Power4.easeOut,
      }),
      TweenMax.to(this._mesh.material.uniforms.opacity, 1.0, {
        value: 0.0,
        ease: Power4.easeOut,
        onUpdate:()=>{
        }
      }),
      TweenMax.to(this._mesh.material.uniforms.bendAmp, 1.3, {
        value: 1.0,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.textMaskMix, 1.2, {
        value: 0.0,
        delay: 0.8,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.maskOverlayValidateRectOffsetX, 1.0, {
        value: 1.0,
        ease: Power4.easeOut,
        onComplete: () => {
          this._mesh.material.uniforms.waveNoise.value = 0.0
          if (this.hideResolve) {
            this.hideResolve()
          }
        }
      })
    ])
  }

  show() {
    return new Promise((resolve)=>{
      // this.hideTl.kill()
      this.hideTl.pause()
      this.hideTl.set(
        this._mesh.material.uniforms.maskOverlayValidateRectOffsetX, {
          value: 0.0,
          ease: Power4.easeOut
        }
      )
      this.showResolve = resolve
      this.showTl.restart()
    })
  }


  hide() {
    return new Promise((resolve)=>{
      // this.showTl.kill()
      this.showTl.pause(this.showTl.endTime())
      this.hideResolve = resolve
      this.hideTl.restart()
    })
  }

  stopFragWave(){
    TweenMax.to(this._mesh.material.uniforms.waveNoise, 0.8, {
      value: 0.0,
      ease: Power4.easeOut
    })
    // TweenMax.to(this._mesh.material.uniforms.opacity, 0.8, {
    //   value: 1.0,
    //   ease: Power4.easeOut
    // })
  }

  startFragWave(){
    TweenMax.to(this._mesh.material.uniforms.waveNoise, 0.8, {
      value: 1.5,
      ease: Power4.easeOut
    })
    // TweenMax.to(this._mesh.material.uniforms.opacity, 0.8, {
    //   value: 0.8,
    //   ease: Power4.easeOut
    // })
  }

  resize() {
    this._mesh.scale.x = this.el.clientWidth * 1.1
    this._mesh.scale.y = this.el.clientHeight * 1.1
    this._mesh.material.uniforms.resolution.value = new Vector2(this.el.clientWidth, this.el.clientHeight)
    this.textRenderTexture.resize(this.el.clientWidth, this.el.clientHeight)
    this._mesh.material.uniforms.tMaskText.value = this.textRenderTexture.texture
  }
  reset(){
    this._mesh.scale.x = this.el.clientWidth * 1.1
    this._mesh.scale.y = this.el.clientHeight * 1.1
    this._mesh.material.uniforms.resolution.value.x = this.el.clientWidth
    this._mesh.material.uniforms.resolution.value.y = this.el.clientHeight
  }
}
