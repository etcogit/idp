// import something here

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$appConfig = {
    restApiUrl: 'https://idp-etcocloud9.c9users.io:8081',
    db: {
      logs: {
        fieldsToStringify: [
          'userPlatform',
          'rootState',
          'payloadToServer',
          'dataBeforeAction',
          'dataAfterAction',
          'frontendErrorMessage'
        ],
        maxLimitResults: 100
      },
      contacts: {
        maxLimitResults: 100
      }
    }
  }
}
