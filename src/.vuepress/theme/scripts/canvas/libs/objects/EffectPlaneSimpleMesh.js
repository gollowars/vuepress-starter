import {
  PlaneGeometry,
  Mesh,
  Vector2,
  Color,
  ShaderMaterial,
} from 'three'


import { TimelineMax, TweenMax, Back, Power4 } from 'gsap'
import BaseVert from '@shader/effectPlaneSimpleMesh/Base.vert'
import DisplaceFrag from '@shader/effectPlaneSimpleMesh/Displace.frag'
import Data from '@canvas/store/Data'

import TextRenderTexture from './TextRenderTexture2'

export default class EffectPlaneSimpleMesh {
  constructor(el, texture, text) {
    this.el = el
    this.texture = texture
    this.text = text
    this.tweens = []
    this.prevPos = 0

    this._init()
  }

  _init(){
    const geo = new PlaneGeometry(1, 1, 20, 20)
    const mat = new ShaderMaterial({
      vertexShader: BaseVert,
      fragmentShader: DisplaceFrag,
      uniforms: {
        tDiffuse: {
          value: this.texture
        },
        resolution: {
          value: new Vector2(this.el.clientWidth, this.el.clientHeight)
        },
        imageResolution: {
          value: new Vector2(this.texture.image.width, this.texture.image.height)
        },
        time: {
          value: Data.time
        },
        transiteOffsetX: {
          value: 0.0
        },
        radius: {
          value: 0.8
        },
        bendPosition: {
          value: 0.0
        },
        bendAmp: {
          value: 3.0
        },
        scrollStrength: {
          value: 0.0
        },
        waveNoise: {
          value: 1.5
        },
        noise: {
          value: 0.25
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
      TweenMax.to(this._mesh.material.uniforms.noise, 1.0, {
        value: 0.0,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.opacity, 1.2, {
        value: 1.0,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.waveNoise, 1.2, {
        value: 0.0,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.bendAmp, 1.0, {
        value: 0.0,
        ease: Power3.easeOut,
        onComplete: () => {
          if (this.showResolve) {
            this.showResolve()
          }
        }
      })
    ])
  }

  createHideTimeline() {
    this.hideTl = new TimelineMax({
      paused: true
    })

    this.hideTl.add([
      TweenMax.to(this._mesh.material.uniforms.radius, 1.0, {
        value: 0.8,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.noise, 1.0, {
        value: 0.1,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.opacity, 1.0, {
        value: 0.0,
        ease: Power4.easeOut,
        onComplete: () => {
          if (this.hideResolve) {
            this.hideResolve()
          }
        }
      }),
      TweenMax.to(this._mesh.material.uniforms.waveNoise, 1.2, {
        value: 5.5,
        ease: Power4.easeOut
      }),
      TweenMax.to(this._mesh.material.uniforms.bendAmp, 1.0, {
        value: 0.25,
        ease: Power4.easeOut
      })
    ])
  }

  show() {

    return new Promise((resolve)=>{
      // this.hideTl.kill()
      this.hideTl.pause()
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

  transite(pos){
    // if (Math.abs(Math.abs(this.prevPos) - Math.abs(pos)) > 0.1) return
    this._mesh.material.uniforms.transiteOffsetX.value = pos
    this.prevPos = pos
  }

  resize() {
    this._mesh.scale.x = this.el.clientWidth * 1.1
    this._mesh.scale.y = this.el.clientHeight * 1.1
    this._mesh.material.uniforms.resolution.value = new Vector2(this.el.clientWidth, this.el.clientHeight)
  }
}
