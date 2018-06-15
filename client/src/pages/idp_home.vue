<template>
  <q-page padding>
    <!-- content -->
    Ceci est ma page d'accueil

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
