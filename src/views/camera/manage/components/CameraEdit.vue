<template>
  <ElFormRenderer
    :ref="formName"
    v-loading="loader.fetch"
    label-width="120px"
    class="camera-edit-form"
    :disabled="loader.fetch"
    :content="formContent"
  >
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
  </ElFormRenderer>
</template>

<script>
import ElFormRenderer from '@femessage/el-form-renderer'
import FormEdit from '@/mixins/form-suites/form-edit'

import {
  getById,
  add as addCamera,
  update as updateCamera,
} from '@/api/camera'

import {
  getGeneralSupplier,
  getElectricSupplier,
  getNetworkSupplier,
} from '@/lib/cache/supplier'

import { formContentValue } from './camera-edit-fields'

export default {
  name: 'CameraEdit',

  components: {
    ElFormRenderer,
  },

  mixins: [FormEdit],

  data() {
    return {
      formContent: formContentValue(),
    }
  },

  mounted() {
    this.initOptionData()
  },

  methods: {
    fetch(params) {
      return getById(params)
        .then(res => res.data)
    },

    update(data, isNew) {
      data = {
        ...data,
        devid: this.params.deviceId,
      }
      return isNew ? addCamera(data) : updateCamera(data)
    },

    initOptionData() {
      const form = this.getFormRef()

      let pending
      const fetchList = []

      pending = getGeneralSupplier()
        .then(data => form.setOptions('totalManufacturerId', data))
      fetchList.push(pending)

      pending = getElectricSupplier()
        .then(data => form.setOptions('electricManufacturer', data))
      fetchList.push(pending)

      pending = getNetworkSupplier()
        .then(data => form.setOptions('networkManufacturer', data))
      fetchList.push(pending)

      // just for catch
      Promise.race(fetchList)
        .catch(e => console.error(e))
    },
  },
}
</script>

<style lang="scss">

</style>
