<template lang="pug">
  header.header
    .inner
      h1.left
        //- .logo(v-html="icons.logo")
        .logo Header
      .right
        a(href=`mailto:example@example.tokyo`).mail.right__unit
          img(:src=`icons.mail`)
        .gnavToggle.right__unit
          gnavBurger

</template>
<script>
// component

import LogoSVG from '../images/icons/icon.logo-simple.svg'
import iconMail from '../images/icons/icon.mail.png'
import gnavBurger from './gnav/gnavBurger.vue'

export default {
  components: { gnavBurger },
  computed: {
    icons (){
      return {
        logo: LogoSVG,
        mail: iconMail
      }
    }
  },
}
</script>
<style lang="stylus" scoped>
@import '../styles/config.styl'
.header
  position fixed
  width 100%
  height 32px
  top 58px
  z-index 11
  .inner
    position relative
    width 100%
    max-width $pcSectionWidth
    margin 0 auto
    height 100%
    background-color #f1c40f

.logo
  width 54px
  height 32px
  font-weight bold
  font-size 2rem
  svg
    width 100%
    height 100%

.left
  position absolute
  left 0
.right
  position absolute
  top 50%
  margin-top -(18/2)px

  right 0
  &__unit
    height 100%
    display inline-block
    vertical-align middle
  .mail
    margin-right 32px

  .gnavToggle
    position relative
    z-index 1
</style>
