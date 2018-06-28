import headerMixin from './script/headerMixin'
import createStore from './script/createStore'

export default ({
  Vue,
  options,
  router,
  siteData
}) => {
  Vue.mixin(headerMixin)
  createStore({ Vue, options })
}
