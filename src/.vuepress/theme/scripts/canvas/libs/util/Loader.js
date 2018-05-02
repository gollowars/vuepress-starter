import {
  LoadingManager,
  TextureLoader,
} from 'three'

class Loader {
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
        this.textures[url] = this.loader.load(url)
      })
    })
  }

  onProgress(url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  }
  onError(url) {
    new Error('Cannot load ' + url)
  }
}

export default new Loader()
