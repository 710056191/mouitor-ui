<template>
  <div class="upload-component-area">
    <el-upload
      ref="upload"
      :action="url_temp"
      :headers="{token:getToken()}"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      multiple
      :name="param"
      :limit="limit"
      :show-file-list="showList"
      :file-list="fileList"
      :list-type="type"
      :before-upload="beforeUpload"
    >
      <el-button slot="trigger" :size="size" type="primary" :class="childclass">{{ buttonText }}</el-button>
      <div v-if="tips" slot="tip" class="el-upload__tip">{{ tips }}</div>
    </el-upload>

    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      :width="width"
    >
      <div class="upload-component-img-preview-box">
        <el-image
          :src="imageUrl"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { APP_FTP_API, APP_BASE_API } from '@/utils/project-env'
import { isImageFilePath, isSupportFile } from '@/utils/validate'

export default {
  name: 'UploadComponent',
  props: {
    url: { type: String, default: undefined },
    param: { type: String, default: 'file' },
    limit: { type: Number, default: undefined },
    tips: { type: String, default: undefined },
    type: { type: String, default: 'text' },
    value: { type: Array, default: undefined },
    showList: { type: Boolean, default: true },
    size: { type: String, default: undefined },
    buttonText: { type: String, default: '选取文件' },
    childclass: { type: String, default: undefined },
    isPreviewImage: {
      type: Boolean,
      default: true,
    },

    // 允许上传的 文件拓展名，为 null 时不限制
    // eg: ['.jpeg', '.png']
    supportFileExtNames: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      formData: '',
      imageUrl: '',
      fileNames: [],
      dialogVisible: false,
      width: '60%',
      imgWidth: '',
      url_temp: '',
    }
  },
  computed: {
    fileList() {
      if (this.value) {
        // console.log('[UploadComponent] fileList computed', this.value)
        return this.value.map((item) => {
          if (item && !item.url) {
            item.url = item.filePath
          }
          return item
        })
      } else {
        return []
      }
    },
  },
  created() {
    this.url_temp = APP_BASE_API + this.url
  },
  beforeDestroy() {
    this.$refs.upload.clearFiles()
  },
  methods: {
    getToken,

    handlePreview(file) {
      const fileName = file.name
      const fileUrl = file.url

      // 是图片，并且允许预览图片
      if (this.isPreviewImage) {
        if (isImageFilePath(fileName)) {
          this.imageUrl = fileUrl
          this.dialogVisible = true
          return
        }
      }

      this.openFileWithUrl(fileUrl)
    },

    openFileWithUrl(url) {
      url && window.open(url)
    },

    handleRemove(file, fileList) {
      const value = this.value
      if (!value || !value.length) {
        return
      }
      let indexTemp
      this.value.forEach((item, index, arr) => {
        if (file.uid === item.uid) {
          indexTemp = index
        }
      })
      const list = this.value.slice()
      list.splice(indexTemp, 1)
      this.$emit('input', list)
    },

    handleSuccess(response, file, fileList) {
      if (response.success) {
        const item = Object.assign({}, file)
        item.filePath = response.data[this.param]
        item.url = APP_FTP_API + response.data[this.param]
        let list = []
        if (this.value) {
          list = this.value.slice()
        }
        list.push(item)
        this.$emit('input', list)
        this.$emit('success', list)
        this.$message({
          message: response.message,
          type: 'success',
        })
      } else {
        this.$message({
          message: response.message,
          type: 'error',
        })
      }
    },

    beforeUpload(file) {
      const supportFileExtNames = this.supportFileExtNames

      let isSupport = true

      if (Array.isArray(supportFileExtNames)) {
        isSupport = isSupportFile(file.name, supportFileExtNames)
      }

      if (!isSupport) {
        const postfixStr = supportFileExtNames.join(',')
        this.$message.error(`上传文件格式只支持 ${postfixStr}`)
      }

      return isSupport
    },
  },
}
</script>

<style>
.upload-component-area {
  display: inline-block;
}

.upload-component-area + .upload-component-area {
  margin-left: 10px;
}

.upload-component-area + .el-button {
  margin-left: 10px;
}
.leftupload{
  background: #fff;
  margin-left: 0px;
  border: none;
  color: #454ead;
  padding: 0;
}
.leftupload:hover {
    color: #454ead;
    background: #fff;
}

.upload-component-img-preview-box {
  text-align: center;
}
</style>
