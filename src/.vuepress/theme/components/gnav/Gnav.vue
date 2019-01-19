<template lang="pug">
  .gmenu(ref='menu',:class=`[openClass]`)
    nav.nav
      .inner
        ul.nav-ul
          li.nav-li
            router-link(to=`/`) HOME
          li.nav-li
            router-link(to=`/about/`) About
        .nav-mail
          a(href=`mailto:example@example.tokyo`) MAIL
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('Common',[
      'gnavOpen',
      'gnavClose',
    ]),
    navToggleHandler() {

    },
    linkClick(index, link){
      if(this.whileNavTransition){ return }
      this.$router.push(link)
    },
  },
  computed: {
    ...mapState('Common', {
      currentPath: state => state.current,
      prevPath: state => state.prev,
      gnavIsOpen: state => state.gnavIsOpen,
      whileNavTransition: state => state.whileNavTransition,
      platform: state => state.platform,
    }),
    openClass() {
      return (this.gnavIsOpen) ? 'open' : 'close'
    },
    toggleOpenClass() {
      return (this.gnavIsOpen) ? 'cross' : ''
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '../../styles/config.styl'
@import '../../styles/mobile.styl'

$navToggleZLayer = 3
$navCloseNavZLayer = -1
$navOpenNavZLayer = 10

.gNav
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  overflow hidden

.navToggleWrapper
  position fixed
  top 50%
  left 5%
  transform translate(0,-50%)
  z-index $navToggleZLayer
  padding 15px
  margin-left -15px
  filter invert(100%)
  mix-blend-mode exclusion

  &.hide
    opacity 0

  +below($Mobile)
    top (100/2)px
    right (50/2)px
    left auto

.navToggle
  position relative
  width 25px
  height 18px
  cursor pointer

.navToggle__border
  position absolute
  display block
  width 100%
  height 2px
  background-color #000
  transition all .25s ease 0s
  &:first-child
    top 0
  &:nth-child(2)
    top 50%
    transform translate(0,-50%)
  &:last-child
    bottom 0
  &.white
    background-color #FFF

.navToggle.cross
  animation: closeAnim .25s ease 0s 1 alternate
  .navToggle__border
    &:first-child
      top 50%
      transform translate(0,-50%) rotateZ(135deg)
    &:nth-child(2)
      opacity 0
    &:last-child
      top 50%
      transform translate(0,-50%) rotateZ(-135deg)

@keyframes closeAnim
  0%
    transform scale(1.5)
  100%
    transform scale(1.0)

.gmenu
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  opacity 0.0
  transition all .35s ease 0s
  pointer-events none
  z-index $navCloseNavZLayer
  overflow hidden

  &.open
    opacity 1.0
    animation: gNavOpenAnim .35s ease 0s 1 alternate
    z-index $navOpenNavZLayer
    pointer-events auto
    overflow inherit

  &.hide
    opacity 0

@keyframes gNavOpenAnim
  0%
    transform scale(1.0)
  100%
    transform scale(1.0)
    opacity 1.0
    display block


.nav
  position fixed
  width 100%
  height 100%
  z-index 1
  background-color #1abc9c


</style>
