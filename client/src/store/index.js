import Vue from 'vue'
import Vuex from 'vuex'
// import appConfig from '../plugins/appConfig'

// import VueSocketio from 'vue-socket.io'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'

// J'importe mes modules du store
import contactModule from './contactModule'
import dbModule from './dbModule'
import globalModule from './globalModule'
import userModule from './userModule'
import ingests from './ingests'
import helpModule from './helpModule'

Vue.use(Vuex)

// VUEX PLUGINS https://vuex.vuejs.org/guide/plugins.html

const syncSessions = store => {
  store.subscribe((mutation, state) => {
    // Si les sessions sont synchronisées, alors à chaque commit j'envoie une requête à l'autre pour qu'il committe aussi de son côté
    if (state.helpModule.sessionSharing === true) {
      // console.log(mutation)
      // if (mutation.type === 'globalModule/rightDrawerOpenMutation') {
      // Je vérifie que la mutation à propager n'est pas déjà une mutation propagée, afin d'éviter de créer une boucle infinie
      if (!mutation.payload.hasOwnProperty('technicalData') || !mutation.payload.technicalData.hasOwnProperty('propagateSyncSession') || mutation.payload.technicalData.propagateSyncSession === true) {
        console.log('--> SYNC THIS MUTATION: ' + mutation.type)
        // console.log(Vue)
        // console.log(mutation)
        store.dispatch('dbModule/syncSessionsSendAction', mutation)
      }
      // }
    }
  })
}
/*
function syncSessions (io) {
  console.log(io)
  return store => {
    // Quand le serveur m'envoie une mutation à effectuer, je l'effectue
    io.on('socketSyncSessions', data => {
      console.log('==> ' + data.type)
      store.commit(data.type, data.payload)
    })
    store.subscribe((mutation, state) => {
      // Si les sessions sont synchronisées, alors à chaque commit j'envoie une requête à l'autre pour qu'il committe aussi de son côté
      if (state.helpModule.sessionSharing === true) {
        console.log('--> ' + mutation.type)
        // console.log(mutation)
        io.to(state.helpModule.roomName).emit('syncSessions', mutation)
      }
    })
  }
}

const syncSessionsPlugin = syncSessions(Vue.prototype.$socket)
*/

// J'associe mes modules à mon store
const store = new Vuex.Store({
  modules: {
    contactModule,
    dbModule,
    globalModule,
    userModule,
    ingests,
    helpModule
  },
  strict: true,
  plugins: [syncSessions]
})

// J'associe Vuex à mes modules store
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { store })
/*
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { globalModule })
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { contactModule })
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { userModule })
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { ingests })
*/

// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// get into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./contactModule'], () => {
    const newContactModule = require('./contactModule').default
    store.hotUpdate({ modules: { contactModule: newContactModule } })
  })
  module.hot.accept(['./dbModule'], () => {
    const newDbModule = require('./dbModule').default
    store.hotUpdate({ modules: { contactModule: newDbModule } })
  })
  module.hot.accept(['./globalModule'], () => {
    const newGloalModule = require('./globalModule').default
    store.hotUpdate({ modules: { globalModule: newGloalModule } })
  })
  module.hot.accept(['./userModule'], () => {
    const newUserModule = require('./userModule').default
    store.hotUpdate({ modules: { userModule: newUserModule } })
  })
  module.hot.accept(['./ingests'], () => {
    const newIngests = require('./ingests').default
    store.hotUpdate({ modules: { ingests: newIngests } })
  })
  module.hot.accept(['./helpModule'], () => {
    const newHelpModule = require('./helpModule').default
    store.hotUpdate({ modules: { ingests: newHelpModule } })
  })
}

export default store
