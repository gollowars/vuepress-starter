import { fromEvent } from 'rxjs'

export function resizeCover(objW,objH,screenW,screenH){
  const wi = objW
  const hi = objH
  const ws = screenW
  const hs = screenH
  const ri = wi / hi
  const rs = ws / hs
  const resize = rs > ri ? { width: ws, height: hi * ws / wi } : { width: wi * hs / hi, height: hs }
  return resize
}

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
