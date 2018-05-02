import { fromEvent } from 'rxjs'

class Resizer {
  constructor() {
    this.resizeEvents = {}
    this._resize = this._resize.bind(this)
  }

  _resize() {
    for(let key in this.resizeEvents) {
      this.resizeEvents[key]()
    }
  }

  start() {
    this.resizeSubscription = fromEvent(window, 'resize')
      .subscribe(this._resize)
  }

  end() {
    this.resizeSubscription.unsubscribe()
  }

  add(key, cb) {
    if (typeof cb !== 'function') throw new TypeError("cb is invalidate type");
    if (typeof key !== 'string') throw new TypeError("key is invalidate type");

    this.resizeEvents[key] = cb
  }

  remove(key){
    delete this.resizeEvents[key]
  }

  removeAll() {
    for (var key in this.resizeEvents) {
      delete this.resizeEvents[key]
    }
  }
}

export default new Resizer()
