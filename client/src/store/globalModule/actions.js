import Vue from 'vue'
import router from '../../router'
import { extend, Cookies } from 'quasar'

// Exemple de méthode qui appelle cette action:
// this.saveLogAction({frontendAction: 'createContact', backendAction: 'createContact', payloadToServer: this.newContact})
export const saveLogAction = ({ commit, rootState }, data) => {
  // console.log(rootState.globalModule.bool)
  // Je n'enregistre des logs que s'il y a un utilisateur connecté
  if (rootState.globalModule.userConnected.hasOwnProperty('_id')) {
    if (Vue.prototype.$appConfig.global.console.logs === true) {
      console.log('globalModule/actions.js/saveLogAction: ')
    }
    // Je rajoute à data des informations "automatiques"
    data.frontendTimeStamp = Date() // met sert aussi de clé unique pour ma requête avec le serveur
    data.socketId = Vue.prototype.$socket.id
    data.userId = rootState.globalModule.userConnected._id
    data.userRtbfLogin = rootState.globalModule.userConnected.rtbfLogin
    data.userPlatform = rootState.globalModule.userPlatform
    data.userDevice = rootState.globalModule.userDevice
    data.route = router.history.current.fullPath // me permet de récupérer le "path" de l'url
    // console.log(rootState)
    data.rootState = extend(true, data.rootState, rootState) // Je copie aussi le rootState...
    // data.rootState = JSON.parse(JSON.stringify(rootState)) // Je copie aussi le rootState...
    // data.rootState = JSON.parse(JSON.stringify(rootState, getCircularReplacer())) // Je copie aussi le rootState...
    // data.rootState = JSON.parse(JSON.decycle(rootState)) // Je copie aussi le rootState...
    // data.rootState = JSON.parse(JSON.stringify(JSON.decycle(rootState))) // Je copie aussi le rootState...
    // Je supprime de "dbModule" toutes les data qui proviennent de la DB -> ça ne sert à rien de les sauvegarder dans les logs
    for (var key in data.rootState.dbModule) {
      // skip loop if the property is from prototype
      if (data.rootState.dbModule.hasOwnProperty(key)) {
        data.rootState.dbModule[key].results = ['-deleted-']
      }
    }
    // Je supprime le contenu du globalModule.tempLogs puisqu'il contient une copie du rootState
    data.rootState.globalModule.tempLogs = ['-deleted-']
    // console.log(JSON.stringify(data.rootState)) // Je copie aussi le rootState...
    let fieldsToStringify = Vue.prototype.$appConfig.db.logs.fieldsToStringify
    // console.log('fieldsToStringify = ' + JSON.stringify(fieldsToStringify))
    for (var i = 0; i < fieldsToStringify.length; i++) {
      // console.log('fieldsToStringify = ' + fieldsToStringify[i])
      // data[fieldsToStringify[i]] = JSON.stringify(data[fieldsToStringify[i]])
      // data[fieldsToStringify[i]] = JSON.stringify(data[fieldsToStringify[i]], getCircularReplacer())
      data[fieldsToStringify[i]] = JSON.stringify(data[fieldsToStringify[i]])
    }
    // Je sauvegarde le log dans la mémoire tampon locale (en cas d'erreur ou de déconnexion avec le serveur, je garde un historique des actions)
    commit('addLogToTempMemoryMutation', data)
    // J'envoie la requete au serveur
    Vue.prototype.$socket.emit('saveLogAction', data)
    // console.log(data)
    // return data
    // console.log(Vue.prototype.$socket)
  }
}
export const connectUserAction = ({ dispatch, commit, state }, data) => {
  console.log('globalModule/actions.js/connectUserAction: ' + data)
  // Je retire le formulaire modal de connection (au cas où il était affiché)
  commit('promptUserConnectionMutation', false)
  // J'enregistre mon user dans le store
  commit('connectUserMutation', data)
  // S'il y avait un cookie "userConnected" je l'écrase, même si c'était déjà le bon user qui était renseigné dans le cookie
  Cookies.set('userConnected', state.userConnected, {path: '/'})
  // S'il y a un cookie "device", je récupère la valeur pour la stocker dans le state globalModule
  if (Cookies.has('userDevice')) {
    commit('userDeviceMutation', Cookies.get('userDevice'))
  } else {
    commit('promptUserDeviceNameMutation')
  }
  // S'il n'y a pas de cookie "device" j'affiche le formulaire demandant d'identifier le device

  // Je vais chercher les dernières sessions de mon user
  dispatch('dbModule/getLastSessionsAction', data, {root: true})
  dispatch('globalModule/saveLogAction', {frontendAction: 'globalModule/actions.js/connectUserAction'}, {root: true})
}
export const connectUserIfCookieAction = ({ dispatch, commit, state }, data) => {
  console.log('globalModule/actions.js/connectUserIfCookieAction: ')
  // Si j'ai un cookie 'userConnected', je connecte l'utilisateur renseigné dans le cookie
  // console.log(Cookies.get('userConnected'))
  if (Cookies.has('userConnected')) {
    dispatch('connectUserAction', {value: Cookies.get('userConnected')})
  } else {
    // Si je n'ai pas de cookie, je dois afficher la fenêtre modale de connection
    Vue.prototype.$q.loading.hide()
    commit('promptUserConnectionMutation', true)
  }
  dispatch('globalModule/saveLogAction', {frontendAction: 'globalModule/actions.js/connectUserIfCookieAction'}, {root: true})
}
export const disconnectUserAction = ({ dispatch, commit, state }) => {
  console.log('globalModule/actions.js/disconnectUserAction')
  // Je supprime le cookie "userConnected"
  Cookies.remove('userConnected') // -> semble ne pas fonctionner
  commit('disconnectUserMutation')
  // commit('promptUserConnectionMutation')
  dispatch('globalModule/saveLogAction', {frontendAction: 'globalModule/actions.js/disconnectUserAction'}, {root: true})
}
export const createUserDeviceCookieAction = ({ dispatch, commit, state }) => {
  console.log('globalModule/actions.js/createUserDeviceCookieAction')
  // Je crée un cookie avec le nom du device
  Cookies.set('userDevice', state.userDevice)
  // Je retire le formulaire
  commit('promptUserDeviceNameMutation', false)
  dispatch('globalModule/saveLogAction', {frontendAction: 'globalModule/actions.js/createUserDeviceCookieAction'}, {root: true})
}

