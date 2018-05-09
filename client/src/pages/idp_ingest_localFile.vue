<template>
<div class="example-full">
  <!-- etco: Le composant d'upload est copié de https://lian-yue.github.io/vue-upload-component -->

  <!-- etco: Cette div sert à "noircir" la page quand on Drag un fichier dans la page. Le texte ne s'affiche que quand on drag un fichier sur la page -->
  <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
    <h3>Dépose tes fichiers</h3>
  </div>
  <div class="row justify-center">
      <div
        v-for="file in files"
        :key="file.id"
        class="etco-asset q-pa-none q-ma-xs shadow-2"
      >
      <!--
      <q-item
        v-for="file in files"
        :key="file.name + file.__timestamp"
        class="q-card q-pa-none q-ma-xs inline-block"
      >
        <q-progress v-if="!hideUploadProgress"
          class="q-uploader-progress-bg absolute-full"
          :color="file.__failed ? 'negative' : progressColor"
          :percentage="file.__progress"
          height="100%"
        ></q-progress>
        <div class="q-uploader-progress-text absolute" v-if="!hideUploadProgress">
          {{ file.__progress }}%
        </div>
      -->

        <img v-if="file.thumb" :src="file.thumb" style="min-width:auto; max-height: 114px; border-style:none" />
        <q-icon v-else name="insert_drive_file" color="#737373" size="114px" />

        <div class="q-pl-xs">
          <div>{{file.name}}</div>
          <div style="color:#757575; font-size:90%; margin-top:0.2rem;">{{formatedFileSize(file.size)}}</div>
          <div>Date de purge: {{file.idp.killDate}} <span class="text-faded text-negative"> ! Dans 10 jours !</span></div>
          <div>Production: {{file.idp.production}}</div>
          <div>IngestID: {{file.idp.ingestID}}</div>
          <div>ProdID: {{file.idp.prodID}}</div>
        </div>

        <q-btn round class="q-ma-xs" color="faded" slot="right" icon="clear" size="xs" @click.prevent="$refs.upload.remove(file)" />
        <!--
        <q-icon round class="q-ma-xs" color="negative" slot="right" name="clear" :size="xs" @click.prevent="$refs.upload.remove(file)" />
        <q-item-side right>
          <q-item-tile
            :icon="$q.icon.uploader[file.__doneUploading ? 'done' : 'clear']"
            :color="color"
            class="cursor-pointer"
            @click.native="__remove(file)"
          ></q-item-tile>
        </q-item-side>
        -->
      </div>

      <q-table
        :data="files"
        :columns="columns"
        selection="multiple"
        :selected.sync="selected"
        row-key="name"
        v-if="files.length > 0"
      >
        <q-tr slot="header" slot-scope="props">
          <q-th auto-width>
            <!--
            <q-checkbox
              v-if="props.multipleSelect"
              v-model="props.selected"
              indeterminate-value="some"
            />
            -->
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>

        <template slot="body" slot-scope="props">
          <q-tr :props="props" @click.native="props.expand = !props.expand" class="cursor-pointer">
            <q-td>
              <!-- <q-checkbox color="primary" v-model="props.selected" /> -->
              <q-checkbox color="primary" v-model="props.expand" checked-icon="remove" unchecked-icon="add" class="q-ma-none" />
              <q-btn color="negative" flat round delete icon="delete" @click.prevent="$refs.upload.remove(props.row)" />
            </q-td>

            <q-td key="thumb" :props="props">
              <img v-if="props.row.thumb" :src="props.row.thumb" style="min-width:auto; max-height: 2em; border-style:none" />
              <q-icon v-else name="insert_drive_file" color="#737373" size="2em" />
              {{ props.row.icon }}
            </q-td>

            <q-td auto-width key="name" :props="props">
              {{ props.row.name }}
              <q-progress :percentage="props.row.idp.uploadPercentage" :color="props.row.success ? 'positive' : 'secondary'" stripe />
            </q-td>
            <q-td key="fileSize" :props="props">{{ props.row.idp.fileSize }}</q-td>
            <q-td key="killDate" :props="props">{{ props.row.idp.killDate }}</q-td>
            <q-td key="ingestID" :props="props">{{ props.row.idp.ingestID }}</q-td>
            <q-td key="production" :props="props">{{ props.row.idp.production }}</q-td>
            <q-td key="prodID" :props="props">{{ props.row.idp.prodID }}</q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!--
      <q-item
        v-for="file in files"
        :key="file.name + file.__timestamp"
        class="q-uploader-file q-pa-none q-ma-xs"
      >
        <q-progress v-if="!hideUploadProgress"
          class="q-uploader-progress-bg absolute-full"
          :color="file.__failed ? 'negative' : progressColor"
          :percentage="file.__progress"
          height="100%"
        ></q-progress>
        <div class="q-uploader-progress-text absolute" v-if="!hideUploadProgress">
          {{ file.__progress }}%
        </div>

        <q-item-side v-if="file.thumb" :image="file.thumb"></q-item-side>
        <q-item-side v-else :icon="$q.icon.uploader.file" :color="color"></q-item-side>

        <q-item-main :label="file.name" :sublabel="formatedFileSize(file.size)"></q-item-main>

        <q-item-side right>
          <q-item-tile
            :icon="$q.icon.uploader[file.__doneUploading ? 'done' : 'clear']"
            :color="color"
            class="cursor-pointer"
            @click.native="__remove(file)"
          ></q-item-tile>
        </q-item-side>
      </q-item>
      -->
  </div>
  <!--
  <div class="row justify-center">
    <q-list :dark="dark" class="q-uploader-files q-py-none scroll" :style="filesStyle">
      <q-item
        v-for="file in files"
        :key="file.name + file.__timestamp"
        class="q-card q-pa-none q-ma-xs inline-block"
      >
        <q-progress v-if="!hideUploadProgress"
          class="q-uploader-progress-bg absolute-full"
          :color="file.__failed ? 'negative' : progressColor"
          :percentage="file.__progress"
          height="100%"
        ></q-progress>
        <div class="q-uploader-progress-text absolute" v-if="!hideUploadProgress">
          {{ file.__progress }}%
        </div>

        <q-item-side v-if="file.thumb" :image="file.thumb"></q-item-side>
        <q-item-side v-else :icon="$q.icon.uploader.file" :color="color"></q-item-side>

        <q-item-main :label="file.name" :sublabel="formatedFileSize(file.size)"></q-item-main>

        <q-item-side right>
          <q-item-tile
            :icon="$q.icon.uploader[file.__doneUploading ? 'done' : 'clear']"
            :color="color"
            class="cursor-pointer"
            @click.native="__remove(file)"
          ></q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>
  </div>

  <div class="row justify-center">
    <q-card v-for="(file, index) in files" :key="file.id" class="q-ma-sm inline-block assetCard">
      <q-card-media v-if="file.thumb">
        <img :src="file.thumb" height="150" width="auto" />
      </q-card-media>
      <q-card-title>
        <q-btn round color="negative" slot="right" icon="delete" @click.prevent="$refs.upload.remove(file)" />
        {{index}} {{file.name}}
        <span slot="subtitle">{{formatedFileSize(file.size)}}</span>
      </q-card-title>
      <q-card-main>
        <p>Date de purge: {{killDateInTenDays}} <span class="text-faded text-negative"> ! Dans 10 jours !</span></p>
        <p>Conteneur: {{IDgenerator}}</p>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat round dense icon="event" />
        <q-btn flat label="5:30PM" />
        <q-btn flat label="7:30PM" />
        <q-btn flat label="9:00PM" />
        <q-btn flat color="primary" label="Reserve" />
      </q-card-actions>
    </q-card>
  </div>
  -->

    <!--
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
            <td>{{formatedFileSize(file.size)}}</td>

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
    -->
  <div class="text-center p-5">
    <h4 v-if="!$q.platform.has.touch">Dépose des fichiers ou dossiers ici<br/>ou</h4>
    <file-upload
      class="btn btn-primary dropdown-toggle"
      :extensions="extensions"
      :accept="accept"
      :multiple="multiple"
      :directory=false
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
      v-if="!$q.platform.has.touch"
      @input-filter="inputFilter"
      @input-file="inputFile"
      ref="upload">
      <i class="fa fa-plus"></i>
      Ajoute un dossier
    </file-upload>
  </div>
  <vue-json-pretty
    :path="'res'"
    :data="files"
    @click="handleClick">
  </vue-json-pretty>
