import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  LinearFilter,
  TextGeometry
} from 'three'


import Vibrant from 'node-vibrant/lib/browser.js'
import QuantizerWebWorker from 'node-vibrant/lib/quantizer/worker'

function createColorPlane(hex) {
  const geo = new PlaneGeometry(1, 1, 10, 10)
  const tex = new MeshBasicMaterial({
    color: hex
  })
  return new Mesh(geo, tex)
}

function createPaletteColorGroup(palette, size) {
  const group = new Group()

  Object.keys(palette).forEach((key, index) => {
    if (!palette[key]){
      return
    }
    const swatch = palette[key]
    const hex = eval(swatch.getHex().replace('#', '0x'))
    const mesh = createColorPlane(hex)
    mesh.scale.set(size, size, 1)
    const x = index * size + size / 2
    const y = size / 2
    mesh.position.x = x
    mesh.position.y = y

    group.add(mesh)
  })

  return group
}

function comparePopulation(a,b) {
  if(a._population < b._population) {
    return 1
  }
  if (a._population > b._population) {
    return -1
  }
  return 0
}

class ColorDetector {
  constructor(){

  }

  async detect(path) {
    return new Promise((resolve,reject)=>{

      Vibrant.from(path, {
        colorCount: 255,
        quality: 20
      }).useQuantizer(QuantizerWebWorker.default)
      .getPalette((err,palette)=>{
        // console.log('-------------')
        // console.log('path:', path)
        // console.log('err:',err)
        resolve({
          palette: palette,
          path: path
        })
      })
    })
  }

  sortPalette(palette) {
    let vibrantList = []
    let mutedList = []
    Object.keys(palette).forEach((key, index) => {
      if (!palette[key]) return
      if (key.toLocaleLowerCase().indexOf('vibrant') >= 0) {
        vibrantList.push(palette[key])
      } else {
        mutedList.push(palette[key])
      }
    })
    vibrantList = vibrantList.sort(comparePopulation)
    mutedList = mutedList.sort(comparePopulation)
    return {
      vibrants:vibrantList,
      muteds: mutedList
    }
  }

  getDominantColors(palette) {
    const { vibrants, muteds } = this.sortPalette(palette)
    const dominantVibrant = eval(vibrants[0].getHex().replace('#', '0x'))
    const dominantVibrantRgb = eval(vibrants[0].getRgb())
    const dominantVibrantPopulation = vibrants[0]._population
    const dominantMuted = eval(muteds[0].getHex().replace('#', '0x'))
    const dominantMutedRgb = eval(muteds[0].getRgb())
    const dominantMutedPopulation = muteds[0]._population



    return {
      vibrant: {
        hex: dominantVibrant,
        rgb: dominantVibrantRgb,
        population: dominantVibrantPopulation
      },
      muted: {
        hex: dominantMuted,
        rgb: dominantMutedRgb,
        population: dominantMutedPopulation
      }
    }
  }

  getContrastColors(palette) {
    // console.log(palette)
    let v1 = null
    if (!v1) { v1 = (palette.DarkVibrant) ? palette.DarkVibrant.getHex() : null }
    if (!v1) { v1 = (palette.Vibrant) ? palette.Vibrant.getHex() : null }
    if (!v1) { v1 = (palette.LightVibrant) ? palette.LightVibrant.getHex() : null }
    if (!v1) { v1 = (palette.DarkMuted) ? palette.DarkMuted.getHex() : null }
    if (!v1) { v1 = (palette.Muted) ? palette.Muted.getHex() : null }
    if (!v1) { v1 = (palette.LightMuted) ? palette.LightMuted.getHex() : null }
    if (!v1) { v1 = '#FFFFFF' }

    const vc = eval(v1.replace('#', '0x'))

    let m1 = null
    if (!m1) { m1 = (palette.Muted) ? palette.Muted.getHex() : null }
    if (!m1) { m1 = (palette.LightMuted) ? palette.LightMuted.getHex() : null }
    if (!m1) { m1 = (palette.DarkMuted) ? palette.DarkMuted.getHex() : null }
    if (!m1) { m1 = (palette.LightVibrant) ? palette.LightVibrant.getHex() : null }
    if (!m1) { m1 = (palette.Vibrant) ? palette.Vibrant.getHex() : null }
    if (!m1) { m1 = (palette.DarkVibrant) ? palette.DarkVibrant.getHex() : null }
    if (!m1) { m1 = '#000000' }
    const mc = eval(m1.replace('#', '0x'))

    return vc,mc
  }




}


export default new ColorDetector()


export function createPaletteMesh(palette, texture) {
  const group = new Group()
  const geo = new PlaneGeometry(1, 1, 10, 10)
  const tex = new MeshBasicMaterial({
    map: texture
  })

  const w = texture.image.width
  const h = texture.image.height
  const originalImageMesh = new Mesh(geo, tex)
  originalImageMesh.scale.set(w, h, 1)
  group.add(originalImageMesh)

  const size = 50
  const paletteGroup = createPaletteColorGroup(palette, size)
  paletteGroup.position.x = - w / 2
  paletteGroup.position.y = - h / 2
  group.add(paletteGroup)
  return group
}
