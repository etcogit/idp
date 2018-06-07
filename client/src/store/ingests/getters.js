/*
export const someGetter = (state) => {}
 */
export const totoGetter = (state) => {
  // console.log('totoGetter est bien appelé')
  return state.ingests.emptyPattern.ingestUploadStatus
  // return state.myIngests
}
export const isCurrentIngestObjectEmpty = (state) => {
  // console.log('isCurrentIngestObjectEmpty est bien appelé = ' + Object.keys(state.ingests.currentIngest).length)
  if (Object.keys(state.ingests.currentIngest).length === 0) {
    return true
  } else {
    return false
  }
}
