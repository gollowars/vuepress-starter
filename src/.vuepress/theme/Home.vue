<template lang="pug">
  .home
    .hero
      h1 {{ data.heroText || $title || 'Hello'}}
    //-   p.description {{ data.tagline || $description || 'Welcome to your VuePress site' }}
    //- Content(custom)
    //- .footer(v-if="data.footer") {{ data.footer }}

</template>

<script>

export default {
  inject: ['provider'],
  created () {
  },
  mounted() {
    if(!this.provider.created.value) {
      this.provider.created.subscribe((value)=>{
        if(value)this.pageCanvasExec()
      })
    }else {
      this.pageCanvasExec()
    }
  },
  methods: {
    pageCanvasExec() {
      this.canvasScene = this.provider.canvasScene
      // console.log('ここでこのページのcanvas methodを実行')
      // console.log('this.canvasScene:',this.canvasScene)
    }
  },
  computed: {
    data () {
      return this.$page.frontmatter
    },
    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    }
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'

.hero
  text-align left
  padding: 20px 30px
  h1
    font-size: 3.0rem
    color: #ffffff
    font-family: $notoFont

</style>
