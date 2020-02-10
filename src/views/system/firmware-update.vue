<!--
系统管理 - 固件设置
-->

<template>
  <div class="sys-firmware-update-view module-content-box">
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
              :label="item.firmwareName"
              :value="item.firmwareId"
            />
          </el-select>
          <el-input
            v-else
            v-model="listQuery[text.prop]"
            :placeholder="text.placeholder || text.name"
            clearable
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
          @click="upgrade"
        >
          一键升级
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      class="el-table--outline-border"
      stripe
      @selection-change="handleSelectionChange"
    >

      <!-- 多选 -->
      <el-table-column
        type="selection"
        width="30"
      />

      <!-- 序号 -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
      />

      <el-table-column label="设备id" prop="devid" />

      <!-- 点位编号 -->
      <el-table-column label="点位编号" prop="selfCode" />

      <!-- 点位位置 -->
      <el-table-column label="点位位置" prop="selfLocation" />

      <!-- 设备名称 -->
      <el-table-column label="设备名称" prop="devName" />

      <!-- ip -->
      <el-table-column label="设备IP" prop="ip" width="150" />

      <!-- 状态 -->
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row: {status: status}}">
          <span v-if="status === '0'">正常</span>
          <span v-else class="red">{{ statusTextMap[status] }}</span>
        </template>
      </el-table-column>

      <!-- 故障状态 -->
      <el-table-column label="故障状态" align="center" width="200">
        <template slot-scope="{ row }">
          <span v-if="row.status !== '0'" class="red">{{ row.alarmDesc }}</span>
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
        label-width="80px"
        :model="dialogEdit.form"
        :close-on-click-modal="false"
        :disabled="dialogEdit.committing"
      >
        <el-form-item label="固件名称">
          <el-input v-model="dialogEdit.form.firmwareCode" placeholder="固件名称" />
        </el-form-item>
        <el-form-item label="固件编号">
          <el-input v-model="dialogEdit.form.firmwareName" placeholder="固件编号" />
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
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

const uploadStatusMap = {
  '0': '正常',
  '1': '故障',
  '2': '报警',
  '3': '停用',
  '4': '已初始化(未启用）',
}

export default {
  name: 'FirmwareUpdate',

  components: {
    DialogContainerized,
  },

  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      devIds: '',
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        firmwareId: '',
        query_selfCode: '',
        query_selfLocation: '',
        query_devName: '',
        query_startIp: '',
        query_endIp: '',
        query_status: '',
      },

      filterBarConf: {
        texts: [
          { name: '请选择固件包', prop: 'firmwareId', type: 'select', list: null },
          { name: '点位编号', prop: 'query_selfCode' },
          { name: '点位位置', prop: 'query_selfLocation' },
          { name: '设备名称', prop: 'query_devName' },
          { name: '网络开始IP地址', prop: 'query_startIp' },
          { name: '网络结束IP地址', prop: 'query_endIp' },
          { name: '请选择设备状态',
            prop: 'query_status',
            type: 'select',
            list: [
              { firmwareId: '0', firmwareName: '正常' },
              { firmwareId: '1', firmwareName: '故障' },
              { firmwareId: '2', firmwareName: '报警' },
              { firmwareId: '3', firmwareName: '停用' },
              { firmwareId: '4', firmwareName: '已初始化(未启用)' },
            ],
          },
        ],
      },

      // 编辑弹框
      dialogEdit: {
        visible: false,
        loading: true,
        committing: false,
        id: '',
        form: {
          firmwareId: '',
          firmwareCode: '',
          firmwareName: '',
        },
      },

      // 状态文本
      statusTextMap: Object.freeze(uploadStatusMap),
    }
  },

  created() {
    this.getList()
    firmwareApi.exitFirmwareList().then(res => {
      this.filterBarConf.texts[0].list = res.data
    })
  },

  methods: {
    getList() {
      this.listLoading = true
      firmwareApi.fetchDeviceList(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total

        this.listLoading = false
      })
    },

    handleFilter() {
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
      dialog.form.firmwareId = data.firmwareId || ''
      dialog.form.firmwareCode = data.firmwareCode || ''
      dialog.form.firmwareName = data.firmwareName || ''
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

    upgrade() {
      if (!this.devIds) {
        this.$message('请勾选要升级的设备')
        return
      }
      const firmwareId = this.listQuery.firmwareId
      if (!firmwareId) {
        this.$message('请选择固件包')
        return
      }
      const data = { devIds: this.devIds, firmwareId: firmwareId }
      firmwareApi.upgrade(data).then(res => {
        if (res.success) {
          this.$message({ message: res.message, type: 'success' })
          this.getList()
        } else {
          this.$message({ message: res.message, type: 'error' })
        }
      })
    },
    handleSelectionChange(val) {
      let devIds = ''
      val.forEach(item => {
        devIds += item.devid + ','
      })
      this.devIds = devIds
    },
  },
}
</script>

<style lang="scss">

</style>
