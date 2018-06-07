import Vue from 'vue'
import Vuex from 'vuex'

import ingests from './ingests'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    ingests
  }
  // strict: true
})

// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// get into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./ingests'], () => {
    const newIngests = require('./ingests').default
    store.hotUpdate({ modules: { ingests: newIngests } })
  })
}

export default store
