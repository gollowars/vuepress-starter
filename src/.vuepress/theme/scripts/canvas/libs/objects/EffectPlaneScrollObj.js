import {
  LinearFilter
} from 'three'

import ScrollObjGroup from './ScrollObjGroup'
import Data from '@canvas/store/Data'

import EffectPlaneTextMesh from './EffectPlaneTextMesh'


export default class EffectPlaneScrollObj extends ScrollObjGroup {
  ////////////////////////////////
  // Public
  mouseEnter(index) {
    this.effectMeshObjList[index].isMouseEnter = true
    this.effectMeshObjList[index].startFragWave()
  }

  isMouseEntered(index){
    return this.effectMeshObjList[index].isMouseEnter
  }

  mouseLeave(index) {
    this.effectMeshObjList[index].stopFragWave()
    this.effectMeshObjList[index].isMouseEnter = false
  }

  update() {
    this.meshList.forEach((mesh) => {
      mesh.material.uniforms.time.value = Data.time
      mesh.material.uniforms.scrollStrength.value = this.scrollAmount
    })
  }

  show() {
    let completeCount = 0
    this.scrollGroup.visible = true
    return new Promise((resolve)=>{
      this.effectMeshObjList.forEach(async (obj, index) => {
        obj.show()
        .then(() => {
          completeCount++
          if (completeCount => this.effectMeshObjList.length) {
            resolve()
          }
        }).catch((e)=>{
          consol.log('error:',e)
        })
      })
    })
  }

  hide() {
    return new Promise((resolve) => {
      let completeCount = 0
      this.effectMeshObjList.forEach(async (obj, index) => {
        obj.hide()
        .then(() => {
          completeCount++
          if((completeCount >= this.effectMeshObjList.length) == true) {
            this.scrollGroup.visible = false
            resolve()
          }
        }).catch((e) => {
          consol.log('error:', e)
        })
      })
    })
  }


  ////////////////////////////////
  // private
  _createElementMesh() {
    this.effectMeshObjList = []
    let createdEndCnt = this.scrollNode.$refs.image.length-1
    let createdCnt = 0

    return new Promise((resolve)=>{
      this.scrollNode.$refs.image.forEach((el, index) => {
        const imgPath = el.getAttribute('data-image')
        const initial = el.getAttribute('data-initial')
        const texture = Data.loader.get(imgPath)
        texture.minFilter = LinearFilter
        setTimeout(() => {
          const effectPlaneMesh = new EffectPlaneTextMesh(el, texture, initial)
          this.scrollGroup.add(effectPlaneMesh.mesh)
          this.meshList.push(effectPlaneMesh.mesh)
          this.effectMeshObjList.push(effectPlaneMesh)
          createdCnt++
          if (createdCnt > createdEndCnt) {
            this.scrollGroup.visible = false
            resolve()
          }
        }, index*70)
      })
    })

  }

  async pageDetailTransition(index) {
    return new Promise(async (resolve) => {
      this.pageExitStart(index)
      setTimeout(()=>{
        resolve()
      },500)
    })
  }

  pageExitStart(index){
    return new Promise((resolve)=>{
      this.meshList.forEach((mesh, meshIndex) => {
        if(meshIndex !== index) {
          mesh.material.uniforms.opacity.value = 0.0
        }
      })
      const mesh = this.meshList[index]

      // this.effectMeshObjList[index].hide()

      this.effectMeshObjList[index].stopFragWave()
      TweenMax.to(mesh.position, 0.7, {
        // x: 0.0,
        y: mesh.position.y + 50,
        ease: Power4.easeOut,
        onComplete: () => {
          resolve()
        }
      })

      TweenMax.to(mesh.material.uniforms.waveNoise, 0.5, {
        // x: 0.0,
        value: 10.0,
        ease: Power4.easeOut,
        onComplete: () => {
          resolve()
        }
      })

      TweenMax.to(mesh.material.uniforms.opacity, 0.7, {
        value: 0.0,
        ease: Power4.easeOut,
        onComplete: () => {
          this.effectMeshObjList[index].reset()
          this.meshList.forEach((mesh, meshIndex) => {
            mesh.material.uniforms.waveNoise.value = 0.0
          })
        }
      })

      // TweenMax.to(mesh.position, 1.0, {
      //   x: 0.0,
      //   y: -this.scrollGroupElement.scrollTop,
      //   ease: Power4.easeOut,
      //   onComplete: () => {
      //     resolve()
      //   }
      // })

      // TweenMax.to(mesh.scale, 1.0, {
      //   x: Data.canvas.width * 1.01,
      //   ease: Power4.easeOut
      // })
      // // console.log('mesh.material.uniforms.resolution:', mesh.material.uniforms.resolution.value)
      // TweenMax.to(mesh.material.uniforms.resolution.value, 1.0, {
      //   x: Data.canvas.width * 1.01,
      //   ease: Power4.easeOut,
      // })

      // TweenMax.to(mesh.material.uniforms.waveNoise, 1.0, {
      //   value: 0,
      //   delay: 0.0,
      //   ease: Power4.easeOut,
      // })

    })
  }

  pageExitMiddle(index) {
    return new Promise((resolve) => {
      const mesh = this.meshList[index]
      TweenMax.to(mesh.scale, 1.0, {
        y: Data.canvas.height * 1.01,
        ease: Power4.easeOut
      })
      // console.log('mesh.material.uniforms.resolution:', mesh.material.uniforms.resolution.value)
      TweenMax.to(mesh.material.uniforms.resolution.value, 1.0, {
        y: Data.canvas.height * 1.01,
        ease: Power4.easeOut,
        onComplete: ()=>{
          resolve()
        }
      })

      TweenMax.to(mesh.material.uniforms.opacity, 1.0, {
        value: 0.0,
        ease: Power4.easeOut,
        delay: 0.4,
        onComplete: () => {
          this.effectMeshObjList[index].reset()
          this.meshList.forEach((mesh, meshIndex) => {
            mesh.material.uniforms.waveNoise.value = 0.0
          })
        }
      })

    })
  }
}
