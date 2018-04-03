<template>
  <q-page>
    <!-- content -->
    <q-tabs align="center">
      <q-route-tab
        default
        slot="title"
        icon=""
        to="/idp/help/faq"
        label="FAQ"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/help/procedures"
        label="Procédures"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/help/workflows"
        label="Workflows"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/help/contact"
        label="Demander de l'aide"
      />
    </q-tabs>
    <!-- This is where pages get injected -->
    <router-view />
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
}
</script>

<style>
</style>
