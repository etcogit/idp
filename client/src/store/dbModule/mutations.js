import Vue from 'vue'

export const keepDbContactsMutation = (state, data) => {
  console.log('dbModule/mutations.js/keepDbContactsMutation: ')
  // state.tempContacts = JSON.parse(JSON.stringify(data))
  // Object.assign(state.contacts, data)
  // Si je ne reçois qu'un seul contact (quand je viens d'en rajouter un), je l'ajoute à la liste
  if (!Array.isArray(data)) {
    state.dbContacts.results.push(data)
  } else {
    // Si je reçois plusieurs contacts, j'écrase la liste
    state.dbContacts.results = JSON.parse(JSON.stringify(data))
  }
}
/*
export const keepDbUsersForAutocompleteMutation = (state, data) => { // Normalement, avec l'auto login, il ne devrait pas y avoir cette mécanique
  console.log('dbModule/mutations.js/keepDbUsersForAutocompleteMutation: ' + data)
  state.dbUsersForAutocomplete.results.push({
    // stringToSearchFor: data.firstName + ' ' + data.lastName + ' ' + data.rtbfLogin,
    stringToSearchFor: data.rtbfLogin,
    value: data,
    label: data.firstName + ' ' + data.lastName,
    sublabel: data.rtbfLogin + '@rtbf.be',
    icon: 'person'
  })
}
*/
export const keepDbLogsMutation = (state, data) => {
  console.log('dbModule/mutations.js/keepDbLogsMutation: ')
  // state.tempContacts = JSON.parse(JSON.stringify(data))
  // Object.assign(state.contacts, data)
  if (!Array.isArray(data)) {
    state.dbLogs.results.push({id: data._id, raw: data, treeFormatted: []})
  } else {
    // Si je reçois plusieurs contacts, j'écrase la liste
    var newData = []
    for (var i = 0; i < data.length; i++) {
      newData.push({id: data[i]._id, raw: data[i], treeFormatted: []})
    }
    state.dbLogs.results = JSON.parse(JSON.stringify(newData))
  }
}
// Cette mutation formatte un log pour le rendre compatible avec le composant q-tree. Il convertit les JSON stockés sous forme de texte en JSON puis parse le tout pour correspondre au schéma attendu par q-tree
export const formatLogMutation = (state, [jsonObjToFormat, arrayIndex]) => {
  console.log('dbModule/mutations.js/formatLogMutation: ')
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
  state[data.db][data.requestType] = {date: new Date(), request: data.request}
}
