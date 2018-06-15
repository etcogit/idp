<template>
  <q-page padding>
    <!-- content -->
    idpMonitoringJobs
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted () {
    this.saveUserLog({})
  },
  methods: {
    ...mapActions(
      'userModule',
      [
        'saveUserLog'
      ]
    )
  }
}
</script>

<style>
</style>
