import Vue from 'vue'

export default {
  computed: {
    $title () {
      const page = this.$page
      const siteTitle = this.$siteTitle
      const selfTitle = page.frontmatter.home ? null : (
        page.frontmatter.title || // explicit title
        page.title // inferred title
      )
      return (selfTitle) ? selfTitle : siteTitle | ''
    },
    $description () {
      return this.$page.frontmatter.description || this.$localeConfig.description || this.$site.description || ''
    }
  }
}