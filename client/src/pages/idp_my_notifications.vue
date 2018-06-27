<template>
  <q-page padding>
    <!-- content -->
    idpMyNotifications
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  mounted () {
    this.saveLogAction({})
  },
  methods: {
    ...mapActions(
      'globalModule',
      [
        'saveLogAction'
      ]
    )
  }
}
</script>

<style>
</style>
