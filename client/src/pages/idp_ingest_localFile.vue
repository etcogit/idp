<template>
<div class="example-full">
  <!-- etco: Le composant d'upload est copié de https://lian-yue.github.io/vue-upload-component -->

  <!-- etco: Cette div sert à "noircir" la page quand on Drag un fichier dans la page. Le texte ne s'affiche que quand on drag un fichier sur la page -->
  <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
    <h3>Dépose tes fichiers</h3>
  </div>

  <div class="upload">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Thumb</th>
            <th>Name</th>
            <th>Size</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in files" :key="file.id">
            <td>{{index}}</td>
            <td>
              <img v-if="file.thumb" :src="file.thumb" width="40" height="auto" />
              <span v-else>No Image</span>
            </td>
            <td>
              <div class="filename">
                {{file.name}}
              </div>
              <div class="progress" v-if="file.active || file.progress !== '0.00'">
                <div :class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active}" role="progressbar" :style="{width: file.progress + '%'}">{{file.progress}}%</div>
              </div>
            </td>
            <td>{{formatedFileSize(file.size)}}</td> <!-- etco -->

            <td v-if="file.error">{{file.error}}</td>
            <td v-else-if="file.success">success</td>
            <td v-else-if="file.active">active</td>
            <td v-else></td>
            <td>
              <a class="dropdown-item" href="#" @click.prevent="$refs.upload.remove(file)">Remove</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center p-5">
      <h4>Dépose des fichiers ou dossiers ici<br/>ou</h4>
      <!-- <label :for="name" class="btn btn-lg btn-primary">Selectionne des fichiers</label> -->
      <file-upload
        class="btn btn-primary dropdown-toggle"
        :extensions="extensions"
        :accept="accept"
        :multiple="multiple"
        :directory=false
        :drop="drop"
        :drop-directory="dropDirectory"
        :add-index="addIndex"
        v-model="files"
        @input-filter="inputFilter"
        @input-file="inputFile"
        ref="upload">
        <i class="fa fa-plus"></i>
        Ajoute des fichiers
      </file-upload>
      <file-upload
        class="btn btn-primary dropdown-toggle"
        :extensions="extensions"
        :accept="accept"
        :multiple="multiple"
        :directory=true
        :drop="drop"
        :drop-directory="dropDirectory"
        :add-index="addIndex"
        v-model="files"
        @input-filter="inputFilter"
        @input-file="inputFile"
        ref="upload">
        <i class="fa fa-plus"></i>
        Ajoute un dossier
      </file-upload>
    </div>
  </div>
</div>
</template>
<style>
.example-full .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
.example-full .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>

<script>
// import Cropper from 'cropperjs'
// import ImageCompressor from '@xkeshi/image-compressor'
import FileUpload from 'vue-upload-component'

import { format } from 'quasar' // etco: j'importe un "utils Quasar" dans la variable "format"
const { humanStorageSize } = format // etco: Je récupère la méthode "humanStorageSize" dans les "utils" de Quasar stockés dans "format" lors de l'import

export default {
  components: {
    FileUpload
  },
  data () {
    return {
      files: [],
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
      // extensions: /\.(gif|jpe?g|png|webp)$/i,
      multiple: true,
      // directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      name: 'file',
      uploadAuto: false
      /*
      minSize: 1024,
      size: 1024 * 1024 * 10,
      thread: 3,
      postAction: '/upload/post',
      putAction: '/upload/put',
      headers: {
        'X-Csrf-Token': 'xxxx'
      },
      data: {
        '_csrf_token': 'xxxxxx'
      },
      autoCompress: 1024 * 1024,
      isOption: false,
      addData: {
        show: false,
        name: '',
        type: '',
        content: ''
      },
      editFile: {
        show: false,
        name: ''
      }
      */
    }
  },
  methods: {
    // etco: Methode qui rend human readable un poids de fichier
    formatedFileSize (sizeToConvert) { // Je reçois le poids de mon fichier via une variable dans le template
      return humanStorageSize(sizeToConvert)
    },
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },
    // add, update, remove File Event
    inputFile (newFile, oldFile) {
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
        }
        if (newFile.error && !oldFile.error) {
          // error
        }
        if (newFile.success && !oldFile.success) {
          // success
        }
      }
      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }
      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    alert (message) {
      alert(message)
    }
  }
}
</script>
