<template>
  <ElFormRenderer
    :ref="formName"
    v-loading="loader.fetch"
    label-width="100px"
    class="sys-user-reset-pwd"
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

import { complementFields } from '@/utils/form-field'
import { updateUserPwd } from '@/api/user'

const Fields = [
  {
    id: 'pwd',
    label: '密码',
    type: 'input',
    el: {
      showPassword: true,
    },
  },
  {
    id: 'confirm_pwd',
    label: '确认密码',
    type: 'input',
    el: {
      showPassword: true,
    },
  },
]

const formContentValue = () => {
  const list = complementFields(Fields)
  Object.freeze(list)
  return list
}

export default {
  name: 'UserResetPassword',

  components: {
    ElFormRenderer,
  },

  mixins: [FormEdit],

  data() {
    /** @type {Array} */
    const formContent = formContentValue()

    // 添加 密码二次确认 检验规则
    const confirmPwdField = formContent.find(field => field.id === 'confirm_pwd')
    confirmPwdField.rules.push({
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value || value.length < 1) {
          return callback(new Error('请再次输入密码'))
        }

        const pwd = this.getFirstPwdValue()
        console.log('first pwd', pwd, this.formData)
        if (value !== pwd) {
          return callback(new Error('两次输入密码不一致'))
        }

        callback()
      },
    })

    return {
      formContent,
    }
  },

  methods: {
    fetch(params) {
      // 没有加载旧密码逻辑，故 isNew 不能设置为 false
      throw new Error('please set "isNew" prop to true')
    },

    update(data = {}) {
      const id = this.params.id
      return updateUserPwd({
        userId: id,
        pwd: data.confirm_pwd,
      })
    },

    getFirstPwdValue() {
      const form = this.getFormRef()
      const value = form && form.value
      return value.pwd
    },
  },
}
</script>

<style lang="scss">

</style>
