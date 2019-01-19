import {
  LoadingManager,
  TextureLoader,
  LinearFilter,
  ImageUtils
} from 'three'

export default class Loader {
  constructor() {
    this.urls = []
    this.textures = {}

    this.onProgress = this.onProgress.bind(this)
    this.init()
  }

  init() {

  }

  add(url) {
    this.urls.push(url)
  }

  load(){
    return new Promise((resolve)=>{
      this.manager = new LoadingManager(() => {
        resolve()
      }, this.onProgress, this.Error)
      this.loader = new TextureLoader(this.manager)


      this.urls.forEach((url, index) => {
        if (url.indexOf('http') >= 0) {
          // console.log('url:',url)
          this.loader.setCrossOrigin('anonymous')
          ImageUtils.crossOrigin = 'anonymous'
        }else {
          this.loader.setCrossOrigin('')
          ImageUtils.crossOrigin = ''
        }
        this.textures[url] = this.loader.load(url)
      })
    })
  }

  get(key) {
    return this.textures[key]
  }

  onProgress(url, itemsLoaded, itemsTotal) {
    // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  }
  onError(url) {
    new Error('Cannot load ' + url)
  }
}
