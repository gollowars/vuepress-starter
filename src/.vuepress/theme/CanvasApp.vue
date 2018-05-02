<template lang="pug">
  .canvasWrapper(ref="wrapper")
    canvas(ref="canvas")
</template>

<script>
import { BehaviorSubject } from 'rxjs'
import CanvasScene from './scripts/canvas/'
import Loader from './scripts/canvas/libs/util/Loader'

export default {
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {
      loading: true,
      setupCount: 0,
      setupFinishCount: 2
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
      Loader.add('/assets/raw/image1.jpg')
      await Loader.load()
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
    }
  },
  computed: {
  }
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
