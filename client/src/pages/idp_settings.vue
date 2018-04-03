<template>
  <q-page>
    <!-- content -->
    <q-tabs align="center">
      <q-route-tab
        default
        slot="title"
        icon=""
        to="/idp/settings/gui"
        label="Interface"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/settings/notifications"
        label="Notifications"
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
