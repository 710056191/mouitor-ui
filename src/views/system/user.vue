<template>
  <div class="sys-user-view module-content-box">
    <!-- 主体内容 -->
    <SuiteTable
      ref="table"
      :table-props="tableProps"
    >
      <template v-slot:col_operation="{ row }">
        <FUOperationBar
          :list="operation.list"
          @command="handleOperationBarCommand($event, row)"
        />
      </template>

      <template v-slot:default>
        <div class="sf-table-top-toolbar">
          <div class="inner">
            <el-button
              type="primary"
              @click="openEditDialog(null, true)"
            >
              新增账号
            </el-button>
          </div>
        </div>
      </template>
    </SuiteTable>

    <!-- 弹框：编辑 -->
    <SuiteDialogEditWrapper
      component="UserEdit"
      :visible.sync="editDialog.visible"
      v-bind="editDialog.config"
      @completed="editOnSuccess"
    />

    <!-- 弹框：设置角色 -->
    <SuiteDialogEditWrapper
      component="UserRole"
      :visible.sync="editRoleDialog.visible"
      v-bind="editRoleDialog.config"
      @completed="editRoleOnSuccess"
    />

    <!-- 弹框：重置密码 -->
    <SuiteDialogEditWrapper
      component="UserResetPassword"
      :visible.sync="resetPwdDialog.visible"
      v-bind="resetPwdDialog.config"
      @completed="resetPwdOnSuccess"
    />
  </div>
</template>

<script>
import SuiteTable from '@/components/FormSuites/SuiteTable'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import {
  tablePropsValue,
  confirmDeleteUser,
} from '@/views/system/user.business'
import SuiteDialogEditWrapper from '@/components/FormSuites/SuiteDialogEditWrapper'
import UserEdit from './user/components/UserEdit'
import UserRole from './user/components/UserRole'
import UserResetPassword from './user/components/UserResetPassword'

export default {
  name: 'SystemUser',

  components: {
    SuiteDialogEditWrapper,
    FUOperationBar,
    SuiteTable,
    UserEdit, // eslint-disable-line vue/no-unused-components
    UserRole, // eslint-disable-line vue/no-unused-components
    UserResetPassword, // eslint-disable-line vue/no-unused-components
  },

  data() {
    return {
      tableProps: tablePropsValue(),

      operation: {
        list: [
          {
            label: '设置角色',
            command: 'set_role',
          },
          {
            label: '重置密码',
            command: 'reset_password',
          },
          {
            label: '编辑',
            command: 'edit',
          },
          {
            label: '删除',
            command: 'delete',
          },
        ],
      },

      editDialog: {
        visible: false,
        config: {
          addedTitle: '新增账号',
          editTitle: '编辑账号',

          isNew: false,
          params: {
            id: '',
          },
        },
      },

      editRoleDialog: {
        visible: false,
        config: {
          editTitle: '设置账号角色',

          isNew: false,

          params: {
            id: '',
          },
        },
      },

      resetPwdDialog: {
        visible: false,
        config: {
          addedTitle: '重置密码',
          isNew: true,

          params: {
            id: '',
          },
        },
      },
    }
  },

  methods: {
    reloadList(resetPageIndex = false) {
      this.$refs['table'].reload(resetPageIndex)
    },

    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'edit':
          this.openEditDialog({ id: row.id })
          break

        case 'set_role':
          this.openEditRoleDialog({ id: row.id })
          break

        case 'reset_password':
          this.openResetPwdDialog({ id: row.id })
          break

        case 'delete':
          this.handleDelete(row)
          break
        default:
      }
    },

    openEditDialog(params, isNew) {
      const dialog = this.editDialog
      dialog.config.params = params
      dialog.config.isNew = !!isNew
      dialog.visible = true
    },

    editOnSuccess(res) {
      let message = res.message || ''
      if (!message || message === 'OK') {
        message = '账号已修改'
      }
      this.$message.success(message)

      this.editDialog.visible = false
      this.reloadList()
    },

    openEditRoleDialog(params) {
      const dialog = this.editRoleDialog
      dialog.config.params = params
      dialog.visible = true
    },

    editRoleOnSuccess(res) {
      let message = res.message || ''
      if (!message || message === 'OK') {
        message = '角色已更新'
      }
      this.$message.success(message)

      this.editRoleDialog.visible = false
      this.reloadList()
    },

    openResetPwdDialog(params) {
      const dialog = this.resetPwdDialog
      dialog.config.params = params
      dialog.visible = true
    },

    resetPwdOnSuccess(res) {
      let message = res.message || ''
      if (!message || message === 'OK') {
        message = '密码已重置'
      }
      this.$message.success(message)

      this.resetPwdDialog.visible = false
      this.reloadList()
    },

    handleDelete(row) {
      confirmDeleteUser(row)
        .then((result) => {
          result && result.success && this.reloadList()
        })
    },
  },
}
</script>

<style lang="scss">

</style>
