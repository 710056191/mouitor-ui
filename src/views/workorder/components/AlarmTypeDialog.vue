<template>
  <div>
    <el-form
      :ref="formName"
      v-loading="loader.fetch"
      :model="temp"
      :rules="rules"
      :disabled="loader.fetch"
      label-width="100px"
      class="test-wins-choice"
    >

      <el-checkbox-group v-model="temp.checkedAlarms">
        <el-checkbox
          v-for="item in alarmTypeList"
          :key="item.alarmCodeId"
          :label="item.alarmCodeId"
        >
          {{ item.alarmDesc }}
        </el-checkbox>
      </el-checkbox-group>

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
import accendantApi from '@/api/accendant'

export default {
  name: 'AlarmType',

  components: {

  },

  mixins: [FormEdit],

  data() {
    return {
      temp: {
        checkedAlarms: [],
      },

      alarmTypeList: [],

      rules: {
        checkedAlarms: [
          {
            required: true,
            message: '请选择接收报警类型',
            trigger: 'change',
          },
        ],
      },

    }
  },

  mounted() {
    // 报警类型
    accendantApi.alarmCode().then(res => {
      this.temp.checkedAlarms = []
      this.alarmTypeList = res.data
      for (const alarm in res.data) {
        if (res.data[alarm].woAlarmSet && res.data[alarm].woAlarmSet === '0') {
          this.temp.checkedAlarms.push(res.data[alarm].alarmCodeId)
        }
      }
    })
  },

  methods: {
    fetch(params) {
      return accendantApi.alarmCode(params.alarmIds).then(ret => {
        const { alarmIds } = ret.data
        return {
          alarmIds: alarmIds,
        }
      })
    },

    updateFormValue(formData) {
      this.temp = formData
    },

    getFormValue() {
      return this.temp
    },

    update(data, isNew) {
      return accendantApi.setAlarm({ alarmIds: this.temp.checkedAlarms }).then(ret => {
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
.test-wins-choice{
  .el-checkbox{
    margin:5px 5px 5px 0;
    width: 240px;
  }
}
</style>
