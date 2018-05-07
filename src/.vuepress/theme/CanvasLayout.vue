<template lang="pug">
  .theme-container(:class="pageClasses")
    .canvasWrapper(ref="wrapper")
      canvas(ref="canvas")
    slot
</template>

<script>
import { BehaviorSubject } from 'rxjs'
import CanvasScene from './scripts/canvas/'
import Loader from './scripts/canvas/libs/util/Loader'
import Data from './scripts/canvas/store/Data'
import Config from './scripts/canvas/store/Config'
import ColorDetector from './scripts/canvas/libs/util/ColorDetector'
import FontFaceObserver from 'fontfaceobserver'

export default {
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {
      provider: {
        canvasScene: null,
        created: new BehaviorSubject(false)
      },
      loading: true,
      setupCount: 0,
      setupFinishCount: 3
    }
  },
  provide () {
    return {
      provider: this.provider
    }
  },
  computed: {
    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        userPageClass
      ]
    }
  },

  created() {
    this.setupSubject = new BehaviorSubject(this.setupCount)
    this.setupSubject.subscribe((value)=>{
      if(value >= this.setupFinishCount) {
        this.createCanvas()
      }
    })
    this.startLoad()
    this.startFontLoad()
  },

  async mounted() {
    this.setupSubject.next(++this.setupCount)
  },

  methods: {
    async startLoad() {
      Config.ASSETS.forEach((path)=>{
        Data.loader.add(path)
      })
      await Data.loader.load()
      await this.colorLoad()
      this.setupSubject.next(++this.setupCount)

    },
    startFontLoad() {
      const font = new FontFaceObserver('YuuriFont')
      font.load().then(()=>{
        this.setupSubject.next(++this.setupCount)
      })
    },
    async colorLoad(){
      const assetLen = Config.ASSETS.length
      let loadCnt = 0
      return new Promise((resolve)=>{
        Config.ASSETS.forEach((path)=>{
          ColorDetector.detect(path)
          .then((detector,path)=>{
            const { vibrant, muted } = ColorDetector.getDominantColors(detector.palette)
            ColorDetector.getContrastColors(detector.palette)

            const v1 = (detector.palette.DarkVibrant) ? detector.palette.DarkVibrant : detector.palette.Vibrant
            const vc = eval(v1.getHex().replace('#','0x'))

            const m1 = (detector.palette.Muted) ? detector.palette.Muted : detector.palette.Muted
            const mc = eval(m1.getHex().replace('#', '0x'))

            const color = (vibrant.population > muted.population) ? vibrant.hex : muted.hex
            Data.loader.get(detector.path).vibrant = vc
            Data.loader.get(detector.path).muted = muted.hex
            loadCnt++
            // console.log(`load: ${loadCnt} / ${assetLen}`)
            if(loadCnt >= assetLen) {
              resolve()
            }
          })
        })
      })
    },

    async createCanvas() {
      const canvasNode = this.$refs['canvas']
      const parentNode = this.$refs['wrapper']
      const canvasScene = new CanvasScene({
        node: canvasNode,
        parentNode: parentNode
      })
      await canvasScene.init()
      canvasScene.start()
      this.provider.canvasScene = canvasScene
      this.provider.created.next(true)
    }
  },
}
</script>

<style lang="stylus" scoped>
.canvasWrapper
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index -1
</style>
