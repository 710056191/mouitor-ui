<template>
  <ElFormRenderer
    :ref="formName"
    v-loading="loader.fetch"
    label-width="100px"
    class="sys-user-edit-form"
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
  findRecord,
  userSave,
} from '@/api/user'
import { complementFields } from '@/utils/form-field'

const Fields = [
  {
    id: 'username',
    label: '账号',
  },
  {
    id: 'nick',
    label: '昵称',
  },
  {
    id: 'pwd',
    label: '密码',
    type: 'input',
    el: {
      showPassword: true,
    },
    _onlyInNew: true,
  },
]

const formContentValue = ({ isNew = false }) => {
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
  name: 'UserEdit',

  components: {
    ElFormRenderer,
  },

  mixins: [FormEdit],

  data() {
    return {
      formContent: formContentValue({
        isNew: this.isNew,
      }),
    }
  },

  methods: {
    fetch(params) {
      return findRecord({ userId: params.id })
        .then(res => res.data)
    },

    update(data, isNew) {
      data = Object.assign({}, data)
      if (!isNew) {
        data.id = this.params.id
      }
      return userSave(data)
    },

  },
}
</script>

<style lang="scss">

</style>
