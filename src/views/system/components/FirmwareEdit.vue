<template>
  <section>
    <el-form
      :ref="formName"
      v-loading="loader.fetch"
      :model="formModel"
      :disabled="loader.fetch"
      label-width="100px"
      class="sys-user-edit-form"
    >
      <el-form-item
        v-for="(item, idx) in formContent"
        :key="idx"
        :label="item.label"
        :prop="item.id"
        :rules="item.rules"
      >
        <component
          :is="item.component || ('el-' + item.type)"
          v-model="formModel[item.id]"
          v-bind="item.el"
        />
      </el-form-item>

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
  </section>
</template>

<script>
import ElFormRenderer from '@femessage/el-form-renderer'
import FormEdit from '@/mixins/form-suites/form-edit'
import FirmwareEditUpload from './FirmwareEditUpload'

import { complementFields } from '@/utils/form-field'
import { addFirmware, getById, updateFirmware } from '@/api/firmware.js'

const Fields = [
  {
    id: 'firmwareName',
    label: '固件名称',
  },
  {
    id: 'firmwareCode',
    label: '固件编号',
  },
  {
    id: 'firmwareFile',
    label: '固件文件',
    component: FirmwareEditUpload,
    el: {
      placeholder: '请上传固件',
    },
    _onlyInNew: true,
  },
]

const formContentValue = ({ isNew = false }) => {
  isNew = !!isNew

  let list = Fields
    .filter((field) => {
      return (typeof field._onlyInNew !== 'boolean') ||
        (field._onlyInNew === isNew)
    })

  list = complementFields(list)
  Object.freeze(list)
  return list
}

export default {
  name: 'FirmwareEdit',

  components: {
    ElFormRenderer,
  },

  mixins: [FormEdit],

  data() {
    return {
      formContent: formContentValue({
        isNew: this.isNew,
      }),

      formModel: {},
    }
  },

  methods: {
    fetch(params) {
      return getById(params)
        .then(res => res.data)
    },

    resolveFetchData(fetchData) {
      return {
        firmwareName: fetchData.firmwareName,
        firmwareCode: fetchData.firmwareCode,
      }
    },

    updateFormValue(formData) {
      this.formModel = {
        ...formData,
      }
    },

    getFormValue() {
      return this.formModel
    },

    update(data, isNew) {
      data = Object.assign({}, data)

      let postData = null

      if (isNew) {
        const fileList = data.firmwareFile || []
        const file = fileList[0]

        data.firmwareFile = file && file.raw

        const formData = new FormData()
        Object.keys(data).forEach(key => {
          formData.append(key, data[key])
        })

        postData = formData
      } else {
        data.firmwareId = this.params.id
        postData = data
      }

      const updateApi = isNew ? addFirmware : updateFirmware
      return updateApi(postData)
    },

  },
}
</script>

<style lang="scss">

</style>
