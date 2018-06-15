import Vue from 'vue'
import Vuex from 'vuex'
// import VueSocketio from 'vue-socket.io'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'

import ingests from './ingests' // J'importe le store "ingest"

Vue.use(Vuex)
// Vue.use(VueSocketio, 'https://idp-etcocloud9.c9users.io:8081') // J'ouvre un tunnel avec le serveur dès le chargement de l'appli
// Vue.use(VueSocketio, 'https://idp-etcocloud9.c9users.io:8081', ingests)
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { ingests })

const store = new Vuex.Store({
  modules: {
    ingests
  },
  mutations: {
    SOCKET_TOTO: (state, value) => {
      console.log('socket contact created in idp_contacts.vue')
      // state.contacts.rtbfLogin = value.rtbfLogin
      // state.contacts.firstName = value.firstName
      // state.contacts.lastName = value.lastName
      Object.keys(value).forEach(function (key) {
        state.contacts[key] = value[key]
      })
    }
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
