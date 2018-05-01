<template lang="pug">
  .canvasWrapper(ref="wrapper")
    canvas(ref="canvas")
</template>

<script>

import CanvasScene from './scripts/canvas/'

export default {
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {}
  },
  created() {

  },
  beforeMount() {

  },
  mounted() {
    const canvasNode = this.$refs['canvas']
    const parentNode = this.$refs['wrapper']
    const canvasScene = new CanvasScene({
      node: canvasNode,
      parentNode: parentNode
    })
    canvasScene.start()
  },
  methods: {
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
