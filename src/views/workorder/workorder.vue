<template>
  <div class="sys-workorder-view module-content-box">
    <div class="sf-filter-container">
      <el-input
        v-model="listQuery.workOrderNumber"
        placeholder="工单号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        type="primary"
        class="filter-item"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>

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
      <el-table-column label="工单号">
        <template slot-scope="scope">
          <span>{{ scope.row.workOrderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修人员">
        <template slot-scope="scope">
          <span>{{ scope.row.accendantName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点位号">
        <template slot-scope="scope">
          <span>{{ scope.row.selfCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警情况">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度状态" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0" class="red">待维修</span>
          <span v-if="scope.row.status == 1" class="red">维修中</span>
          <span v-if="scope.row.status == 3">维修完成</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <!--<template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="handleDelete(scope.row.id)" />
          </el-tooltip>
        </template>-->
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
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 弹框：编辑 -->
    <DialogContainerized
      title="编辑进度状态"
      :visible.sync="dialogFormVisibleEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-steps :space="200" :active="active" finish-status="success">
        <el-step title="待维修" />
        <el-step title="维修中" />
        <el-step title="维修完成" />
      </el-steps>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm()">下一步</el-button>
      </span>
    </DialogContainerized>

  </div>
</template>

<script>
import manufacturerApi from '@/api/manufacturer'
import workorderApi from '@/api/workorder'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'Workorder',
  components: {
    FUOperationBar,
    DialogContainerized,
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      totalManufacturerList: null,
      active: 0,
      checkedAlarms: [],
      alarms: [],
      listQuery: {
        workOrderNumber: '',
        pageNumber: 1,
        pageSize: 10,
      },
      operation: {
        list: [
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },
      dialogFormVisibleEdit: false,
      dialogFormVisibleAdd: false,
      formEdit: {
        id: null,
      },
      formAdd: {
        name: '',
        receiveType: null,
        phoneNumber: '',
        manufacturerId: null,
        mail: '',
      },
    }
  },
  created() {
    this.getList()
    manufacturerApi.listTotalManufacturer().then(res => {
      this.totalManufacturerList = res.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      workorderApi.findPage(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val
      this.getList()
    },
    handleEdit(obj) {
      this.dialogFormVisibleEdit = true
      this.formEdit = obj
      const status = obj.status
      if (status === '0') {
        this.active = 0
      } else if (status === '1') {
        this.active = 1
      } else {
        this.active = 3
      }
    },
    editConfirm() {
      let nextStatus
      if (this.active === 0) {
        nextStatus = '1'
      } else if (this.active === 1) {
        nextStatus = '3'
      } else if (this.active === 3) {
        this.$message('进度已完成')
        return
      }
      workorderApi.updateStatus({ id: this.formEdit.id, status: nextStatus }).then(res => {
        if (res.success) {
          this.$message({ message: '修改成功', type: 'success' })
        } else {
          this.$message({ message: res.message, type: 'error' })
        }
        this.dialogFormVisibleEdit = false
        this.getList()
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除数据吗').then(() => {
        workorderApi.deleteWorkorder({ id: id }).then(res => {
          if (res.success) {
            this.$message({ message: '删除成功', type: 'success' })
          } else {
            this.$message({ message: res.message, type: 'error' })
          }
          this.getList()
        })
      })
    },
    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'edit':
          this.handleEdit(row)
          break
        case 'delete':
          this.handleDelete(row.id)
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
