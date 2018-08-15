import { mapState, mapActions } from 'vuex'

export default {
  watch: {
    smoothScrollTarget(identify) {
      this.smoothScrollTo(identify, this.$refs, 'contentsScroller')
    }
  },
  computed: {
    ...mapState('SmoothScroll', {
      smoothScrollTarget: state => state.target
    })
  },
  methods: {
    ...mapActions('SmoothScroll', [
      'smoothScrollSet'
    ]),
    smoothScrollTo(identify, $refs, wrapperRef) {
      const targetNode = $refs[identify]
      if (!targetNode) return
      const wrapper = $refs[wrapperRef]
      const top = targetNode.offsetTop
      TweenMax.to(wrapper, 0.8, {
        scrollTop: top,
        ease: Power2.easeInOut,
        onComplete: () => {
          this.smoothScrollSet(null)
        }
      })
    },
    smoothScrollToZero() {
      const wrapper = this.$refs['contentsScroller']
      TweenMax.to(wrapper, 0.0, {
        scrollTop: 0,
        ease: Power2.easeInOut,
        onComplete: () => {
          this.smoothScrollSet(null)
        }
      })
    }
  }
}
