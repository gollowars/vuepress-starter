---
# home: true
layout: home
lang: ja
title: Home Title
description: Home description
meta:
 -
  og:title: 'og title Home page'
 -
  og:desciption: 'og Home description'
 -
  og:image: '//absolute-domain/thisog.jpg'

pageClass: 'home-class'
heroText: Hello VuePress
tagline: this is a tagline
footer: hear is footer area
---
# VuePressはコーダーの夢を見るか。
Webサービス界隈の優秀な人たちが、フロントエンドの新しいツールを「最高！」と日々謳っている中、
底辺コーダーの我々は新しいツールを目にしても、クライアントからの修正横目に「ほーん。どうせ僕らの業務じゃ使えないんでしょ？」という冷淡な姿勢を貫き通していた。
しかし、興味がないわけではなかった。reactやvueといったコンポーネント思考のフレームワークを駆使すればクライアントからの無理難題をスマートに解決し、家で有意義にダラダラする時間を手に入れる事が出来るかもしれない。そのような考えはいつも心の片隅にあったが目を背け続けてきた。
ついにその時がきたかもしれない。
VuePressがその夢を叶えてくれるかもしれない。タイトルはかっこつけただけで特に意味はないです。<br />
<br />
VuePressが現れるまでの苦悩とVuePressを触って見た感じ。
 - 夢その1 Nuxt
 - 夢その2 Gatsbyjs
 - 夢その3 VuePressを使えるレベルにする。
   - 開発のディレクトリ構成をいい感じに
   - metaタグをページ毎に変える。
   - 言語設定を日本語にする。
   - タイトルを変更する。
   - オリジナルテーマを作る。
   - pugを使う。
   - YAMLでコンテンツ管理する。
   - Babelを使う。
   - ルートディレクトリを指定する
   - Google Analyticsの設定
   - おまけ
     - Vueでグローバルなイベントを作りたい。
     - アニメーション
     - 他に気にすべきこと

## 夢その1 Nuxt
ちまたではNuxt最高！のモードが高まっているが、僕はそうは思わない。あいつはStatic GeneratorのふりをしているがStaticGeneratorではない。
ContentfullやPrismic.ioといったHeadlessCMS+Netlifyという環境に置いて最高なだけだ。
generateコマンドを打って生成されたファイルはリクエストを送っている。つまり外部APIがないと基本は動かない。外部APIを使わないでコンテンツを管理しようとするとNuxtはめんどくさい。
そしてsample.jp/about.htmlみたいな生成はできない。全てindex.htmlになる。これで奴らが納得するか？いや納得しないであろう。
儚い夢であった。

## 夢その2 Gatsbyjs
React製のStatic Generator。こいつは割と本命だった。こいつはStatic Generatorとしてこの世に生を受けたからだ。
当初はreactのJSXには抵抗があった。jadeやpugで楽を覚えたのに、タグを書いている人間が信じられなかった。pugのローダーがうまく動かん。どれがベストプラクティスなのだ。reduxなんてごついものは僕らにはいらない。...というような理由でvueが本当はよかったのだが、お前しかいないのならそこは目をつぶろうとした。しかし Gatsby buildしてみたらどうだろうか。アセットがrootディレクトリにしっちゃかめっちゃかになる。これを直そうという試みはstackoverflowでもあったがハードコーディングされてるからめんどいという状態だった。Graphqlのコンテンツ管理はよくできていた。だけどここでさようならだ。Goodby Gatsby.Thank you Gatsby. でもおまえはまだGreatではない。（夢をありがとう）

