<template lang="pug">
  .home
    .hero(ref='hero')
      h1 {{ data.heroText || $title || 'Hello'}}
      p.description {{ data.tagline || $description || 'Welcome to your VuePress site' }}

</template>

<script>
const debug = require('debug')('app:home')
import { TimelineMax, TweenMax, Power3 } from 'gsap'

export default {
  created () {

  },
  mounted () {
  },
  computed: {
    data () {
      return this.$page.frontmatter
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'


</style>
