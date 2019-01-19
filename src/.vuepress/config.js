const path = require('path')

const baseDir = `/`

module.exports = {
  themeConfig: {
    assetImagePath: `${baseDir}assets/img`,
    nav: [{
      text: 'Home',
      link: '/'
    }]
  },
  base: `${baseDir}`,
  dest: `dist${baseDir}`,
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
        ['meta',{ name:"og:image", content:"http://sample.io/logo.png"}],
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
        '@theme': path.resolve(__dirname,'./theme/'),
        '@scripts': path.resolve(__dirname,'./theme/scripts/'),
        '@shader': path.resolve(__dirname,'./theme/shader/'),
        '@styles': path.resolve(__dirname,'./theme/styles/'),
      }
    }
  },
  chainWebpack: config => {
    // const jsRule = config.module.rule('js')
    // jsRule.uses.delete('buble-loader')
    // jsRule.use('babel-loader').loader('babel-loader')

    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
        .loader('pug-plain-loader')
        .end()

    // glsl
    config.module
      .rule('glsl')
      .test(/\.(glsl|vs|fs|vert|frag)$/)
      .use('webpack-glsl-loader')
      .loader('webpack-glsl-loader')
      .end()

    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.delete('file-loader')
    svgRule.use('svg-inline-loader').loader('svg-inline-loader')

  },
  ga: 'TEST_ID_20180514'
}
