<!--
系统管理 - 数据备份
-->

<template>
  <div class="sys-data-backup-view module-content-box">
    <div class="sf-filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item
          v-for="text in filterBarConf.texts"
          :key="text.prop"
          class="filter-item"
        >
          <el-select
            v-if="text.type === 'select'"
            v-model="listQuery[text.prop]"
            :placeholder="text.placeholder || text.name"
            clearable
          >
            <el-option
              v-for="(item, index) in text.list"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-else
            v-model="listQuery[text.prop]"
            :placeholder="text.placeholder || text.name"
            clearable
          />
        </el-form-item>

        <!-- 日期范围选择 -->
        <el-form-item class="filter-item">
          <el-date-picker
            v-model="filterModel.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>

      </el-form>
    </div>
    <div class="sf-table-top-toolbar">
      <div class="inner">
        <el-button
          type="primary"
          class="filter-item"
          @click="handleEdit(null, true)"
        >
          新增备份
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

      <!-- 备份名称 -->
      <el-table-column label="备份名称" prop="backupName" />

      <!-- 备份文件路径 -->
      <el-table-column label="备份文件路径" prop="backupPath" />

      <!-- 备份状态 -->
      <el-table-column label="备份状态" width="100">
        <template slot-scope="{row: {backupStatus: status}}">
          <span v-if="status === 3">{{ statusTextMap[status] || '未知' }}</span>
          <span v-else class="red">{{ statusTextMap[status] || '未知' }}</span>
        </template>
      </el-table-column>

      <!-- 备份时间 -->
      <el-table-column label="备份时间" prop="backupTime" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.backupTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="200">

        <!--
            <template slot-scope="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button icon="el-icon-tickets" circle @click="handleOperateShowDetail(row)" />
            </el-tooltip>

            <el-tooltip content="编辑" placement="top">
              <el-button icon="el-icon-edit" circle @click="handleEdit(row)" />
            </el-tooltip>

            <el-tooltip content="删除" placement="top">
              <el-button icon="el-icon-delete" circle />
            </el-tooltip>
          </template>
          -->

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
        @size-change="paginationSizeChange"
        @current-change="getList"
      />
    </div>

    <!-- 弹框：新增/编辑 -->
    <DialogContainerized
      :title="dialogEdit.isAdd ? '新增备份' : '编辑备份'"
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
        label-width="80px"
        :model="dialogEdit.form"
        :rules="dialogEdit.rules"
        :close-on-click-modal="false"
        :disabled="dialogEdit.committing"
        @submit.native.prevent
      >
        <el-form-item label="备份名称" prop="backupName">
          <el-input
            v-model="dialogEdit.form.backupName"
            maxlength="32"
            placeholder="备份名称"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogCancelBtnOnclick">取 消</el-button>
        <el-button type="primary" :loading="dialogEdit.committing" @click="editDialogOnSubmit">确 定</el-button>
      </span>
    </DialogContainerized>

    <!-- 弹框：详情 -->
    <DisplayDialogTable
      :visible.sync="dialogDetail.visible"
      v-bind="dialogDetail.config"
    />

  </div>

</template>

<script>
import configApi from '@/api/config'
import dataCenterApi from '@/api/data-center'
import { format as dateFormat } from 'date-fns'
import DisplayDialogTable from '@/components/DialogBox/DisplayDialogTable'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

const backupStatusMap = {
  '1': '待备份',
  '2': '备份中',
  '3': '备份成功',
  '4': '备份失败',
}

