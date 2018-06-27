<template>
  <q-page padding>
    <!-- content -->
    idpSettingsGui
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
