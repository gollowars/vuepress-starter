import dat from 'dat-gui'

class Params {
  constructor() {
    this.objList = {}
    this.init()
  }

  init() {
    this.gui = new dat.GUI()
  }

  add(obj,folder){
    const gui = (folder) ? this.gui.addFolder(folder): this.gui
    if(folder) gui.open()

    for (let key in obj) {
      const val = obj[key]
      let g = null
      if (key.indexOf('Color') > 0) {
        g = gui.addColor(val, 'value').name(key)
      }else {
        if(val.list) {
          g = gui.add(val, 'value', val.list).name(key)
        }else {
          g = gui.add(val, 'value', val.min, val.max).name(key)
        }
      }
      val.gui = g
    }
    this.objList[name] = obj
  }
  get(name) {
    return this.objList[name]
  }
}


export default new Params()
