<template>
  <div class="uninit-device-view module-content-box">
    <!-- 未初始化设备 -->
    <div class="sf-filter-container">
      <p class="tip-area">
        <span>下载</span>
        <el-link @click="handleDownload">《设备箱ip数据》</el-link>
      </p>

      <uploadComponent
        :show-list="false"
        url="/tempDeviceInfo/importDevice"
        button-text="批量导入设备ip"
        @success="handleSuccess"
      />
      <el-button
        type="primary"
        class="filter-item"
        @click="updateIp"
      >
        修改设备ip信息
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      class="el-table--outline-border"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="45"
      />
      <!-- 序号 -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
      />

      <!-- 名称 -->
      <el-table-column label="mac地址">
        <template slot-scope="scope">
          <span>{{ scope.row.mac }}</span>
        </template>
      </el-table-column>

      <!-- 编号 -->
      <el-table-column label="设备ip">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <!-- 描述 -->
      <el-table-column label="子网掩码" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.mask }}</span>
        </template>
      </el-table-column>

      <el-table-column label="网关">
        <template slot-scope="scope">
          <span>{{ scope.row.gateway }}</span>
        </template>
      </el-table-column>

      <el-table-column label="服务器ip">
        <template slot-scope="scope">
          <span>{{ scope.row.serverIp }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ ipUpdateStatusText[scope.row.resultStatus] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="260"
        align="center"
      >
        <template slot-scope="{ row }">
          <FUOperationBar
            :list="operation.list"
            :split-number="4"
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
        :page-sizes="[10,20,50]"
        :page-size.sync="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <!-- 弹框: 新增/编辑 -->
    <DialogContainerized
      title="编辑"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <TempDeviceInfoEdit
        v-if="editDialog.visible"
        :params="editDialog.params"
        :is-new="editDialog.isNew"
        @cancel="editDialog.visible=false"
        @completed="editOnSuccess"
      />
    </DialogContainerized>

  </div>
</template>

<script>
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import ipInfoApi from '@/api/ipInfo'
import uploadComponent from '@/components/UploadComponents'
import TempDeviceInfoEdit from './components/TempDeviceInfoEdit'
import { ipUpdateStatusText } from '@/config/const/device/device-status'

export default {
  name: 'TempDeviceInfo',
  components: { FUOperationBar, DialogContainerized, TempDeviceInfoEdit, uploadComponent },
  data() {
    return {
      ipUpdateStatusText,
      operation: {
        list: [
          {
            label: '编辑',
            command: 'edit',
          },
          {
            label: '删除',
            command: 'delete',
            variant: 'danger',
          },
        ],
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
      },
      editDialog: {
        visible: false,
        isNew: false,
        params: {
          id: '',
        },
      },
      multipleSelection: [],
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
      ipInfoApi.findPage(this.listQuery).then(res => {
        this.relaStatusMap = res.data.relaStatusMap
        this.list = res.data.result
        this.total = res.data.total
        this.listLoading = false
        if (this.list.length < 1 && this.listQuery.pageNumber > 1) {
          this.listQuery.pageNumber--
          this.getList()
        }
      })
    },
    handleDownload() {
      ipInfoApi.fetchTemplate()
    },
    handleSuccess() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleSelectionChange(val) {
      // 全选
      this.multipleSelection = val
    },
    updateIp() {
      // 批量删除
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.id)
      })
      const params = ids.join(',')
      ipInfoApi.updateIp({ ids: params }).then(res => {
        this.$message({
          message: res.message,
          type: 'success',
        })
        this.reloadList()
      })
    },
    handleOperationBarCommand(command, row) {
      const id = row.id
      switch (command) {
        case 'edit':
          this.openEditDialog({
            id: row.id,
          })
          break

        case 'delete':
          this.handleDel(id)
          break
        default:
      }
    },
    openEditDialog(params, isNew) {
      const dialog = this.editDialog
      const open = () => {
        dialog.isNew = !!isNew
        dialog.params = params
        dialog.visible = true
      }

      if (!dialog.visible) {
        open()
        return
      }

      dialog.visible = false
      this.$nextTick(() => {
        if (dialog.visible) {
          console.warn('This dialog may be controlled simultaneously by more than two places,' +
            ' which can cause unknown problems')
        }
        open()
      })
    },

    handleDel(id) {
      this.$confirm('你确定要删除吗？').then(() => {
        this.delData(id)
      })
    },

    delData(id) {
      ipInfoApi.del({ 'id': id }).then(ret => {
        if (ret.success) {
          this.$message({
            message: ret.message,
            type: 'success',
          })
          this.getList()
        }
      })
    },

    editOnSuccess() {
      this.editDialog.visible = false
      this.reloadList()
    },
  },
}
</script>

<style lang="scss" scoped>

.top-search{
    display: inline-table;
    margin-right: 30px;
    p{
        width: 80px;
        height: 100%;
        margin: 0;
        padding: 0;
        margin-bottom: 10px;
        display: inline-table;
    }
    .filter-item{
        .el-input__inner{
            height: 30px;
            padding: 0;
        }
    }
}

</style>
