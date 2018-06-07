<template>
  <q-page padding>
    <!-- content -->
    idpIngestRec
    <div>{{ myComputedData }}</div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  computed: {
    myComputedData () {
      return this.$store.state.ingests.myIngests
    }
  }
}
</script>

<style>
</style>
