import axios from 'axios'

import Request from './Request'
import Config from './Config'

const debug = require('debug')('yuri:store')


class Search extends Request {
  constructor() {
    super()
  }

  _init() {
    this.scene = null
    this.didCreatedCanvas = false
    this.items = []
  }


  async search(type) {
    if (!this.data[type]){
      if (type == Config.CONTENTS_TYPE.all) {
        let result = await axios(`/assets/works.json`)
        let posts = result.data.posts.map((obj, index) => {
          obj.data.link = obj.link
          return obj.data
        })
        this.data[type] = posts
      }
    }
    return this.data[type]
  }
}
export default new Search()