export default {
  name: 'SystemDataBackup',

  components: {
    DisplayDialogTable,
    FUOperationBar,
    DialogContainerized,
  },

  data() {
    const backupStatusFilterList = [
      { value: '3', label: '备份成功' },
      { value: '4', label: '备份失败' },
    ]

    const dialogDetailValue = () => {
      return {
        visible: false,

        config: {
          dialog: {
            title: '备份详情',
          },
          fields: [
            { label: '备份名称：', prop: 'backupName' },
            { label: '备份路径：', prop: 'backupPath' },
            { label: '备份时间：', prop: 'backupTime', formatter: (time) => new Date(time).toLocaleString() },
            { label: '备份状态：', prop: 'backupStatus', formatter: (status) => backupStatusMap[status] },
            { label: '备份人：', prop: 'backUpUserName' },
          ],

          params: null,

          fetch(config) {
            if (!config || !config.backupId) {
              throw new Error('No target backupId')
            }

            return dataCenterApi
              .getById({ id: config.backupId })
              .then((res) => {
                return res.data
              })
          },
        },
      }
    }

    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        // --
        backUpName: '',
        backUpStatus: '',
        startDate: '',
        endDate: '',
      },

      operation: {
        list: [
          { label: '详情', command: 'view' },
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },

      filterModel: {
        dateRange: '',
      },

      filterBarConf: {
        texts: [
          { name: '备份名称', prop: 'backUpName' },
          {
            name: '备份状态',
            prop: 'backUpStatus',
            type: 'select',
            list: Object.freeze(backupStatusFilterList),
            placeholder: '请选择备份状态',
          },
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
          backupId: '',
          backupName: '',
        },

        rules: {
          backupName: [{ required: true, message: '请输入备份名称', trigger: 'blur' }],
        },
      },

      // 状态文本
      statusTextMap: Object.freeze(backupStatusMap),

      // 查看详情弹框
      dialogDetail: dialogDetailValue(),
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      dataCenterApi.fetchList(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total

        this.listLoading = false
      })
    },

    handleFilter() {
      // handle datePick data
      const dateRange = this.filterModel.dateRange || []
      const [startDate, endDate] = dateRange

      this.listQuery.startDate = startDate ? dateFormat(startDate, 'YYYY-MM-DD') : ''
      this.listQuery.endDate = endDate ? dateFormat(endDate, 'YYYY-MM-DD') : ''
      // handle datePick data end

      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleEdit(target, isAdd) {
      if (!isAdd && (!target || !target.backupId)) {
        return
      }
      if (isAdd) {
        this.dialogEdit.id = null
      } else {
        this.dialogEdit.id = target.backupId
      }
      this.dialogEdit.isAdd = !!isAdd
      this.openEditDialog()
    },

    async handleActivation(target) {
      if (!target || !target.firmwareId) {
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
        await configApi.updateItmStatusById(target.firmwareId, toValid)
          .catch(() => Promise.reject(null))

        this.$message.success(`${target.firmwareName} 已${toValidText}`)
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

    handleOperateShowDetail(target) {
      if (!target) {
        return
      }
      this.dialogDetail.config.params = target
      this.dialogDetail.visible = true
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
        if (!dialog.isAdd) {
          const res = await dataCenterApi.getById({ id: dialog.id })
          data = res.data
        } else {
          data = {}
        }
      } catch (e) {
        console.error(e)
      }
      dialog.loading = false

      if (!data) {
        dialog.visible = false
        return
      }
      dialog.form.backupId = data.backupId || ''
      dialog.form.backupName = data.backupName || ''

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
        dialog.isAdd
          ? await dataCenterApi.addBackUp({ ...dialog.form })
          : await dataCenterApi.editBackUp({ ...dialog.form })
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
    // EditDialog end

    paginationSizeChange() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleDel(id) {
      this.$confirm('你确定要永久删除该备份吗？').then(() => {
        this.delData(id)
      })
    },

    delData(id) {
      dataCenterApi.delBackUp({ ids: id }).then(ret => {
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
      switch (command) {
        case 'view':
          this.handleOperateShowDetail(row)
          break

        case 'edit':
          this.handleEdit(row)
          break

        case 'delete':
          this.handleDel(row.backupId)
          break

        default:
          console.warn('unknown command:', command)
          break
      }
    },

  },
}
</script>

<style lang="scss">

</style>
