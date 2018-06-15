import Vue from 'vue'
import Vuex from 'vuex'

// import VueSocketio from 'vue-socket.io'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'

// J'importe mes modules du store
import globalModule from './globalModule'
import contactModule from './contactModule'
import userModule from './userModule'
import ingests from './ingests'

Vue.use(Vuex)

// J'associe mes modules à mon store
const store = new Vuex.Store({
  modules: {
    globalModule,
    contactModule,
    userModule,
    ingests
  },
  strict: true
})

// J'associe Vuex à mes modules store
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { store })
/*
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { globalModule })
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { contactModule })
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { userModule })
Vue.use(VueSocketio, io('https://idp-etcocloud9.c9users.io:8081'), { ingests })
*/

/*
// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// get into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./globalModule'], () => {
    const newGloalModule = require('./globalModule').default
    store.hotUpdate({ modules: { globalModule: newGloalModule } })
  })
  module.hot.accept(['./contactModule'], () => {
    const newContactModule = require('./contactModule').default
    store.hotUpdate({ modules: { contactModule: newContactModule } })
  })
  module.hot.accept(['./userModule'], () => {
    const newUserModule = require('./userModule').default
    store.hotUpdate({ modules: { userModule: newUserModule } })
  })
  module.hot.accept(['./ingests'], () => {
    const newIngests = require('./ingests').default
    store.hotUpdate({ modules: { ingests: newIngests } })
  })
}
*/
export default store
