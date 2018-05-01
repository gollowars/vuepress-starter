<template lang="pug">
  .page
    Content(:custom="false")
</template>

<script>

export default {
  mounted () {
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'

.page
  padding-bottom 2rem

.edit-link.content
  padding-top 0 !important
  a
    color lighten($textColor, 25%)
    margin-right 0.25rem

.page-nav.content
  padding-top 1rem !important
  padding-bottom 0 !important
  .inner
    min-height 2rem
    margin-top 0 !important
    border-top 1px solid $borderColor
    padding-top 1rem
  .next
    float right
</style>
