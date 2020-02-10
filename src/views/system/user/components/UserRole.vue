<template>
  <ElFormRenderer
    :ref="formName"
    v-loading="loader.fetch"
    label-width="100px"
    class="user-role-form"
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
  formContentValue,
  fetchRoleInfo,
  updateUserRoles,
} from './user-role.business'

export default {
  name: 'UserRole',

  components: {
    ElFormRenderer,
  },

  mixins: [FormEdit],

  data() {
    return {
      formContent: formContentValue(),
    }
  },

  methods: {
    fetch(params) {
      return fetchRoleInfo(params.id)
    },

    resolveFetchData(data) {
      const {
        assigned,
        unAssigned,
      } = data

      // update options
      const roleOptions = [
        ...assigned.map(role => {
          return {
            label: role.name,
            value: role.id,
          }
        }),

        ...unAssigned.map(role => {
          return {
            label: role.name,
            value: role.id,
          }
        }),
      ]

      // 使用 id 排序，使得显示顺序保持一致
      roleOptions.sort((a, b) => {
        return a.value - b.value
      })

      const form = this.getFormRef()
      form.setOptions('role', roleOptions)

      return {
        role: assigned.map(role => role.id),
      }
    },

    update(data = {}) {
      return updateUserRoles(this.params.id, data.role)
    },
  },
}
</script>

<style lang="scss">
//隐藏label
.user-role-form{
  .el-form-item__label{
    display: none;
  }
  .el-form-item__content{
    margin-left: 0 !important;
  }
  .el-checkbox{
    width: 31%;
    margin-right: 2%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: -15px 2% -15px 0;
  }
}
</style>
