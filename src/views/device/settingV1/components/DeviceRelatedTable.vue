<!--
设备关联表
-->
<template>
  <div class="device-related-table">

    <p class="tip-area" style="color:#0e1587">
      <span>下载</span>
      <el-link style="color:#0e1587" @click="handleDownload">《关联设备表模板》</el-link>
    </p>

    <div class="upload-area">
      <el-upload
        :headers="{token: f.getToken()}"
        :action="uploadProps.action"
        :file-list="uploadProps.fileList"
        :on-success="uploadOnSuccess"
        :on-error="uploadOnError"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>

    <el-row v-if="false" :gutter="20">

      <el-col :span="12">
        <div class="mess" @click="handleDownload">
          <svg-icon
            icon-class="download"
            alt="下载"
          />
          <div class="mess-name">
            <p>点击下载</p>
            <p>关联设备表模板</p>
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="mess">
          <svg-icon
            icon-class="upload"
            alt="上传"
          />
          <div class="mess-name">
            <p>点击上传</p>
            <p>关联设备表</p>
          </div>
          <uploadComponent
            :show-list="false"
            url="/cameraExcel/upload.do"
          />
        </div>
      </el-col>

    </el-row>
    <el-row>
      <el-link @click="uploadError">查看导入日志</el-link>
    </el-row>
  </div>
</template>

<script>
import UploadComponent from '@/components/UploadComponents'
import { getToken } from '@/utils/auth'
import deviceApi from '@/api/device'
import {
  fetchTemplate, getuploadError,
} from '@/api/device'
import { APP_BASE_API } from '@/utils/project-env'

export default {
  name: 'DeviceRelatedTable',

  components: {
    UploadComponent,
  },

  data() {
    return {
      f: {
        getToken,
      },

      uploadProps: {
        action: '',
        fileList: [],
      },
    }
  },

  created() {
    this.uploadProps.action = APP_BASE_API + '/cameraExcel/upload.do'
  },

  methods: {
    handleDownload() {
      fetchTemplate()
    },

    uploadOnSuccess(response, file, fileList) {
      if (!response.success) {
        this.$message({
          message: response.message,
          type: 'error',
        })
        console.log(response, file)
        this.removeFileFromList(file)
        return
      }

      this.addFileToList(file)
      this.$message({
        message: response.message,
        type: 'success',
      })
    },

    uploadOnError(err, file, fileList) {
      if (err) {
        console.log(err, file)
      }
    },

    addFileToList(file) {
      file && this.uploadProps.fileList.push(file)
    },

    /**
     * 移除文件
     * @param file - <el-upload /> 的 file, {uid, name, url,}
     */
    removeFileFromList(file) {
      if (!file) {
        return
      }

      const list = this.uploadProps.fileList

      const idx = list.findIndex(item => {
        return item.uid === file.uid
      })
      if (idx === -1) {
        return
      }

      list.splice(idx, 1)
      this.uploadProps.fileList = list
    },

    // 上传下载设备模板日志
    uploadError() {
      getuploadError()
    },
  },

}

</script>

<style lang="scss">
.device-related-table {
  // margin-bottom: 20px;
  .upload-area {
    // margin: auto 0px;
    text-align: center
  }

  .tip-area {
    margin: 0 0 15px 25px;

    span {
      vertical-align: middle;
    }
  }

  .mess {
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    margin: 0 auto;
    cursor: pointer;

    .svg-icon {
      font-size: 50px;
      height: auto;
      position: absolute;
      top: -15px;
    }

    .mess-name {
      position: absolute;
      bottom: 30px;
      text-align: center;

      p {
        margin: 0;
      }
    }

    .upload-component-area {
      opacity: 0;
      .el-button {
        width: 150px;
        height: 150px;
        padding: 0;
      }
    }
  }
  > .el-row:nth-last-child(1){
      text-align: right;
      .el-link{
        font-size: 14px;
        margin:15px 25px 0 0;
      }
  }
}
</style>
