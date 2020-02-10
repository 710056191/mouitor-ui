<template>
  <div class="grouping-manage-view module-content-box">
    <div class="sf-filter-container">
      <el-input
        v-model="listQuery.userName"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        :clearable="true"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />

      <!-- <el-input
        v-model="listQuery.devGroupName"
        placeholder="设备组名称"
        style="width: 200px;"
        class="filter-item"
        :clearable="true"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      /> -->

      <el-input
        v-model="listQuery.devName"
        placeholder="设备名称"
        style="width: 200px;"
        class="filter-item"
        :clearable="true"
        @clear="handleFilter"
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

    <div class="sf-table-top-toolbar">
      <div class="inner">
        <el-button
          type="primary"
          class="filter-item"
          @click="handleAdd"
        >
          关联管理员
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

      <!-- 名称 -->
      <el-table-column label="用户名" prop="username" />

      <!-- 描述 -->
      <el-table-column label="设备名称" prop="devName" />

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="100">
        <!-- <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDel(scope.row.relationid)" />
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

    <!-- 弹框：新增 -->
    <DialogContainerized
      v-if="createDialog"
      title="关联管理员"
      :visible.sync="createDialog"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <select-device-to-user
        @success="addOnSuccess"
        @cancel="createDialog=false"
      />
    </DialogContainerized>
  </div>
</template>

<script>
import { fetchDeviceUserList, delDeviceUser } from '@/api/deviceUserManage'
import SelectDeviceToUser from '@/views/device/components/SelectDeviceToUser'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'DeviceUserManage',
  components: {
    FUOperationBar,
    SelectDeviceToUser,
    DialogContainerized,
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        userName: '',
        devGroupName: '',
        devName: '',
        pageNumber: 1,
        pageSize: 10,
      },
      operation: {
        list: [
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },
      temp: {},
      rules: {
        contractCode: [{ required: true, message: '请输入合同编号', trigger: 'change' }],
        manufacturerCode: [{ required: true, message: '请输入采购商', trigger: 'change' }],
      },
      updateDialog: false,
      createDialog: false,
    }
  },
  activated() {
    this.getList()
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchDeviceUserList(this.listQuery).then(res => {
        this.list = res.data.list.map(item => {
          return Object.assign({}, item.defineGroup, item.device, item.platUser, item.usrDevRelation)
        })
        this.total = res.data.page.total
        this.listLoading = false
        if ((!this.list || this.list.length < 1) && this.listQuery.pageNumber > 1) {
          this.listQuery.pageNumber--
          this.getList()
        }
      })
    },
    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleDel(id) {
      this.$confirm('你确定要永久删除该供应商数据吗？').then(() => {
        this.delData(id)
      })
    },
    delData(id) {
      delDeviceUser(id).then(ret => {
        if (ret.success) {
          this.$message({
            message: ret.message,
            type: 'success',
          })
          this.getList()
        }
      })
    },
    handleAdd() {
      this.temp = { }
      this.createDialog = true
    },
    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'delete':
          this.handleDel(row.relationid)
          break

        default:
          console.warn('unknown command:', command)
          break
      }
    },
    addOnSuccess(ret) {
      this.$message({
        message: ret.message,
        type: 'success',
      })
      this.getList()
      this.createDialog = false
    },
  },
}
</script>

<style lang="scss">

</style>
