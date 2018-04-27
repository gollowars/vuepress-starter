const path = require('path')

module.exports = {
  base: '/',
  dest: 'dist/',
  locales: {
    '/': {
      lang: 'ja',
      title: 'VuePress Test',
      description: 'Just playing around',
      head: [
        ['link', { rel: 'icon', href: `/logo.png` }],
        ['meta',{ name:"keywords", content:"key, words, vuepress"}],
        ['meta',{ name:"og:title", content:"og title"}],
        ['meta',{ name:"og:description", content:"description"}],
        ['meta',{ name:"og:type", content:"website"}],
        ['meta',{ name:"og:url", content:"og　url"}],
        ['meta',{ name:"og:image", content:"http://absolute-domain.jp/logo.png"}],
      ]
    }
  },
  markdown: {
    anchor: { permalink: true }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@alias': path.resolve(__dirname,'../assets'),
        '@fonts': path.resolve(__dirname,'../assets/fonts'),
      }
    }
  },
  chainWebpack: config => {
    const jsRule = config.module.rule('js')
    jsRule.uses.delete('buble-loader')
    jsRule.use('babel-loader').loader('babel-loader')

    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
        .loader('pug-plain-loader')
        .end()
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about/' },
      { text: 'External', link: 'https://google.com' },
    ]
  }
}
