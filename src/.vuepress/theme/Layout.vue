<template lang='pug'>
  .theme-container(:class="pageClasses")
    Header
    Gnav
    .custom-layout(v-if="$page.frontmatter.layout")
      component(:is="$page.frontmatter.layout")

</template>

<script>
import "babel-polyfill"
import Vue from 'vue'
import nprogress from 'nprogress'

// vue components
import Home from './Home.vue'
import Page from './Page.vue'
import Header from './components/header.vue'
import Gnav from './components/gnav/Gnav.vue'

// script
import { pathToComponentName } from '@app/util'
import { resolveSidebarItems } from './scripts/util'
import { mapState, mapActions } from 'vuex'
import ResponsiveMixin from './mixin/ResponsiveMixin.js'


export default {
  mixins: [ ResponsiveMixin ],
  components: { Home, Page, Header, Gnav },
  data () {
    return {
    }
  },

  computed: {
    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        userPageClass
      ]
    },
    ...mapState('Scroll',{
      scrollAmount: state => state.value
    }),
  },

  created () {
    if (this.$ssrContext) {
      this.$ssrContext.title = this.$title
      this.$ssrContext.lang = this.$lang
      this.$ssrContext.description = this.$page.description || this.$description
    }else {
      localStorage.debug = 'app*'
    }
  },

  mounted () {
    // update title / meta tags
    this.currentMetaTags = []
    const updateMeta = () => {
      document.title = this.$title
      document.documentElement.lang = this.$lang
      const meta = [
        {
          name: 'description',
          content: this.$description
        },
        ...(this.$page.frontmatter.meta || [])
      ]
      this.currentMetaTags = updateMetaTags(meta, this.currentMetaTags)
    }
    this.$watch('$page', updateMeta)
    updateMeta()

    // configure progress bar
    nprogress.configure({ showSpinner: false })

    this.$router.beforeEach((to, from, next) => {
      if (to.path !== from.path && !Vue.component(to.name)) {
        nprogress.start()
      }
      next()
    })

    this.$router.afterEach(() => {
      nprogress.done()
    })

    this.addEvent()
  },

  beforeDestroy () {
    updateMetaTags(null, this.currentMetaTags)
    this.removeEvent()
  },

  methods: {
    ...mapActions('Scroll', [
      'setScrollValue'
    ]),
    ...mapActions('Responsive', [
      'setWinWidth',
      'setWinHeight',
    ]),
    addEvent() {
      this.windowResizeHandler()
      window.addEventListener('resize',this.windowResizeHandler)
      window.addEventListener('scroll',this.windowScrollHandler)
    },
    removeEvent() {
      window.removeEventListener('resize',this.windowResizeHandler)
      window.removeEventListener('scroll',this.windowScrollHandler)
    },
    windowResizeHandler(){
      this.setWinWidth(window.innerWidth)
      this.setWinHeight(window.innerHeight)
      this.mainHeight = `${window.innerHeight}px`
    },
    windowScrollHandler(){
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      this.setScrollValue(scrollTop)
    }
  }
}

function updateMetaTags (meta, current) {
  if (current) {
    current.forEach(c => {
      document.head.removeChild(c)
    })
  }
  if (meta) {
    return meta.map(m => {
      const tag = document.createElement('meta')
      Object.keys(m).forEach(key => {
        tag.setAttribute(key, m[key])
      })
      document.head.appendChild(tag)
      return tag
    })
  }
}
</script>

<style src="./styles/theme.styl" lang="stylus"></style>
