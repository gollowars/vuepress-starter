<template lang="pug">
  .home
    .hero(ref='hero')
      h1 {{ data.heroText || $title || 'Hello'}}
      p(v-for=`item in items`) test test test {{item}}

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
    items(){
      let items = []
      for(let i = 0;i<1000; i++){
        items.push(i)
      }
      return items
    }
  },
  methods: {
  },

}
</script>

<style lang="stylus">
@import './styles/config.styl'


</style>
