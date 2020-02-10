<!--
系统管理 - 固件设置
-->

<template>
  <div class="sys-firmware-view module-content-box">
    <div class="sf-filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item
          v-for="text in filterBarConf.texts"
          :key="text.prop"
          class="filter-input"
        >
          <el-input
            v-model="listQuery[text.prop]"
            :placeholder="text.placeholder || text.name"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="filter-item"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
          </el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="sf-table-top-toolbar">
      <div class="inner">
        <el-button
          type="primary"
          class="filter-item"
          @click="openEditDialog(null, true)"
        >
          新增固件
        </el-button>
      </div>
    </div>

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

      <!-- 固件编号 -->
      <el-table-column label="固件编号" prop="firmwareCode" />

      <!-- 固件名称 -->
      <el-table-column label="固件名称" prop="firmwareName" />

      <!-- 文件路径 -->
      <el-table-column label="文件路径" prop="firmwareStorePath" />

      <!-- 上传时间 -->
      <el-table-column label="上传时间" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.uploadTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column label="状态" width="100">
        <template slot-scope="{row: {firmwareStatus: status}}">
          {{ statusTextMap[status] }}
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
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
        :current-page="listQuery.pageNumber"
        :page-sizes="[10, 20,50]"
        :page-size.sync="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <!-- 弹框：编辑 -->
    <SuiteDialogEditWrapper
      component="FirmwareEdit"
      :visible.sync="editDialog.visible"
      v-bind="editDialog.config"
      @completed="editOnSuccess"
    />
  </div>

</template>

<script>
import firmwareApi from '@/api/firmware'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import SuiteDialogEditWrapper from '@/components/FormSuites/SuiteDialogEditWrapper'
import FirmwareEdit from '@/views/system/components/FirmwareEdit'

const uploadStatusMap = {
  1: '新建',
  2: '待上传',
  3: '上传中',
  4: '上传完毕',
  5: '待使用',
  6: '正在使用',
  7: '使用结束',
  8: '已作废',
  9: '异常',
}

export default {
  name: 'SysFirmware',

  components: {
    SuiteDialogEditWrapper,
    FUOperationBar,
    FirmwareEdit, // eslint-disable-line vue/no-unused-components
  },

  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        firmwareCode: '',
        firmwareName: '',
        firmwareStorePath: '',
      },
      operation: {
        list: [
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },
      filterBarConf: {
        texts: [
          { name: '固件编号', prop: 'firmwareCode' },
          { name: '固件名称', prop: 'firmwareName' },
          { name: '固件文件路径', prop: 'firmwareStorePath' },
        ],
      },

      // 编辑弹框
      dialogEdit: {
        visible: false,
        loading: true,
        committing: false,
        isAdd: false,
        id: '',
        form: {
          firmwareId: '',
          firmwareCode: '',
          firmwareName: '',
        },

        rules: {
          firmwareCode: [{ required: true, message: '请输入备固件编号', trigger: 'blur' }],
          firmwareName: [{ required: true, message: '请输入固件名称', trigger: 'blur' }],
        },

      },

      // 状态文本
      statusTextMap: Object.freeze(uploadStatusMap),

      editDialog: {
        visible: false,
        config: {
          addedTitle: '新增固件',
          editTitle: '编辑固件',

          isNew: false,
          params: {
            id: '',
          },
        },
      },

    }
  },

  created() {
    this.getList()
  },

  methods: {
    reloadList(...args) {
      this.getList(...args)
    },

    getList() {
      this.listLoading = true
      firmwareApi.fetchList(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total

        this.listLoading = false
      })
    },

    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
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
        dialog.isAdd
          ? await firmwareApi.addFirmware({ ...dialog.form })
          : await firmwareApi.updateFirmware({ ...dialog.form })
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

    paginationSizeChange() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleDel(firmwareId) {
      this.$confirm('你确定要永久删除该固件吗？').then(() => {
        this.delData(firmwareId)
      })
    },

    delData(firmwareId) {
      firmwareApi.delFirmware({ id: firmwareId }).then(ret => {
        if (ret.success) {
          this.$message({
            message: ret.message,
            type: 'success',
          })
          this.getList()
        }
      })
    },

    handleOperationBarCommand(command, row) {
      const id = row.firmwareId

      switch (command) {
        case 'edit':
          this.openEditDialog({ id })
          break

        case 'delete':
          this.handleDel(row.firmwareId)
          break

        default:
          console.warn('unknown command:', command)
          break
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
        message = '固件已保存'
      }
      this.$message.success(message)

      this.editDialog.visible = false
      this.reloadList()
    },
  },
}
</script>

<style lang="scss">

</style>
