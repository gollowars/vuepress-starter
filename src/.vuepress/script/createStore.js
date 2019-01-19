import Vuex from 'vuex'
import Responsive from './store/Responsive'
import Scroll from './store/Scroll'
import Common from './store/Common'

export default function ({
  Vue,
  options
}) {
  Vue.use(Vuex)

  const store = new Vuex.Store({
    modules: {
      Common: {
        namespaced: true,
        ...Common
      },
      Responsive: {
        namespaced: true,
        ...Responsive
      },
      Scroll: {
        namespaced: true,
        ...Scroll
      },
    }
   })
  Object.assign(options, {
    store
  })
}
