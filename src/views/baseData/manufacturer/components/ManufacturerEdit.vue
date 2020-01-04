<template>
  <div>
    <el-form
      :ref="formName"
      v-loading="loader.fetch"
      :model="temp"
      :rules="rules"
      :disabled="loader.fetch"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商名称" prop="manufacturerName">
            <el-input v-model="temp.manufacturerName" placeholder="供应商名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编号" prop="manufacturerCode">
            <el-input v-model="temp.manufacturerCode" placeholder="供应商编号" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="供应商描述" prop="manufacturerDesc">
            <el-input v-model="temp.manufacturerDesc" placeholder="供应商描述" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="法人" prop="legalPerson">
            <el-input v-model="temp.legalPerson" placeholder="法人" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input v-model="temp.address" placeholder="地址" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="temp.qq" placeholder="QQ" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信" prop="wechat">
            <el-input v-model="temp.wechat" placeholder="微信" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="承包业务" prop="name">
            <el-checkbox-group v-model="temp.manufacturerTypes_temp">
              <el-checkbox label="1">总包</el-checkbox>
              <el-checkbox label="2">电力</el-checkbox>
              <el-checkbox label="3">网络</el-checkbox>
              <el-checkbox label="4">设备</el-checkbox>
              <el-checkbox label="5">设计</el-checkbox>
              <el-checkbox label="6">监理</el-checkbox>
              <el-checkbox label="7">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="执照图片" prop="operationFiles_temp">
            <uploadComponent
              v-model="temp.operationFiles_temp"
              type="picture-card"
              :url="url"
              :support-file-ext-names="imageFileExtNames"
              button-text="选取照片"
              param="imgFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="证书附件" prop="otherFiles_temp">
            <uploadComponent v-model="temp.otherFiles_temp" :url="url" param="certificateFile" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div class="text-align-right">
          <el-button
            :disabled="!canBeClosed"
            @click="emitCancel"
          >取消
          </el-button>
          <el-button
            type="primary"
            :loading="loader.update"
            @click="submitForm"
          >确定
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import FormEdit from '@/mixins/form-suites/form-edit'
import manufacturerApi from '@/api/manufacturer'
import uploadComponent from '@/components/UploadComponents/index'
import {
  DefaultImageFileExtNames,
} from '@/utils/validate'

export default {
  name: 'ManufacturerEdit',
  components: {
    uploadComponent,
  },

  mixins: [FormEdit],

  data() {
    return {

      temp: {
        manufacturerId: undefined,
        manufacturerName: undefined,
        manufacturerCode: undefined,
        manufacturerDesc: undefined,
        qq: undefined,
        wechat: undefined,
        address: undefined,
        legalPerson: undefined,
        manufacturerTypes_temp: [],
        operationFiles_temp: undefined,
        otherFiles_temp: undefined,
      },
      url: '/manufacturer/manuUpload.do',
      rules: {
        manufacturerName: [{ required: true, message: '供应商名称', trigger: 'change' }],
        manufacturerCode: [{ required: true, message: '供应商编号', trigger: 'change' }],
      },

      imageFileExtNames: DefaultImageFileExtNames,
    }
  },

  methods: {
    fetch(params) {
      return manufacturerApi.findManufacturerById(params.id).then(ret => {
        const { manufacturerId, manufacturerName, manufacturerCode, manufacturerDesc, qq, wechat, address, legalPerson, manufacturerTypes, operationFiles, otherFiles } = ret.data
        const manufacturerTypes_temp = manufacturerTypes.split(',')
        return {
          manufacturerId: manufacturerId,
          manufacturerName: manufacturerName,
          manufacturerCode: manufacturerCode,
          manufacturerDesc: manufacturerDesc,
          qq: qq,
          wechat: wechat,
          address: address,
          legalPerson: legalPerson,
          manufacturerTypes_temp: manufacturerTypes_temp,
          operationFiles_temp: operationFiles,
          otherFiles_temp: otherFiles,
        }
      })
    },

    updateFormValue(formData) {
      this.temp = formData
    },

    getFormValue() {
      this.temp.operationCertificate = ''
      this.temp.imgNames = ''
      this.temp.imgName = ''
      if (this.temp.operationFiles_temp) {
        this.temp.imgNames = this.temp.operationFiles_temp.map(item => { return item.name }).join(',')
        this.temp.imgName = this.temp.imgNames
        this.temp.operationCertificate = this.temp.operationFiles_temp.map(item => { return item.url }).join(',')
      }

      this.temp.fileNames = ''
      this.temp.fileName = ''
      this.temp.certificateFiles = ''
      this.temp.otherCertificate = ''
      if (this.temp.otherFiles_temp) {
        this.temp.otherCertificate = this.temp.otherFiles_temp.map(item => { return item.url }).join(',')
        this.temp.certificateFiles = this.temp.otherCertificate
        this.temp.fileNames = this.temp.otherFiles_temp.map(item => { return item.name }).join(',')
        this.temp.fileName = this.temp.fileNames
      }

      if (this.temp.manufacturerTypes_temp) {
        this.temp.manufacturerTypes = this.temp.manufacturerTypes_temp.join(',')
      }
      return this.temp
    },

    update(data, isNew) {
      const updateApi = isNew ? manufacturerApi.addManufacturer : manufacturerApi.updateManufacturer

      return updateApi(data).then(ret => {
        this.$message({
          message: ret.message,
          type: 'success',
        })
      })
    },
  },
}

</script>

<style lang="scss">

</style>
