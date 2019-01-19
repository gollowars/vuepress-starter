import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Vector2,
  Group,
  Color,
  ShaderMaterial,
  CubicBezierCurve3,
  LinearFilter
} from 'three'
import { Observable, fromEvent } from 'rxjs';
import { TimelineMax, TweenMax, Back, Power4 } from 'gsap'
import BaseVert from '@shader/Base.vert'
import DisplaceFrag from '@shader/Displace.frag'
import Data from '@canvas/store/Data'


export default class ScrollObjGroup {
  constructor(scene,node) {
    this.scene = scene
    this.scrollNode = node

    this.meshList = new Array()
    this.scrollGroupElement = this.scrollNode.$refs.scrollgroup
    this.scrollElement = this.scrollNode.$el
    this.prevScrollValue = null
    this.scrollAmount = 1.0
    this.clearTimer = null

    this._setScrollPosition = this._setScrollPosition.bind(this)
    this._initScrollPosition = this._initScrollPosition.bind(this)
  }

  async initialize() {
    // create obj
    return new Promise(async (resolve)=>{
      this._createScrollPlane()
      await this._createElementMesh()

      // setup
      this._setScrollPosition()
      this._setPositionElementMesh()

      // addEvent
      // fromEvent(window, 'scroll').subscribe()
      // this.scrollGroupElement.scrollTop
      fromEvent(this.scrollGroupElement, 'scroll').subscribe(this._setScrollPosition)
      // console.log('this.scrollNode.$eventHub:',this.scrollNode.$eventHub)
      resolve()
    })
  }

  ////////////////////////////////
  // Public
  update() {
    this.meshList.forEach((mesh) => {
      mesh.material.uniforms.time.value = Data.time
      mesh.material.uniforms.strength.value = this.scrollAmount
    })
  }

  resize() {
    this._setScrollPosition()
    this._setPositionElementMesh()
  }

  show() {
    this.meshList.forEach((mesh, index) => {
      const delay = 0.0
      // mesh.materials[0].opacity = 0.0
      TweenMax.to(mesh.material.uniforms.radius, 1.2, {
        value: 4.0,
        delay: delay * index,
        ease: Power4.easeOut
      })

      TweenMax.to(mesh.material.uniforms.noise, 1.2, {
        value: 0.0,
        delay: delay * index,
        ease: Power4.easeOut
      })

      TweenMax.to(mesh.material.uniforms.opacity, 1.2, {
        value: 1.0,
        delay: delay * index,
        ease: Power4.easeOut
      })
    })
  }

  ////////////////////////////////
  // private
  _initScrollPosition() {
    this.scrollGroupElement.scrollTop = 0
  }

  _createScrollPlane() {
    this.scrollGroup = new Group()
    const geo = new PlaneGeometry(1, 1, 10, 10)
    const mat = new MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    })

    this.scrollPlaneMesh = new Mesh(geo, mat)
    // this.scrollGroup.add(this.scrollPlaneMesh)
    this.scene.add(this.scrollGroup)
  }

  _createElementMesh() {
    this.scrollNode.$refs.image.forEach((el, index) => {
      const imgPath = el.getAttribute('data-image')
      const texture = Data.loader.get(imgPath)
      texture.minFilter = LinearFilter
      const geo = new PlaneGeometry(1, 1, 20, 20)
      let mat = new ShaderMaterial({
        vertexShader: BaseVert,
        fragmentShader: DisplaceFrag,
        uniforms: {
          tDiffuse: {
            value: texture
          },
          resolution: {
            value: new Vector2(el.clientWidth, el.clientHeight)
          },
          imageResolution: {
            value: new Vector2(texture.width, texture.height)
          },
          time: {
            value: Data.time
          },
          radius: {
            value: 0.8
          },
          strength: {
            value: 1.0
          },
          noise: {
            value: 0.3
          },
          waveNoise: {
            value: 1.0
          },
          opacity: {
            value: 0.0
          }
        },
      })

      const mesh = new Mesh(geo, mat)
      this.scrollGroup.add(mesh)
      this.meshList.push(mesh)
    })
  }

  _setScrollPosition() {
    this.scrollPlaneMesh.scale.x = Data.canvas.width
    this.scrollPlaneMesh.scale.y = this.scrollGroupElement.clientHeight

    // console.log('this.scrollGroupElement.clientHeight:', this.scrollGroupElement.clientHeight)

    const val = this.scrollGroupElement.scrollTop
    const posY = -this.scrollPlaneMesh.scale.y / 2 + Data.canvas.height / 2 + val
    // console.log('-=============')
    // console.log('posY:', posY)
    this.scrollGroup.position.y = posY
      const diff = Math.abs(this.prevScrollValue - val)
    if (diff < 80) {
      this.scrollAmount = diff
    }
    this.prevScrollValue = val

    // if (this.clearTimer) clearTimeout(this.clearTimer)
    // this.clearTimer = setTimeout(()=>{
    //   TweenMax.to(this, 1.0, {
    //     scrollAmount: 0.0,
    //     ease: Power4.easeOut
    //   })
    // },500)
  }

  _setPositionElementMesh() {
    this.scrollNode.$refs.image.forEach((el, index) => {
      const mesh = this.meshList[index]
      const w = el.clientWidth
      const h = el.clientHeight

      const rect = el.getBoundingClientRect()
      const rectX = rect.left
      const rectY = rect.top

      mesh.scale.x = w
      mesh.scale.y = h

      const posZero = this.scrollGroupElement.clientHeight / 2 - (h / 2) - window.scrollY
      const posY = posZero - rectY
      mesh.position.y = posY - this.scrollGroup.position.y
      // console.log('mesh.position.y:', mesh.position.y)
      const posXZero = -Data.canvas.width / 2 + w / 2
      const posX = posXZero + rectX
      mesh.position.x = posX

      // if(index==0){
      //   console.log('mesh----')
      //   console.log('rect.x:', rect.x)
      //   // console.log('mesh.position.y:', mesh.position.y)
      // }
    })
  }


}
