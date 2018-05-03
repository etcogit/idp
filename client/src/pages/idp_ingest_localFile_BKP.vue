<template>
  <q-page padding class="row justify-center">
    <!-- content -->
    <div style="width: 500px; max-width: 90vw;">
      <q-uploader
        color="secondary"
        multiple
        auto-expand
        hide-upload-button
        inverted
        stack-label="Fichiers à ingester"
        @add="added"
        :url="url"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      url: 'http://1.1.1.195/upload.php',
      added (files) {
        console.log(files)
        // this.$refs.uploader.upload()
      }
    }
  }
}
</script>

<style>
</style>
