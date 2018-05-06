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
      setupFinishCount: 2
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
  },

  async mounted() {
    this.setupSubject.next(++this.setupCount)
  },

  methods: {
    async startLoad() {
      Data.loader.add('/assets/raw/image1.jpg')
      await Data.loader.load()
      this.setupSubject.next(++this.setupCount)
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
