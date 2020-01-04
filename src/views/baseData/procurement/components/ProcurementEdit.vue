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
          <el-form-item label="合同编号" prop="contractCode">
            <el-input v-model="temp.contractCode" placeholder="合同编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购供应商" prop="manufacturerCode">
            <el-select
              v-model="temp.manufacturerCode"
              filterable
              clearable
              placeholder="请选择采购供应商"
              class="el-select-full"
            >
              <el-option
                v-for="item in manufacturers"
                :key="item.manufacturerCode"
                :label="item.manufacturerName"
                :value="item.manufacturerCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检索内容" prop="retrievalContent">
            <el-input v-model="temp.retrievalContent" placeholder="检索内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同日期" prop="contractDate">
            <el-date-picker
              v-model="temp.contractDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="el-select-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验收日期" prop="checkDate">
            <el-date-picker
              v-model="temp.checkDate"
              type="date"
              placeholder="请选择日期"
              class="el-select-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运维时间" prop="maintenanceTime">
            <el-date-picker
              v-model="temp.maintenanceTime"
              type="datetime"
              placeholder="请选择日期"
              class="el-select-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设计(供应商)" prop="design">
            <el-select
              v-model="temp.design"
              filterable
              clearable
              placeholder="请选择设计(供应商)"
              class="el-select-full"
            >
              <el-option
                v-for="item in manufacturers"
                :key="item.manufacturerCode"
                :label="item.manufacturerName"
                :value="item.manufacturerCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监理(供应商)" prop="supervisor">
            <el-select
              v-model="temp.supervisor"
              filterable
              clearable
              placeholder="请选择监理(供应商)"
              class="el-select-full"
            >
              <el-option
                v-for="item in manufacturers"
                :key="item.manufacturerCode"

                :label="item.manufacturerName"
                :value="item.manufacturerCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="招标文件" prop="bidinvitingFile_temp">
            <uploadComponent
              v-model="temp.bidinvitingFile_temp"
              :url="url"
              :is-preview-image="false"
              param="bidinvitingFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="投标文件" prop="bidFile_temp">
            <uploadComponent
              v-model="temp.bidFile_temp"
              :url="url"
              :is-preview-image="false"
              param="bidFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="合同文件" prop="contractFile_temp">
            <uploadComponent
              v-model="temp.contractFile_temp"
              :url="url"
              :is-preview-image="false"
              param="contractFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="投标文件" prop="checkFile_temp">
            <uploadComponent
              v-model="temp.checkFile_temp"
              :url="url"
              :is-preview-image="false"
              param="checkFile"
            />
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
import { parseTime } from '@/utils'
import manufacturerApi from '@/api/manufacturer'
import procurementApi from '@/api/procurement'
import uploadComponent from '@/components/UploadComponents/index'
export default {
  name: 'ProcurementEdit',
  components: {
    uploadComponent,
  },
  mixins: [FormEdit],
  data() {
    return {
      id: undefined,
      temp: {
        id: '',
        contractCode: '',
        manufacturerCode: '',
        retrievalContent: '',
        contractDate: [],
        checkDate: '',
        design: '',
        supervisor: '',
        maintenanceTime: '',
        bidinvitingFile_temp: [],
        checkFile_temp: [],
        contractFile_temp: [],
        bidFile_temp: [],
      },
      url: '/procurement/proUpload.do',
      rules: {
        contractCode: [{ required: true, message: '合同编号', trigger: 'change' }],
        manufacturerCode: [{ required: true, message: '采购商', trigger: 'change' }],
      },
      manufacturers: [],
    }
  },
  mounted() {
    manufacturerApi.findManufacturer().then(ret => {
      this.manufacturers = ret.data
    })
  },
  methods: {
    fetch(params) {
      return procurementApi.findProcurementById(params.id).then(ret => {
        const { id, contractCode, manufacturerCode, retrievalContent, contractDateStart, contractDateEnd, checkDate,
          design, supervisor, maintenanceTime, bidinvitingFileUrls, checkFileUrls, contractFileUrls, bidFileUrls } = ret.data
        return {
          id: id,
          contractCode: contractCode,
          manufacturerCode: manufacturerCode,
          retrievalContent: retrievalContent,
          contractDate: [contractDateStart, contractDateEnd],
          checkDate: checkDate,
          design: design,
          supervisor: supervisor,
          maintenanceTime: maintenanceTime,
          bidinvitingFile_temp: bidinvitingFileUrls,
          checkFile_temp: checkFileUrls,
          contractFile_temp: contractFileUrls,
          bidFile_temp: bidFileUrls,
        }
      })
    },
    updateFormValue(formData) {
      this.temp = formData
    },
    getFormValue() {
      this.temp.bidinvitingFileUrl = ''
      this.temp.bidinvitingNames = ''
      if (this.temp.bidinvitingFile_temp) {
        this.temp.bidinvitingFileUrl = this.temp.bidinvitingFile_temp.map(item => { return item.url }).join(',')
        this.temp.bidinvitingNames = this.temp.bidinvitingFile_temp.map(item => { return item.name }).join(',')
      }
      this.temp.bidFileUrl = ''
      this.temp.bidNames = ''
      if (this.temp.bidFile_temp) {
        this.temp.bidFileUrl = this.temp.bidFile_temp.map(item => { return item.url }).join(',')
        this.temp.bidNames = this.temp.bidFile_temp.map(item => { return item.name }).join(',')
      }
      this.temp.contractNames = ''
      this.temp.contractFileUrl = ''
      if (this.temp.contractFile_temp) {
        this.temp.contractFileUrl = this.temp.contractFile_temp.map(item => { return item.url }).join(',')
        this.temp.contractNames = this.temp.contractFile_temp.map(item => { return item.name }).join(',')
      }
      this.temp.checkFileUrl = ''
      this.temp.checkNames = ''
      if (this.temp.checkFile_temp) {
        this.temp.checkFileUrl = this.temp.checkFile_temp.map(item => { return item.url }).join(',')
        this.temp.checkNames = this.temp.checkFile_temp.map(item => { return item.name }).join(',')
      }
      this.temp.contractDateStart = parseTime(this.temp.contractDate[0], '{y}-{m}-{d}')
      this.temp.contractDateEnd = parseTime(this.temp.contractDate[1], '{y}-{m}-{d}')
      this.temp.checkDate = parseTime(this.temp.checkDate, '{y}-{m}-{d}')
      this.temp.maintenanceTime = parseTime(this.temp.maintenanceTime, '{y}-{m}-{d} {h}:{i}:{s}')
      return this.temp
    },
    update(data, isNew) {
      const updateApi = isNew ? procurementApi.addProcurement : procurementApi.updateProcurement
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
