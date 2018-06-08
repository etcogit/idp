import Vue from 'vue'
import Vuex from 'vuex'
import VueSocketio from 'vue-socket.io'

import ingests from './ingests' // J'importe le store "ingest"

Vue.use(Vuex)
// Vue.use(VueSocketio, 'https://idp-etcocloud9.c9users.io:8081') // J'ouvre un tunnel avec le serveur dès le chargement de l'appli
Vue.use(VueSocketio, 'https://idp-etcocloud9.c9users.io:8081', ingests)

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
