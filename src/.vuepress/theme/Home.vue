<template lang="pug">
  .home
    .hero(ref='hero')
      h1 {{ data.heroText || $title || 'Hello'}}
      div
        span count :
        span {{ this.$store.state.count }}
      div
        span count is :
        span {{ this.evenOrOdd }}
      div
        button(@click=`increment`) inc
        button(@click=`decrement`) dec
        button(@click=`incrementIfOdd`) incIfOdd
        button(@click=`incrementAsync`) incAsync

</template>

<script>
const debug = require('debug')('app:home')
import { TimelineMax, TweenMax, Power3 } from 'gsap'
import { mapGetters, mapActions } from 'vuex'

export default {
  created () {

  },
  mounted () {
    console.log(this.$store.state.count)
  },
  computed: {
    ...mapGetters([
      'evenOrOdd'
    ]),
    data () {
      return this.$page.frontmatter
    },
  },
  methods: {
    ...mapActions([
      'increment',
      'decrement',
      'incrementIfOdd',
      'incrementAsync'
    ])
  },

}
</script>

<style lang="stylus">
@import './styles/config.styl'


</style>
