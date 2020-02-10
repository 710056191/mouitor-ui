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
          <el-form-item label="维修人员名称" prop="name">
            <el-input v-model="temp.name" placeholder="维修人员名称" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="消息接收方式" prop="receiveType">
            <el-select
              v-model="temp.receiveType"
              placeholder="请选择接收方式"
              clearable
              class="el-select-full"
            >
              <el-option label="短信" value="0" />
              <el-option label="邮件" value="1" />
              <el-option label="全部" value="2" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model="temp.phoneNumber" placeholder="手机号码" maxlength="11" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="temp.mail" placeholder="邮箱" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属供应商" prop="manufacturerId">
            <el-select
              v-model="temp.manufacturerId"
              placeholder="请选择供应商"
              clearable
              class="el-select-full"
            >
              <el-option
                v-for="m in totalManufacturerList"
                :key="m.value"
                :label="m.manufacturerName"
                :value="m.manufacturerId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目工期" prop="proTimesId">
            <el-select
              v-model="temp.proTimesId"
              placeholder="请选择项目工期"
              clearable
              class="el-select-full"
            >
              <el-option
                v-for="item in proTimesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否接收通知" prop="receiveStatus">
            <el-radio v-model="temp.receiveStatus" label="0">是</el-radio>
            <el-radio v-model="temp.receiveStatus" label="1">否</el-radio>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="接收报警类型" prop="checkedAlarms">
            <el-checkbox-group v-model="temp.checkedAlarms">
              <el-checkbox
                v-for="item in alarmTypeList"
                :key="item.alarmCodeId"
                :label="item.alarmCodeId"
              >
                {{ item.alarmDesc }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item>
        <div class="text-align-right">
          <el-button :disabled="!canBeClosed" @click="emitCancel">取消</el-button>
          <el-button type="primary" :loading="loader.update" @click="submitForm">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import FormEdit from '@/mixins/form-suites/form-edit'
import accendantApi from '@/api/accendant'
import manufacturerApi from '@/api/manufacturer'
import protimesApi from '@/api/protimes'

export default {
  name: 'Accendant',

  components: {

  },

  mixins: [FormEdit],

  data() {
    return {

      id: undefined,

      temp: {
        id: null,
        name: null,
        receiveType: null,
        phoneNumber: null,
        manufacturerId: null,
        mail: null,
        receiveStatus: '0',
        proTimesId: null,
        checkedAlarms: [],
      },

      rules: {
        name: [
          {
            required: true,
            message: '请输入维修人员名称',
            trigger: 'change',
          },
        ],
        receiveType: [
          {
            required: true,
            message: '请选择消息接收方式',
            trigger: 'change',
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'change',
          },
          {
            message: '请输入正确的手机号',
            trigger: 'change',
            pattern: /^1[3456789]\d{9}$/,
          },
        ],
        mail: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'change',
          },
          {
            message: '请输入正确的邮箱',
            trigger: 'change',
            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
          },
        ],
        manufacturerId: [
          {
            required: true,
            message: '请选择所属供应商',
            trigger: 'change',
          },
        ],
        proTimesId: [
          {
            required: true,
            message: '请选择项目工期',
            trigger: 'change',
          },
        ],
        receiveStatus: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
        checkedAlarms: [
          {
            required: true,
            message: '请选择接收报警类型',
            trigger: 'change',
          },
        ],
      },

      totalManufacturerList: [],

      proTimesList: [],

      alarmTypeList: [],

    }
  },

  mounted() {
    // 供应商
    manufacturerApi.listTotalManufacturer().then(ret => {
      this.totalManufacturerList = ret.data
    })

    // 工程期数
    protimesApi.getProTimesList().then(ret => {
      this.proTimesList = ret.data
    })

    // 报警类型
    accendantApi.alarmCode().then(res => {
      var dataList = res.data.filter(item => {
        if (item.woAlarmSet && item.woAlarmSet === '0') {
          return true
        }
      })
      this.alarmTypeList = dataList
    })
  },

  methods: {

    fetch(params) {
      return accendantApi
        .findById(params.id)
        .then(ret => {
          const accendant = ret.data.accendant || {}
          const {
            id,
            name,
            receiveType,
            phoneNumber,
            manufacturerId,
            mail,
            receiveStatus,
            proTimesId,
          } = accendant
          return {
            id: id,
            name: name,
            receiveType: receiveType,
            phoneNumber: phoneNumber,
            manufacturerId: manufacturerId,
            mail: mail,
            receiveStatus: receiveStatus,
            proTimesId: proTimesId,
            checkedAlarms: ret.data.alarmIds,
          }
        })
    },

    updateFormValue(formData) {
      this.temp = formData
      this.temp.name = this.temp.name
      this.temp.receiveType = this.temp.receiveType
      this.temp.phoneNumber = this.temp.phoneNumber
      this.temp.manufacturerId = this.temp.manufacturerId
      this.temp.mail = this.temp.mail
      this.temp.proTimesId = this.temp.proTimesId
      this.temp.checkedAlarms = this.temp.checkedAlarms
      if (this.temp.receiveStatus !== '1') {
        this.temp.receiveStatus = '0'
      }
    },

    getFormValue() {
      let alarmIds = ''
      for (const alarmId in this.temp.checkedAlarms) {
        alarmIds += this.temp.checkedAlarms[alarmId] + ','
      }
      this.temp.alarmIds = alarmIds
      return this.temp
    },

    update(data, isNew) {
      const updateApi = isNew ? accendantApi.saveRecord : accendantApi.edit

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
