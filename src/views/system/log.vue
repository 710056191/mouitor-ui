<!--
系统管理 - 日志管理
-->

<template>
  <div class="sys-log-view  module-content-box">
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

        <el-form-item class="filter-item">
          <el-cascader
            v-model="filterModel.operationType"
            :props="operationType.prop"
            clearable
            placeholder="操作模块/类型"
          />
        </el-form-item>

        <el-form-item class="filter-item">
          <el-date-picker
            v-model="filterModel.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item class="filter-item">
          <el-button
            type="primary"
            icon="el-icon-search"
            :loading="listLoading"
            @click="handleFilter"
          >
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      class="el-table--outline-border"
      stripe
    >
      <!-- 序号 -->
      <el-table-column label="序号" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <!-- 操作员 -->
      <el-table-column label="操作员" prop="operator" />

      <!-- 操作模块 -->
      <el-table-column label="操作模块" prop="module" />

      <!-- 操作类型 -->
      <el-table-column label="操作类型" prop="type" />

      <!-- 操作内容 -->
      <el-table-column label="操作内容" prop="content" min-width="200" />

      <!-- 操作时间 -->
      <el-table-column label="备份时间" prop="date" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- 操作结果 -->
      <el-table-column label="操作结果" align="center" prop="result" width="150" />
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

    <DialogContainerized
      title="编辑数据备份信息"
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
        :close-on-click-modal="false"
        :disabled="dialogEdit.committing"
      >
        <el-form-item label="备份名称">
          <el-input v-model="dialogEdit.form.backupName" placeholder="备份名称" />
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
import firmwareApi from '@/api/firmware'
import sysLogApi from '@/api/sys-log'
import { format as dateFormat } from 'date-fns'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

const uploadStatusMap = {
  '1': '待备份',
  '2': '备份中',
  '3': '备份成功',
  '4': '备份失败',
}

export default {
  name: 'SysLog',

  components: {
    DialogContainerized,
  },

  data() {
    // operation Type
    const operationTypeValue = () => {
      const id2Name = {}

      const getRootNodes = () => {
        return [
          { logTypeId: 1, logTypeName: '监控终端设置' },
          { logTypeId: 5, logTypeName: '用户信息' },
          { logTypeId: 9, logTypeName: '监控项阀值设置' },
          { logTypeId: 15, logTypeName: '角色管理' },
          { logTypeId: 21, logTypeName: '摄像头设置' },
          { logTypeId: 30, logTypeName: '计费管理' },
          { logTypeId: 35, logTypeName: '基础数据库' },
        ]
      }

      const requestChildTypesTask = (typeId) => {
        return sysLogApi.findChildTypesById(typeId)
          .then(res => res.data)
          .catch(() => Promise.reject(null))
      }

      const operationTypeLazyLoad = async(node, resolve) => {
        console.log('operationTypeLazyLoad', node)
        const { level, value: typeId } = node

        /** @type {Array} */
        let typeList = null

        try {
          typeList = level === 0
            ? getRootNodes()
            : await requestChildTypesTask(typeId)
        } catch (e) {
          /* eslint-disable-line no-empty */
        }

        if (!typeList || !Array.isArray(typeList)) {
          return resolve(null)
        }

        const nodes = typeList.map(type => {
          const node = {
            ...type,
            value: type.logTypeId,
            label: type.logTypeName,
            leaf: level >= 1,
          }
          id2Name[node.value] = node.label // 因为列出接口突然反常要求传 name 而不是 id ，保持一份，供外面转换
          return node
        })

        resolve(nodes)
      }

      return {
        prop: {
          lazy: true,
          lazyLoad: operationTypeLazyLoad,
          checkStrictly: true,
        },
        id2Name: id2Name,
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
        operator: '',
        module: '',
        type: '',
        startDate: '',
        endDate: '',
      },

      filterModel: {
        operationType: null,
        dateRange: '',
      },

      filterBarConf: {
        texts: [
          { name: '操作员', prop: 'operator' },
        ],
      },

      operationType: operationTypeValue(),

      // 编辑弹框
      dialogEdit: {
        visible: false,
        loading: true,
        committing: false,
        id: '',
        form: {
          backupId: '',
          backupName: '',
        },
      },

      // 状态文本
      statusTextMap: Object.freeze(uploadStatusMap),
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      sysLogApi.fetchList(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total

        this.listLoading = false
      })
    },

    handleFilter() {
      // handle operationType
      const id2Name = this.operationType.id2Name
      const operationType = this.filterModel.operationType || []
      const [id1, id2] = operationType

      this.listQuery.module = id2Name[id1] || ''
      this.listQuery.type = id2Name[id2] || ''
      // handle operationType end

      // handle datePick data
      const dateRange = this.filterModel.dateRange || []
      const [startDate, endDate] = dateRange

      this.listQuery.startDate = startDate ? dateFormat(startDate, 'YYYY-MM-DD') : ''
      this.listQuery.endDate = endDate ? dateFormat(endDate, 'YYYY-MM-DD') : ''
      // handle datePick data end

      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleEdit(target) {
      if (!target || !target.firmwareId) {
        return
      }
      this.dialogEdit.id = target.firmwareId
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

    // EditDialog start

    async openEditDialog() {
      // open dialog
      // load detail data

      const dialog = this.dialogEdit
      dialog.visible = true
      dialog.loading = true

      let data
      try {
        const res = await firmwareApi.getById({ id: dialog.id })
        data = res.data
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
        await firmwareApi.update({ ...dialog.form })
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
  },
}
</script>

<style lang="scss">

</style>
