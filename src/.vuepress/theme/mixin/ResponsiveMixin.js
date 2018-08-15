import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('Responsive', [
      'responsiveTarget',
      'deviceOrientation'
    ]),
    isSP() {
      return (this.responsiveTarget == 'isSP')
    },
  }
}
