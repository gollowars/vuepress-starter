<template lang="pug">
  .navToggleWrapper(ref='toggle',v-on:click=`navToggleHandler`)
    .navToggle(:class=`toggleOpenClass`)
      span.navToggle__border
      span.navToggle__border
      span.navToggle__border
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
      if(!this.gnavIsOpen){
        this.gnavOpen()
      }else{
        this.gnavClose()
      }
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

$toggleWidth = 25px
$toggleheight = 18px

.navToggleWrapper
  z-index $navToggleZLayer
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
  width $toggleWidth
  height $toggleheight
  cursor pointer

.navToggle__border
  position absolute
  display block
  width 100%
  height 2px
  background-color #FFF
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

</style>
