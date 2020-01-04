<!--
系统管理 - 系统配置管理
-->
<template>
  <div class="sys-config-view module-content-box">
    <el-table
      v-loading="listLoading"
      :data="list"
      class="el-table--outline-border"
      stripe
    >
      <!-- 序号 -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
      />

      <!-- 配置名称 -->
      <el-table-column label="配置名称" prop="configName" />

      <!-- 配置代码 -->
      <el-table-column label="配置代码" prop="configCode" />

      <!-- 当前值 -->
      <el-table-column label="当前值" prop="currentValue" />

      <!-- 状态 -->
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{row: {configStatus: status}}">
          <span v-if="status === 1">生效</span>
          <span v-else-if="status === 2" class="red">失效</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <!-- <template slot-scope="{ row }">
          <el-tooltip content="编辑" placement="top">
            <el-button icon="el-icon-edit" circle @click="handleEdit(row)" />
          </el-tooltip>

          <el-tooltip :content="row.configStatus === 1 ? '禁用' : '激活' " placement="top">
            <el-button
              :icon=" row.configStatus === 1 ? 'el-icon-close' : 'el-icon-check' "
              circle
              @click="handleActivation(row)"
            />
          </el-tooltip>
        </template> -->
        <template slot-scope="{ row }">
          <FUOperationBar
            :list="operation.list"
            @command="handleOperationBarCommand($event, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
    <div class="sf-table-heel-pagination">
      <el-pagination
        v-show="total>0"
        :current-page.sync="listQuery.pageNumber"
        :page-sizes="[10, 20,50]"
        :page-size.sync="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <!-- 弹框：编辑 -->
    <DialogContainerized
      title="编辑系统配置"
      :visible.sync="dialogEdit.visible"
      :before-close="editDialogBeforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form
        ref="editDialogForm"
        v-loading="dialogEdit.loading"
        label-width="100px"
        :model="dialogEdit.form"
        :rules="dialogEdit.rules"
        :close-on-click-modal="false"
        :disabled="dialogEdit.committing"
      >
        <el-form-item label="配置代码" prop="configCode">
          <el-input v-model="dialogEdit.form.configCode" />
        </el-form-item>
        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="dialogEdit.form.configName" />
        </el-form-item>
        <el-form-item label="当前值" prop="currentValue">
          <el-input v-model="dialogEdit.form.currentValue" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogCancelBtnOnclick">取 消</el-button>
        <el-button type="primary" :loading="dialogEdit.committing" @click="editDialogOnSubmit">确 定</el-button>
      </span>
    </DialogContainerized>
  </div>

</template>

<script>
import configApi from '@/api/config'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'SysConfig',

  components: {
    FUOperationBar,
    DialogContainerized,
  },

  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
      },

      operation: {
        list: [
          { label: '编辑', command: 'edit' },
          { label: '状态', command: 'state' },
        ],
      },

      // 编辑弹框
      dialogEdit: {
        visible: false,
        loading: true,
        committing: false,
        id: '',
        form: {
          configId: '',
          configCode: '',
          configName: '',
          currentValue: '',
        },
        rules: {
          configCode: [{ required: true, message: '请输入配置代码', trigger: 'change' }],
          configName: [{ required: true, message: '请输入配置名称', trigger: 'change' }],
          currentValue: [{ required: true, message: '请输入当前值', trigger: 'change' }],
        },
      },
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      configApi.fetchList(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total

        this.listLoading = false
      })
    },

    handleEdit(target) {
      if (!target || !target.configId) {
        return
      }
      this.dialogEdit.id = target.configId
      this.openEditDialog()
    },

    async handleActivation(target) {
      if (!target || !target.configId) {
        return
      }
      const currentValid = target.configStatus === 1
      const toValid = !currentValid
      const toValidText = toValid ? '激活' : '禁用'

      const confirmTask = () => {
        const type = toValid ? 'warning' : 'error'
        return this.$confirm(`确定要${toValidText}`, '更新状态', { type })
          .catch(() => Promise.reject(null))
      }

      const updateTask = async() => {
        await configApi.updateItmStatusById(target.configId, toValid)
          .catch(() => Promise.reject(null))

        this.$message.success(`${target.configName} 已${toValidText}`)
      }

      try {
        await confirmTask()
        await updateTask()
        this.getList()
      } catch (thrown) {
        switch (typeof thrown) {
          case 'string':
            this.$message.error(thrown)
            break

          case 'object':
          default:
            thrown && console.error(thrown)
        }
      }
    },

    // EditDialog start

    async openEditDialog() {
      // open dialog
      // load detail data

      const dialog = this.dialogEdit
      dialog.visible = true
      dialog.loading = true

      let data
      try {
        const res = await configApi.findById({ id: dialog.id })
        data = res.data
      } catch (e) {
        console.error(e)
      }
      dialog.loading = false

      if (!data) {
        dialog.visible = false
        return
      }
      dialog.form.configId = data.configId || ''
      dialog.form.configCode = data.configCode || ''
      dialog.form.configName = data.configName || ''
      dialog.form.currentValue = data.currentValue || ''

      this.editDialogClearValidate()
    },

    editDialogClearValidate() {
      if (this.$refs['editDialogForm']) {
        this.$refs['editDialogForm'].clearValidate()
      } else {
        this.$nextTick(() => {
          this.$refs['editDialogForm'].clearValidate()
        })
      }
    },

    editDialogCancelBtnOnclick() {
      if (this.editDialogDetermineClose()) {
        this.dialogEdit.visible = false
      }
    },

    async editDialogOnSubmit() {
      // set commit button loading
      // validate form
      // commit
      // close and reload list

      const dialog = this.dialogEdit
      dialog.committing = true

      try {
        await this.editDialogFormValidate()
      } catch (e) {
        console.log('editDialogFormValidate error', e)
        dialog.committing = false
        return
      }

      try {
        await configApi.editSysConfig({ ...dialog.form })
        dialog.visible = false
        this.getList()

        // eslint-disable-next-line no-empty
      } catch (e) {
      }
      dialog.committing = false
    },

    editDialogFormValidate() {
      return new Promise((resolve, reject) => {
        this.$refs['editDialogForm'].validate(valid => {
          valid ? resolve() : reject()
        })
      })
    },

    editDialogBeforeClose(done) {
      this.editDialogDetermineClose() && done()
    },

    // 确认弹框能否关闭
    editDialogDetermineClose() {
      if (this.dialogEdit.committing) {
        this.$message.warning('正在提交，请稍等')
        return false
      }
      return true
    },

    handleOperationBarCommand(command, row) {
      switch (command) {
        // case 'view':
        //   this.handleOperateShowDetail(row)
        //   break

        case 'edit':
          this.handleEdit(row)
          break

        case 'state':
          this.handleActivation(row)
          break

        default:
          console.warn('unknown command:', command)
          break
      }
    },

    // EditDialog end
  },
}
</script>

<style lang="scss">

</style>
