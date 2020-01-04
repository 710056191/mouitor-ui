<template>
  <div class="netRecort-view module-content-box">
    <div class="sf-filter-container">
      <span class="filter-item">
        <el-date-picker
          v-model="listQuery.daterange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </span>
      <el-input
        v-model="listQuery.selfCode"
        placeholder="点位编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.selfLocation"
        placeholder="点位位置"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-item">
        <el-select v-model="listQuery.totalManufacturer" placeholder="请选择总包商" clearable>
          <el-option
            v-for="m in totalManufacturerList"
            :key="m.value"
            :label="m.manufacturerName"
            :value="m.manufacturerId"
          />
        </el-select>
      </span>
      <span class="filter-item">
        <el-select v-model="listQuery.networkManufacturer" placeholder="请选择网络供应商" clearable>
          <el-option
            v-for="m in listNetManufacturer"
            :key="m.value"
            :label="m.manufacturerName"
            :value="m.manufacturerId"
          />
        </el-select>
      </span>

      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">搜索</el-button>

    </div>

    <div class="sf-table-top-toolbar">
      <div class="inner">
        <el-button
          type="primary"
          class="filter-item"
          @click="calculateFee"
        >
          计算费用
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="exportPDFAndExcel('PDF')"
        >
          导出PDF
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="exportPDFAndExcel('EXCEL')"
        >
          导出Excel
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
      <el-table-column label="点位编号">
        <template slot-scope="scope">
          <span>{{ scope.row.selfCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点位位置">
        <template slot-scope="scope">
          <span>{{ scope.row.selfLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总包商">
        <template slot-scope="scope">
          <span>{{ scope.row.totalManufacturer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网络供应商">
        <template slot-scope="scope">
          <span>{{ scope.row.networkManufacturer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警项">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.startTime != null">{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime != null">{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警时长" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.timeLong }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原始扣费(元)">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="减金额(元)">
        <template slot-scope="scope">
          <span>{{ scope.row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际扣费(元)">
        <template slot-scope="scope">
          <span>{{ scope.row.actualFee }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="申诉" align="center" width="100">
        <!-- <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" circle @click="handleUpdate(scope.row.alarmAnalyzeId)" />
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
      :title="editDialog.isNew ? '编辑网络计费' : '编辑网络计费'"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="800px"
    >
      <networkReportEdit
        v-if="editDialog.visible"
        :params="editDialog.params"
        :is-new="editDialog.isNew"
        @completed="editOnSuccess"
        @cancel="editDialog.visible=false"
      />
    </DialogContainerized>

  </div>
</template>

<script>
import { findPage, findPDFOrExcel, calculateFeeApi } from '@/api/report'
import manufacturerApi from '@/api/manufacturer'
import { format as dateFormat } from 'date-fns'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import networkReportEdit from './components/networkReportEdit'

export default {
  name: 'User',
  components: {
    FUOperationBar,
    DialogContainerized,
    networkReportEdit,
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      totalManufacturerList: '',
      listNetManufacturer: '',
      manufacturerId: '',
      editDialog: {
        visible: false,
        isNew: false,
        params: {
          id: '',
        },
      },
      listQuery: {
        selfCode: '',
        selfLocation: '',
        daterange: [],
        endDate1: '',
        endDate2: '',
        type: '2',
        devTypeId: '1',
        file: 'PDF',
        alarmDesc: '网络已断开',
        totalManufacturer: '',
        networkManufacturer: '',
        pageNumber: 1,
        pageSize: 10,
      },
      operation: {
        list: [
          { label: '编辑', command: 'edit' },
        ],
      },
      dialogFormVisibleEdit: false,
      dialogFormVisibleAdd: false,
      dialogFormVisibleSetResource: false,
      formEdit: {
        applier: null,
        approver: '',
        applyDate: '',
        discount: '',
        reason: '',
      },
    }
  },
  created() {
    this.getList()
    manufacturerApi.listTotalManufacturer().then(res => {
      this.totalManufacturerList = res.data
    })
    manufacturerApi.listNetManufacturer().then(res => {
      this.listNetManufacturer = res.data
    })
  },
  methods: {
    reloadList(...args) {
      this.getList(...args)
    },
    getList() {
      this.listLoading = true
      findPage(this.listQuery).then(res => {
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
    handleUpdate() {
      this.dialogFormVisibleEdit = true
    },
    exportPDFAndExcel(file) {
      const startDate = this.listQuery.daterange[0]
      const endDate = this.listQuery.daterange[1]
      if (startDate === '' && endDate === '') {
        this.$message('请选择统计日期范围')
        return
      }
      if (startDate > endDate) {
        this.$message('起始日期不能大于结束日期')
        return
      }
      this.listQuery.endDate1 = startDate ? dateFormat(startDate, 'YYYY-MM-DD') : ''
      this.listQuery.endDate2 = endDate ? dateFormat(endDate, 'YYYY-MM-DD') : ''
      this.listQuery.file = file
      findPDFOrExcel(this.listQuery)
    },
    calculateFee() {
      const startDate = this.listQuery.endDate1
      const endDate = this.listQuery.endDate2
      if (startDate > endDate) {
        this.$message('起始日期不能大于结束日期')
        return
      }
      console.log('开始计算费用')
      calculateFeeApi(this.listQuery).then(res => {
        if (res.success) {
          this.$message({ message: res.message, type: 'success' })
          this.getList()
        } else {
          this.$message({ message: res.message, type: 'error' })
        }
      })
    },
    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'edit':
          this.openEditDialog({ id: row.alarmAnalyzeId })
          break

        default:
          console.warn('unknown command:', command)
          break
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

    editOnSuccess() {
      this.editDialog.visible = false
      this.reloadList()
    },
  },
}
</script>

<style lang="scss">

</style>
