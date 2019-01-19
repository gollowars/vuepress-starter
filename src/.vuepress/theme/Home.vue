<template lang="pug">
  .home
    .hero(ref='hero')
      h1 {{ data.heroText || $title || 'Hello'}}
      h2 sub title
      p content content content content content

</template>

<script>
const debug = require('debug')('app:home')
import { TimelineMax, TweenMax, Power3 } from 'gsap'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  created () {

  },
  mounted () {
  },
  watch: {
    scrollAmount(value) {
      console.log('scrollAmount:',value)
    }
  },
  computed: {
    ...mapState('Scroll',{
      scrollAmount: state => state.value
    }),
    data () {
      return this.$page.frontmatter
    },
  },
  methods: {
  },

}
</script>

<style lang="stylus">
@import './styles/config.styl'


.home
  padding 120px 0
  width 100%
  max-width $pcSectionWidth
  margin 0 auto

</style>
