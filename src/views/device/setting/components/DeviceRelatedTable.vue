<!--
设备关联表
-->
<template>
  <div class="device-related-table">

    <p class="tip-area">
      <span>下载</span>
      <el-link @click="handleDownload">《关联设备表模板》</el-link>
    </p>

    <div class="upload-area">
      <el-upload
        :headers="{token: getToken()}"
        :action="uploadProps.action"
        :before-upload="beforeUpload"
        :on-success="uploadOnSuccess"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

import {
  fetchTemplate,
} from '@/api/device'
import { APP_BASE_API } from '@/utils/project-env'
import { isSupportFile } from '@/utils/validate'

const excelFileExtNames = ['.xls', '.xlsx']

export default {
  name: 'DeviceRelatedTable',

  components: {},

  data() {
    return {
      uploadProps: {
        action: '',
      },
    }
  },

  created() {
    this.uploadProps.action = APP_BASE_API + '/cameraExcel/upload.do'
  },

  methods: {
    getToken() {
      return getToken()
    },

    handleDownload() {
      fetchTemplate()
    },

    beforeUpload(file) {
      const isSupport = isSupportFile(file.name, excelFileExtNames)
      if (!isSupport) {
        console.log('beforeUpload nonsupport file:', file)
        this.$message.error('文件格式不正确，请下载模板进行填写')
      }

      return isSupport
    },

    uploadOnSuccess(response, file, fileList) {
      if (!response.success) {
        this.$message({
          message: response.message,
          type: 'error',
        })
        console.log('uploadOnSuccess', response, file)
        this.removeFileFromList(file, fileList)
        return
      }

      this.$message({
        message: response.message || '完成',
        type: 'success',
      })
    },

    uploadOnChange(file, fileList) {
      console.log('uploadOnChange', file)
    },

    /**
     * 移除文件
     * @param file - <el-upload /> 的 file, {uid, name, url,}
     * @param fileList - 文件列表，会直接修改这个数组！
     *                    现在一般将 el-upload 组件钩子传递的 fileList 直接传递进来，注意不要乱操作
     */
    removeFileFromList(file, fileList) {
      if (!file) {
        return
      }

      const list = fileList

      const idx = list.findIndex(item => {
        return item.uid === file.uid
      })
      if (idx === -1) {
        return
      }

      list.splice(idx, 1)
    },
  },

}

</script>

<style lang="scss">
.device-related-table {
  margin-bottom: 20px;

  .upload-area {
    min-height: 300px;

    .el-upload--text {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .tip-area {
    margin: 0 0 20px;

    span {
      vertical-align: middle;
    }
  }
}
</style>