// https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
// Fonction qui remplace les références cycliques d'objets par le "path" dans le JSON de l'objet qu'il référence...
JSON.decycle = function decycle (object, replacer) {
  'use strict'

  // Make a deep copy of an object or array, assuring that there is at most
  // one instance of each object or array in the resulting structure. The
  // duplicate references (which might be forming cycles) are replaced with
  // an object of the form

  //      {"$ref": PATH}

  // where the PATH is a JSONPath string that locates the first occurance.

  // So,

  //      var a = []
  //      a[0] = a
  //      return JSON.stringify(JSON.decycle(a))

  // produces the string '[{"$ref":"$"}]'.

  // If a replacer function is provided, then it will be called for each value.
  // A replacer function receives a value and returns a replacement value.

  // JSONPath is used to locate the unique object. $ indicates the top level of
  // the object or array. [NUMBER] or [STRING] indicates a child element or
  // property.

  var objects = new WeakMap() // object to path mappings

  return (function derez (value, path) {
    // The derez function recurses through the object, producing the deep copy.

    var oldPath // The path of an earlier occurance of value
    var nu // The new object or array

    // If a replacer function was provided, then call it to get a replacement value.

    if (replacer !== undefined) {
      value = replacer(value)
    }

    // typeof null === "object", so go on if this value is really an object but not
    // one of the weird builtin objects.

    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Boolean) &&
      !(value instanceof Date) &&
      !(value instanceof Number) &&
      !(value instanceof RegExp) &&
      !(value instanceof String)
    ) {
    // If the value is an object or array, look to see if we have already
    // encountered it. If so, return a {"$ref":PATH} object. This uses an
    // ES6 WeakMap.

      oldPath = objects.get(value)
      if (oldPath !== undefined) {
        return {$ref: oldPath}
      }

      // Otherwise, accumulate the unique value and its path.

      objects.set(value, path)

      // If it is an array, replicate the array.

      if (Array.isArray(value)) {
        nu = []
        value.forEach(function (element, i) {
          nu[i] = derez(element, path + '[' + i + ']')
        })
      } else {
      // If it is an object, replicate the object.

        nu = {}
        Object.keys(value).forEach(function (name) {
          nu[name] = derez(
            value[name],
            path + '[' + JSON.stringify(name) + ']'
          )
        })
      }
      return nu
    }
    return value
  }(object, '$'))
}
// J'ai une fonction qui permet de "casser" la "circularité" des objets JSON. Donc si j'ai des objets a qui référencent des objets b et que ces objets b référencent des objets a, ça crée une circularité et JSON.stringify tourne en boucle
// Cette fonction est donc utilisée dans les JSON.stringify ci-dessous
// L'idéal serait de savoir quels sont les objets qui créent cette circularité...
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Erreurs/Cyclic_object_value
/*
const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        console.log('----- value = ')
        console.log(value)
        return
      }
      seen.add(value)
    }
    return value
  }
}
*/
