export default {
  ingests: {
    emptyPattern: {
      ingestId: '',
      ingestGlobalPatternName: [],
      ingestGlobalKillDate: 0,
      ingestGlobalKillDateHuman: '',
      ingestTotalSize: 0,
      ingestTotalSizeHuman: 0,
      ingestUploadedSize: 0,
      ingestUploadedSizeHuman: 0,
      ingestProdId: '',
      files: [],
      ingestCreationDate: 0,
      ingestCreationDateHuman: '',
      ingestCreator: '',
      ingestStartDate: 0,
      ingestStartDateHuman: '',
      ingestUploadStatus: 'stopped',
      ingestUploadFinishedDate: 0,
      ingestUploadFinishedDateHuman: '',
      ingestVpmsReadyDate: 0,
      ingestVpmsReadyDateHuman: '',
      ingestGlobalWorkflows: {
        onGlobalUploadStarted: {},
        onGlobalUploadFinished: {},
        onGlobalStarted: {},
        onGlobalVpmsReady: {}
      },
      ingestGlobalPayload: {}
    },
    currentIngest: {},
    runningIngests: [],
    successIngests: [],
    errorIngests: [],
    running: [],
    success: [],
    error: []
  },
  socketConnection: {
    imConnected: false,
    peopleConnected: []
  },
  user: {
    rtbfLogin: '',
    firstName: '',
    lastName: ''
  },
  contacts: [
    {rtbfLogin: 'etco', firstName: 'Etienne', lastName: 'Convié'},
    {rtbfLogin: 'vgu', firstName: 'Vincent', lastName: 'Gustin'},
    {rtbfLogin: 'bbp', firstName: 'Benoit', lastName: 'Balon-Perin'}
  ]
}
