import axios from 'axios'

export default class Request {
  constructor() {
    this.data = {}
    this._init()
  }

  _init() {

  }

  async get(url) {
    if (!this.data[url]){
      const result = await axios.get(url)
      this.data[url] = result.data
    }
    return this.data[url]
  }
}