## 夢その3 VuePressを使えるレベルにする。
はい。ここからが本題。
基本的な使い方はまとめてくれている方がいるのでそちらを参考に。
[VuePress をお試ししてみた](https://qiita.com/dojineko/items/aae7e6d13479e08d49fd)

### 開発のディレクトリ構成をいい感じに
```
yarn add -D vuepress
```
```
└── vuepress-starter
    ├── .babelrc
    ├── .editorconfig
    ├── .envrc
    ├── .gitignore
    ├── README.md
    ├── package.json
    ├── src
    │   ├── .vuepress
    │   │   ├── config.js
    │   │   ├── enhanceApp.js
    │   │   ├── public
    │   │   ├── script
    │   │   └── theme
    │   ├── about
    │   │   └── index.md
    │   ├── assets
    │   │   ├── fonts
    │   │   └── images
    │   └── index.md
    ├── yarn-error.log
    └── yarn.lock
```
はこんな感じ
package.jsonに
```
"scripts": {
    "dev": "vuepress dev src",
    "build": "vuepress build src"
  },
```
こんな感じでディレクトリを指定しとく
[Inside an Existing Project](https://vuepress.vuejs.org/guide/getting-started.html#inside-an-existing-project)

これは好みだからやらなくても良い。

### metaタグをページ毎に変える。
metaタグは下記みたいな感じでグローバルの設定ができる。
``` javascript
module.exports = {
  title: 'Hello VuePress GLOBAL',
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
```

そして個別ページのmetaを変えたいときは
各ページのfrontmatterに
``` yaml
---
title: Home Title
description: Home description
meta:
 -
  og:title: 'og title Home page'
 -
  og:desciption: 'og Home description'
 -
  og:image: '//absolute-domain/thisog.jpg'
---
```
こんな感じで書いてやると上書きできる！<br />
(参考:[https://github.com/vuejs/vuepress/blob/8bbc5f30c7d2458ae2e5cb3f67709350e84a179c/lib/build.js](https://github.com/vuejs/vuepress/blob/8bbc5f30c7d2458ae2e5cb3f67709350e84a179c/lib/build.js))<br />
SSR後じゃないと反映されない。
ちなみにページを作りたいときは
.mdファイルを置いてやれば良い。
```
src/sample.md
src/about/index.md
```
[src/sample.md](/sample.html)<br />
[src/about/index.md](/about/)


### 言語設定を日本語にする。
開発のデフォルトのhtmlの言語設定がenになっている。<br />
SSR後の言語もデフォルトだとlang="en-US"になっているので、日本向けの時は変えてやる。
ページのmdファイルのfrontmatterに

``` yaml
---
lang: ja
---
```
を記載するとそのページだけ変わる。(SSR後に反映される。)
すべてのページ追記するのは冗長なので、デフォルトのthemeにはi18nが入っているのでそこの設定をいじる。
この辺に書いてある   [https://github.com/vuejs/vuepress/blob/2f0da0103dbc952023caffdfdb726f117ca3163d/docs/guide/i18n.md](https://github.com/vuejs/vuepress/blob/2f0da0103dbc952023caffdfdb726f117ca3163d/docs/guide/i18n.md)

``` javascript
module.exports = {
  base: '/',
  locales: {
    '/': {
      lang: 'ja',
        title: 'Hello VuePress GLOBAL',
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
  ...
}
```

### タイトルを変更する。
デフォルトのタイトルが
`$SITE_TITLE | $PAGE_TITLE`
みたいな感じなのでここを変えたい。
`$PAGE_TITLE`だけにしたい or `$PAGE_TITLE | $SITE_TITLE`みたいにしたい場合。
`.vuepress/enhanceApp.js`をいじる。

VuePressはデフォルトでdataMixin.jsを継承してる。
そのなかにtitleの記述があるのでそれを上書きしてやれば良い。
[https://github.com/vuejs/vuepress/blob/236224df4cb8424c7e75892c4bea49b2a6cb7cf4/lib/app/dataMixin.js](https://github.com/vuejs/vuepress/blob/236224df4cb8424c7e75892c4bea49b2a6cb7cf4/lib/app/dataMixin.js)

``` javascript
import headerMixin from './script/headerMixin'
export default ({
  Vue,
  options,
  router
}) => {
  Vue.mixin(headerMixin)
}
```
`headerMixin.js`
``` javascript
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
    }
  }
}
```
こんな感じにしてやる。


### オリジナルテーマを作る。
[Custom Themes](https://vuepress.vuejs.org/guide/custom-themes.html#site-and-page-metadata)
基本的にはここをみるとこからスタート。

```
vuepress eject [targetDir]
```
をすればdefaultのthemeを取得できる
[Customizing the Default Theme](https://vuepress.vuejs.org/guide/custom-themes.html#customizing-the-default-theme)


```
src/.vuepress/theme
```
をいじっていく。
src/.vuepress/theme/layout.vue
がテンプレートファイル

### pugを使う。
普通にpug-loaderをつかえやええのか？とか思ってたが、
[https://github.com/vuejs/vuepress/issues/146](https://github.com/vuejs/vuepress/issues/146)
ここ見ると`pug-plain-loader`使ってた。軽いぽい。ということで
```
yarn add pug-plain-loader pug -D
```

`src/.vuepress/config.js`
``` javascript
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
        .loader('pug-plain-loader')
        .end()
  },
}
```

`src/.vuepress/theme/Home.vue`
``` pug
<template lang="pug">
  .home
    .hero
      img(v-if="data.heroImage" :src="$withBase(data.heroImage)" alt="hero")
      h1 {{ data.heroText || $title || 'Hello'}}
      p.description {{ data.tagline || $description || 'Welcome to your VuePress site' }}
      p.action(v-if="data.actionText && data.actionLink")
        NavLink(class="action-button" :item="actionLink")
    .features(v-if="data.features && data.features.length")
      .feature(v-for="feature in data.features")
        h2 {{ feature.title }}
        p {{ feature.details }}
    Content(custom)
    .footer(v-if="data.footer") {{ data.footer }}

</template>
```
はい。使えた。

### YAMLでコンテンツ管理する。
まず、layout.vueをシンプルにしてみる。
``` pug
<template lang='pug'>
  .theme-container(:class="pageClasses")
    .custom-layout(v-if="$page.frontmatter.layout")
      component(:is="$page.frontmatter.layout")
    Home(v-else-if="$page.frontmatter.home")
    Page(v-else)
</template>
```
$pageにそのページのmdで記述した変数が入っている。見てもらえばわかるように、
frontmatterのlayoutで使うテンプレートを指定できるようになっている。

``` yaml
---
layout: home
```
とすればこのページではHomeコンポーネントを使うように指定できる。こんな感じでページごとにコンポーネントを変えてコーディングしていけば良い。
そしてfrontmatterにコンテンツの情報を記述していく。
``` yaml
contents:
  main:
    title: タイトルだよ
  slide:
    -
      title: slide_image1
    -
      title: slide_image2
    -
      title: slide_image2
  sections:
    -
      title: セクションタイトルだよ1
      text: |-
        ここにセクションの文章が入るよ。入るよ。ここにセクションの文章が入るよ。入るよ。ここにセクションの文章が入るよ。入るよ。ここにセクションの文章が入るよ。入るよ。
        ここにセクションの文章が入るよ。入るよ。ここにセクションの文章が入るよ。入るよ。ここにセクションの文章が入るよ。入るよ。
        ここにセクションの文章が入るよ。入るよ。
    -
      title: セクションタイトルだよ2
      text: |-
        ここにセクションの文章が入るよ。入るよ。ここにセクションの文章が入るよ。入るよ。ここにセクションの文章が入るよ。入るよ。ここにセクションの文章が入るよ。入るよ。
        ここにセクションの文章が入るよ。入るよ。
```

そして使いたいコンポーネントで
``` javascript
<template lang="pug">
  .home
    Main(v-bind:contents=`main`)
    Slide(v-bind:contents=`slide`)
    Section(
      v-for=`section,index in sections`
      v-bind:section=`section`
      v-bind:key=`index`)

</template>

<script>
import Main from '../components/Main'
import Slide from '../components/Slide'
import Section from '../components/Section'

export default {
  components: { Main, Slide, Section },

  computed: {
    main (){
      return this.$page.frontmatter.contents.main
    },
    slide(){
      return this.$page.frontmatter.contents.slide
    },
    sections(){
      return this.$page.frontmatter.contents.sections
    },
  }
}
</script>
```
とかする。

### Babelを使う。
async awaitとか使いたい。polyfillとかいい感じにしたい。
しかしながらVuePressはデフォルトだとbabelを使っていないので色々できない。
VuePressはBubble使っている。これを切ってbabelに切り替える。
[https://github.com/vuejs/vuepress/issues/124](https://github.com/vuejs/vuepress/issues/124)

```
なんでbubbleなんか使ってるんや？
Evan Youさん) 軽くて早いからやで
```
と言っているのでしょうがない。仕事で使う場合は色々対応しなきゃだめなんや。。bubbleさいなら。

こいつらをinstallする。dynamic-importもdeafult themeには必要。
```
"babel-core": "^6.26.0",
"babel-loader": "^7.1.4",
"babel-plugin-syntax-dynamic-import": "^6.18.0",
"babel-preset-env": "^1.6.1",
```
.babelrcをrootにおく。
`.babelrc`
``` javascript
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["ie 10", "safari >= 7"]
      },
      "useBuiltIns": true
    }]
  ],
  "plugins": ["syntax-dynamic-import"]
}
```

`src/.vuepress/config.js`
``` javascript
module.exports = {
  chainWebpack: config => {
    const jsRule = config.module.rule('js')
    jsRule.uses.delete('buble-loader')
    jsRule.use('babel-loader').loader('babel-loader')
  }
}
```
うりゃ。これでOK.

ちなみに、VuePressは webpack4使ってる。
CommonsChunkPluginグッバイ
optimization.splitChunksこんにちは。
最適化していく時はこの辺見た方が良い。
[https://qiita.com/soarflat/items/1b5aa7163c087a91877d](https://qiita.com/soarflat/items/1b5aa7163c087a91877d)

ちなみにVuePressデフォルトの設定はここ見る。    [https://github.com/vuejs/vuepress/blob/130c5a8468960dfacf788212f9d51f1874e3ca9c/lib/webpack/createBaseConfig.js](https://github.com/vuejs/vuepress/blob/130c5a8468960dfacf788212f9d51f1874e3ca9c/lib/webpack/createBaseConfig.js)

### ルートディレクトリを指定する
以下のようなディレクトリ配下に制作したファイルを展開しないといけない場合
http://sample.io/subdir/
そういう時には
```
module.exports = {
  base: `/subdir/`
  dest: `dist/subdir/`,
  ...
}
```
などと設定してやれば良い。<br />
この辺参照<br />
 - [Base URL](https://vuepress.vuejs.org/guide/assets.html#base-url)
 - [GitHub Pages](https://vuepress.vuejs.org/guide/deploy.html#github-pages)

ちなみにお手軽にbuild後のファイルを確認したいときは

```
yarn add http-server
```
packajsonに以下を追記
```
"preview": "http-server ./dist/"
```
```
yarn build
yarn preview
```
で確認したら楽。

### Google Analyticsの設定
デフォルトでGAに対応している。<br />
[ga](https://vuepress.vuejs.org/config/#ga)<br />
configファイルに追記
```
ga: 'TEST_ID_20180514'
```
でいける。
該当部分はここ[vuepress/lib/app/clientEntry.js](https://github.com/vuejs/vuepress/blob/1bbfa43f0b457d59d6445184f6e7f21713e97869/lib/app/clientEntry.js)

build後のソースコード
app.js
``` javascript
function(t, e, n) {
    "use strict";
    n(247);
    var r, o, i, a, s, u, c = n(243),
        f = (n(111), (0, c.createApp)()),
        l = f.app,
        p = f.router;
    r = window, o = document, i = "script", a = "ga", r.GoogleAnalyticsObject = a, r.ga = r.ga || function() {
        (r.ga.q = r.ga.q || []).push(arguments)
    }, r.ga.l = 1 * new Date, s = o.createElement(i), u = o.getElementsByTagName(i)[0], s.async = 1, s.src = "https://www.google-analytics.com/analytics.js", u.parentNode.insertBefore(s, u), ga("create", "TEST_ID_20180514", "auto"), ga("send", "pageview"), p.afterEach(function(t) {
        ga("set", "page", t.fullPath), ga("send", "pageview")
    }), p.onReady(function() {
        l.$mount("#app")
    })
},
```
いけてるくさい。
### おまけ

#### Vueでグローバルなイベントを作りたい。
modalは共通で利用するけど中身だけ置き換えたいみたいなとき。
enhanceApp.jsで
```
Vue.prototype.$eventHub = new Vue()
```
してやれば、
modalコンポーネントではこんな感じでイベントを見て
```
created () {
  this.$eventHub.$on('modalOpen',this.open)
},
beforeDestroy(){
  this.$eventHub.$off('modalOpen')
},
methods:{
  open(url){
    this.$modal.show('mymodal')
    this.change(url)
  },
}
```
呼び出したいコンポーネントで
```
methods: {
  click(url){
    this.$eventHub.$emit('modalOpen',url)
  },
},
```
を呼んでやればmodalコンポーネントのopenを発火できる。
簡単にやりたいときはこのやり方でも良いけど複雑になってきたらvue storeを使った方が良さげぽい。

参照<br />
[Create a global event bus in Vue.js](https://medium.com/vuejobs/create-a-global-event-bus-in-vue-js-838a5d9ab03a)

#### アニメーション
Nuxtですがこちら見ればOK<br />
[Vue.js(Nuxt.js)でアニメーションやってみたら最高だった話。](https://qiita.com/SoichiroNitta/items/8d8ce14fc287aa233ae6)


#### 他に気にすべきこと
 - SSRなので使えないライブラリもある。使うライブラリがssr対応しているか確認する。最悪dynamic-importで逃げれる。
 - SNSのembed系がめんどい時ある。iframeとか。
 - バンバン開発中なんで上記のやり方がすぐ使えなくなるなんてことはもちろんある。

<br />
てなてな感じ。いけるのかこれ？いけるのかこれ？！感触良いぞVuePress!夢を見せてくれ！<br />
※基本的に、僕はVueも素人なので間違ってるところあったらごめんなさい。あとVuePressのバージョンは0.8.4です。バンバンコミットあるので変更すぐあって使えなくなる可能性大です。


[gollowars/vuepress-starter](https://github.com/gollowars/vuepress-starter)
(Notosansいるんで重いです。)
