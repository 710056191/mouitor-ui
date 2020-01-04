<template>
  <div class="grouping-manage-view module-content-box">
    <div class="sf-filter-container">
      <el-input
        v-model="listQuery.setName"
        placeholder="时间设置名称"
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
          新增补光灯时间
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
      <el-table-column label="时间设置编号" prop="setCode" />

      <!-- 编号 -->
      <el-table-column label="时间设置名称" prop="setName" />

      <!-- 描述 -->
      <el-table-column label="日期范围" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}~{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间范围" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.openTime | parseTime('{h}:{i}:{s}') }}~{{ scope.row.closeTime | parseTime('{h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <!-- <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" circle @click="handleUpdate(scope.row.setId)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDel(scope.row.setId)" />
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
      title="新增补光灯时间"
      :visible.sync="createDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form ref="createForm" :model="temp" :rules="rules" label-width="120px">
        <el-form-item label="时间设置编号" prop="setCode">
          <el-input v-model="temp.setCode" placeholder="时间设置编号" />
        </el-form-item>
        <el-form-item label="时间设置名称" prop="setName">
          <el-input v-model="temp.setName" placeholder="时间设置名称" />
        </el-form-item>
        <el-form-item label="日期范围" prop="date">
          <el-date-picker
            v-model="temp.date"
            type="daterange"
            format="MM-dd"
            value-format="MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="el-select-full"
          />
        </el-form-item>
        <el-form-item label="时间范围" prop="time">
          <el-time-picker
            v-model="temp.time"
            is-range
            range-separator="至"
            value-format="HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            class="el-select-full"
          />
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
      title="编辑补光灯时间"
      :visible.sync="updateDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form ref="updateForm" :model="temp" :rules="rules" label-width="120px">
        <el-form-item label="时间设置编号" prop="setCode">
          <el-input v-model="temp.setCode" placeholder="时间设置编号" />
        </el-form-item>
        <el-form-item label="时间设置名称" prop="setName">
          <el-input v-model="temp.setName" placeholder="时间设置名称" />
        </el-form-item>
        <el-form-item label="日期范围" prop="date">
          <el-date-picker
            v-model="temp.date"
            type="daterange"
            range-separator="至"
            format="MM-dd"
            value-format="MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="el-select-full"
          />
        </el-form-item>
        <el-form-item label="时间范围" prop="time">
          <el-time-picker
            v-model="temp.time"
            is-range
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            class="el-select-full"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </span>
    </DialogContainerized>
    <!-- 弹框：编辑 -->

  </div>
</template>

<script>
import { fetchLightTimeSetList, delLightTimeSet, findLightTimeSetById, updateLightTimeSet, addLightTimeSet } from '@/api/lightTimeSet'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'LightTimeSet',
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
        setName: '',
        pageNumber: 1,
        pageSize: 10,
      },
      operation: {
        list: [
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },
      temp: {},
      rules: {
        setCode: [{ required: true, message: '请输入时间设置编号', trigger: 'change' }],
        setName: [{ required: true, message: '请输入时间设置名称', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期范围', trigger: 'change' }],
        time: [{ required: true, message: '请选择时间范围', trigger: 'change' }],
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
      fetchLightTimeSetList(this.listQuery).then(res => {
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
      this.$confirm('你确定要永久删除该补光灯时间数据吗？').then(() => {
        this.delData(id)
      })
    },
    delData(id) {
      delLightTimeSet(id).then(ret => {
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
      this.temp = { date: [], time: [new Date(), new Date()] }
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs['createForm'].clearValidate()
      })
    },
    addData() {
      this.$refs['createForm'].validate((validate) => {
        if (validate) {
          this.temp.startDate = this.temp.date[0]
          this.temp.endDate = this.temp.date[1]
          this.temp.openTime = this.temp.time[0]
          this.temp.closeTime = this.temp.time[1]
          addLightTimeSet(this.temp).then(ret => {
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
      findLightTimeSetById(id).then(ret => {
        const { setId, setCode, setName, startDate, endDate } = ret.data
        const start = startDate.split('|')
        const end = endDate.split('|')
        this.temp = {
          setId: setId,
          setCode: setCode,
          setName: setName,
          date: [start[0], end[0]],
          time: [start[1], end[1]],
        }
        this.updateDialog = true
        this.$nextTick(() => {
          this.$refs['updateForm'].clearValidate()
        })
      })
    },
    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'edit':
          this.handleUpdate(row.setId)
          break

        case 'delete':
          this.handleDel(row.setId)
          break

        default:
          console.warn('unknown command:', command)
          break
      }
    },
    updateData() {
      this.$refs['updateForm'].validate((validate) => {
        if (validate) {
          this.temp.startDate = this.temp.date[0]
          this.temp.endDate = this.temp.date[1]
          this.temp.openTime = this.temp.time[0]
          this.temp.closeTime = this.temp.time[1]
          updateLightTimeSet(this.temp).then(ret => {
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
  },
}
</script>

<style lang="scss">

</style>
