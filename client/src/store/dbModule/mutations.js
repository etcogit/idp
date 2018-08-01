import Vue from 'vue'

export const keepDbContactsMutation = (state, data) => {
  console.log('dbModule/mutations.js/keepDbContactsMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // state.tempContacts = JSON.parse(JSON.stringify(myData))
  // Object.assign(state.contacts, myData)
  // Si je ne reçois qu'un seul contact (quand je viens d'en rajouter un), je l'ajoute à la liste
  if (!Array.isArray(myData)) {
    state.dbContacts.results.push(myData)
  } else {
    // Si je reçois plusieurs contacts, j'écrase la liste
    state.dbContacts.results = JSON.parse(JSON.stringify(myData))
  }
}
export const keepDbLogsMutation = (state, data) => {
  if (Vue.prototype.$appConfig.global.console.logs === true) {
    console.log('dbModule/mutations.js/keepDbLogsMutation: ')
  }
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // state.tempContacts = JSON.parse(JSON.stringify(myData))
  // Object.assign(state.contacts, myData)
  if (!Array.isArray(myData)) {
    state.dbLogs.results.push({id: myData._id, raw: myData, treeFormatted: []})
  } else {
    // Si je reçois plusieurs contacts, j'écrase la liste
    var newData = []
    for (var i = 0; i < myData.length; i++) {
      newData.push({id: myData[i]._id, raw: myData[i], treeFormatted: []})
    }
    state.dbLogs.results = JSON.parse(JSON.stringify(newData))
  }
}
// Cette mutation formatte un log pour le rendre compatible avec le composant q-tree. Il convertit les JSON stockés sous forme de texte en JSON puis parse le tout pour correspondre au schéma attendu par q-tree
export const formatLogMutation = (state, [jsonObjToFormat, arrayIndex]) => {
  console.log('dbModule/mutations.js/formatLogMutation: ')
  // let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // Fonction récursive qui formatte mon objet
  var jsonToTree = function (jsonObj, resultArray) {
    for (var key in jsonObj) {
      if (typeof jsonObj[key] === 'object') {
        var newArr = []
        resultArray.push({label: key, children: newArr})
        jsonToTree(jsonObj[key], newArr)
      } else {
        resultArray.push({label: key + ': ' + jsonObj[key]})
      }
    }
    return resultArray
  }

  // Je formate mon objet que s'il n'a pas déjà été formaté
  if (state.dbLogs.results[arrayIndex].treeFormatted.length === 0) {
    // Je remet en JSON toutes les données stockées sous forme de text dans la DB à des fins de recherche full text. La liste des champs est stockée dans le plugin "appConfig"
    let fieldsToParse = Vue.prototype.$appConfig.db.logs.fieldsToStringify
    // console.log('fieldsToParsee = ' + JSON.stringify(fieldsToParse))
    for (var i = 0; i < fieldsToParse.length; i++) {
      if (jsonObjToFormat[fieldsToParse[i]]) { // Si ce champ est dans la liste des champs à formater, alors je le fais
        console.log('fieldsToParsee = ' + fieldsToParse[i] + ' -> ' + JSON.parse(jsonObjToFormat[fieldsToParse[i]]))
        jsonObjToFormat[fieldsToParse[i]] = JSON.parse(jsonObjToFormat[fieldsToParse[i]])
      }
    }
    // Je dois maintenant trouver dans mon state.dbLogs.results la ligne que je viens de traiter pour pouvoir y rajouter mon formattage
    state.dbLogs.results[arrayIndex].treeFormatted = jsonToTree(jsonObjToFormat, [])
  }
}
export const saveLastRequest = (state, data) => {
  console.log('dbModule/mutations.js/saveLastRequest: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state[myData.db][myData.requestType] = {date: new Date(), request: myData.request}
}
export const keepUsersThatNeedHelpMutation = (state, data) => {
  console.log('dbModule/mutations.js/keepUsersThatNeedHelpMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.listUsersThatNeedHelp.results = myData
}

function getDataIfSyncSessions (data) {
  // ---- si on est en mode "syncSessions", les données du payload sont dans un sous-objet "data.data"
  let myData = null
  if (data.hasOwnProperty('data')) {
    myData = data.data
  } else {
    myData = data
  }
  return myData
  // ----
}
