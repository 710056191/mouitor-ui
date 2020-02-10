<template>
  <div>
    <el-form
      :ref="formName"
      v-loading="loader.fetch"
      :model="temp"
      :rules="rules"
      :disabled="loader.fetch"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="申请人" prop="applier">
            <el-input v-model="temp.applier" placeholder="申请人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker
              v-model="temp.applyDate"
              type="date"
              placeholder="请选择日期"
              class="el-select-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审批人" prop="approver">
            <el-input v-model="temp.approver" placeholder="审批人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="减免金额（元）" prop="discount">
            <el-input v-model="temp.discount" placeholder="减免金额" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="减免原因" prop="reason">
            <el-input v-model="temp.reason" placeholder="减免原因" type="textarea" />
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
import appealElectApi from '@/api/report'

export default {
  name: 'ElectricReportEdit',

  components: {

  },

  mixins: [FormEdit],

  data() {
    return {
      id: undefined,

      temp: {
        alarmAnalyzeId: '',
        applier: '',
        applyDate: '',
        approver: '',
        discount: '',
        reason: '',
      },

      rules: {
        applier: [
          {
            required: true,
            message: '请输入申请人',
            trigger: 'change',
          },
        ],
        applyDate: [
          {
            required: true,
            message: '请选择申请日期',
            trigger: 'change',
          },
        ],
        approver: [
          {
            required: true,
            message: '请输入审批人',
            trigger: 'change',
          }],
        discount: [
          {
            required: true,
            message: '请输入减免金额',
            trigger: 'change',
          },
          {
            message: '请输入正确的金额',
            trigger: 'change',
            pattern: /^([1-9]\d*(\.\d+)?|0)$/,
          },
        ],
        reason: [
          {
            required: true,
            message: '请输入见面原因',
            trigger: 'change',
          },
        ],
      },
    }
  },
  mounted() {

  },
  methods: {
    fetch(params) {
      return appealElectApi.findElectById({ id: params.id }).then(ret => {
        return {
          ...ret.data,
        }
      })
    },
    updateFormValue(formData) {
      this.temp = formData
    },
    getFormValue() {
      this.temp.applier = this.temp.applier
      this.temp.approver = this.temp.approver
      this.temp.discount = this.temp.discount
      this.temp.reason = this.temp.reason
      this.temp.applyDate = parseTime(this.temp.applyDate, '{y}-{m}-{d}')
      return this.temp
    },
    update(data, isNew) {
      // const updateApi = isNew ? appealElectApi.appealElect : appealElectApi.appealElect
      return appealElectApi
        .appealElect(data).then(ret => {
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
