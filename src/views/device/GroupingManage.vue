<template>
  <div class="grouping-manage-view module-content-box">
    <div class="sf-filter-container">
      <el-input
        v-model="listQuery.devGroupCode"
        placeholder="分组代码"
        style="width: 200px;"
        class="filter-item"
        :clearable="true"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.devGroupName"
        placeholder="分组名称"
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
          新增设备分组
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
      <el-table-column label="分组代码" prop="devGroupCode" />

      <!-- 编号 -->
      <el-table-column label="分组名称" prop="devGroupName" />

      <!-- 描述 -->
      <el-table-column label="分组描述" prop="devGroupDesc" />

      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
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
        :page-sizes="[10,20,50]"
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
      title="新增设备分组"
      :visible.sync="createDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form
        ref="createForm"
        :model="temp"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="分组代码" prop="devGroupCode">
          <el-input v-model="temp.devGroupCode" placeholder="分组代码" />
        </el-form-item>
        <el-form-item label="分组名称" prop="devGroupName">
          <el-input v-model="temp.devGroupName" placeholder="分组名称" />
        </el-form-item>
        <el-form-item label="分组描述" prop="devGroupDesc">
          <el-input v-model="temp.devGroupDesc" placeholder="分组描述" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false">取消</el-button>
        <el-button type="primary" @click="addData">确定</el-button>
      </span>
    </DialogContainerized>

    <!-- 弹框：编辑 -->
    <DialogContainerized
      v-if="updateDialog"
      title="编辑设备分组"
      :visible.sync="updateDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form
        ref="updateForm"
        :model="temp"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="分组代码" prop="devGroupCode">
          <el-input v-model="temp.devGroupCode" placeholder="分组代码" />
        </el-form-item>
        <el-form-item label="分组名称" prop="devGroupName">
          <el-input v-model="temp.devGroupName" placeholder="分组名称" />
        </el-form-item>
        <el-form-item label="分组描述" prop="devGroupDesc">
          <el-input v-model="temp.devGroupDesc" placeholder="分组描述" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </span>
    </DialogContainerized>
  </div>
</template>

<script>
import {
  fetchGroupingManageList,
  delGroupingManage,
  findGroupingManageById,
  updateGroupingManage,
  addGroupingManage,
} from '@/api/groupingManage'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'GroupingManage',
  components: {
    FUOperationBar,
    DialogContainerized,
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        devGroupCode: '',
        devGroupName: '',
        pageNumber: 1,
        pageSize: 10,
      },
      temp: {},
      rules: {
        devGroupCode: [{ required: true, message: '请输入分组代码', trigger: 'change' }],
        devGroupName: [{ required: true, message: '请输入分组名称', trigger: 'change' }],
      },
      updateDialog: false,
      createDialog: false,
      operation: {
        list: [
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },
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
      fetchGroupingManageList(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total
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
      this.$confirm('你确定要永久删除该分组数据吗？').then(() => {
        this.delData(id)
      })
    },
    delData(id) {
      delGroupingManage(id).then(ret => {
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
      this.temp = { contractDate: [] }
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs['createForm'].clearValidate()
      })
    },
    addData() {
      this.$refs['createForm'].validate((validate) => {
        if (validate) {
          addGroupingManage(this.temp).then(ret => {
            if (ret.success) {
              this.$message({
                message: ret.message,
                type: 'success',
              })
              this.getList()
              this.createDialog = false
            }
          })
        }
      })
    },
    handleUpdate(id) {
      this.temp = { }
      findGroupingManageById(id).then(ret => {
        const { devGroupId, devGroupCode, devGroupName, devGroupDesc } = ret.data

        this.temp = {
          devGroupId: devGroupId,
          devGroupCode: devGroupCode,
          devGroupName: devGroupName,
          devGroupDesc: devGroupDesc,
        }
        this.updateDialog = true
        this.$nextTick(() => {
          this.$refs['updateForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['updateForm'].validate((validate) => {
        if (validate) {
          updateGroupingManage(this.temp).then(ret => {
            if (ret.success) {
              this.$message({
                message: ret.message,
                type: 'success',
              })
              this.getList()
              this.updateDialog = false
            }
          })
        }
      })
    },

    handleOperationBarCommand(command, row) {
      const id = row.devGroupId

      switch (command) {
        case 'edit':
          this.handleUpdate(id)
          break

        case 'delete':
          this.handleDel(id)
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