</div>
</template>
<style>
.etco-asset {
  display: flex;
  /* box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12); */
}
.q-item-image {
  min-width: auto;
  max-width: 114px;
  min-height: auto;
  max-height: 114px;
}
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
.assetCard {
  max-width: 350px;
}
</style>

<script>
// import Cropper from 'cropperjs'
// import ImageCompressor from '@xkeshi/image-compressor'
import FileUpload from 'vue-upload-component'
import VueJsonPretty from 'vue-json-pretty'

import { format, date } from 'quasar' // etco: j'importe un "utils Quasar" dans la variable "format"
const { humanStorageSize } = format // etco: Je récupère la méthode "humanStorageSize" dans les "utils" de Quasar stockés dans "format" lors de l'import
const { addToDate, formatDate } = date

export default {
  components: {
    FileUpload,
    VueJsonPretty
  },
  computed: {
    killDateInTenDays () {
      let myDate = addToDate(new Date(), { days: 10 })
      myDate = formatDate(myDate, 'D MMMM YYYY', {
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      })
      return myDate
    },
    IDgenerator () {
      return 'ING' + formatDate(new Date(), 'YYYYDDMMHHmmss')
    }
  },
  data () {
    return {
      /* UPLOAD */
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
      uploadAuto: false,
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

      /* Datatable */
      columns: [
        {
          name: 'thumb',
          required: true,
          label: 'Icone',
          align: 'left',
          field: 'thumb',
          sortable: false
        },
        {
          name: 'name',
          required: true,
          label: 'Nom du fichier',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'fileSize',
          required: true,
          label: 'Poids du fichier',
          align: 'left',
          field: 'idp.fileSize',
          sortable: true
        },
        {
          name: 'killDate',
          required: true,
          label: 'Date de purge',
          align: 'left',
          field: 'idp.killDate',
          sortable: true
        },
        {
          name: 'ingestID',
          required: true,
          label: 'IngestID',
          align: 'left',
          field: 'ingestID',
          sortable: true
        },
        {
          name: 'production',
          required: true,
          label: 'Production',
          align: 'left',
          field: 'production',
          sortable: true
        },
        {
          name: 'prodID',
          required: true,
          label: 'ProdID',
          align: 'left',
          field: 'prodID',
          sortable: true
        }
      ]
    }
  },
  methods: {
    // etco: Methode qui rend human readable un poids de fichier
    formatedFileSize (sizeToConvert) { // Je reçois le poids de mon fichier via une variable dans le template
      return humanStorageSize(sizeToConvert)
    },
    simulateProgress (file) {
      setTimeout(() => {
        if (!file.success) {
          if (file.idp.uploadSize <= file.size) {
            file.idp.uploadSize = file.idp.uploadSize + 300000
            file.idp.uploadPercentage = Math.round(file.idp.uploadSize / file.size * 100)
            console.log(file.idp.uploadPercentage)
            this.simulateProgress(file)
          } else {
            file.success = true
            file.idp.uploadPercentage = 100
          }
        }
      }, 200)
    },
    inputFilter (newFile, oldFile, prevent) {
      console.log('etco-inputFilter')
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
        // etco: add some properties to each file
        newFile.idp = {
          fileSize: this.formatedFileSize(newFile.size),
          production: 'production',
          prodID: 'prodID',
          ingestID: this.IDgenerator,
          killDate: this.killDateInTenDays,
          uploadSize: 0,
          uploadPercentage: 0
        }
        this.simulateProgress(newFile)
      }
    },
    // add, update, remove File Event
    inputFile (newFile, oldFile) {
      console.log('etco-inputFile')
      if (newFile && oldFile) {
        // update
        console.log('etco-update')
        if (newFile.active && !oldFile.active) {
          console.log('etco-update-2')
          // beforeSend
          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
          console.log('etco-progress')
        }
        if (newFile.error && !oldFile.error) {
          // error
          console.log('etco-error')
        }
        if (newFile.success && !oldFile.success) {
          // success
          console.log('etco-success')
        }
      }
      if (!newFile && oldFile) {
        // remove
        console.log('etco-remove')
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
