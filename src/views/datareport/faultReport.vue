<template>
  <div class="faultRecort-view module-content-box">
    <div class="sf-filter-container">
      <span class="filter-item">
        <el-date-picker
          v-model="listQuery.daterange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </span>

      <span class="filter-item">
        <el-date-picker
          v-model="listQuery.endDate2"
          type="date"
          placeholder="结束日期"
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

      <span class="filter-item">
        <el-select v-model="listQuery.electricManufacturer" placeholder="请选择电力供应商" clearable>
          <el-option
            v-for="m in listElectricManufacturer"
            :key="m.value"
            :label="m.manufacturerName"
            :value="m.manufacturerId"
          />
        </el-select>
      </span>

      <span class="filter-item">
        <el-select v-model="listQuery.alarmDesc" placeholder="请选择报警项" clearable>
          <el-option
            v-for="al in alarmList"
            :key="al.value"
            :label="al"
            :value="al"
          />
        </el-select>
      </span>

      <span class="filter-item">
        <el-select v-model="listQuery.devTypeId" placeholder="请选择设备类型" clearable>
          <el-option
            v-for="devType in deviceTypeList"
            :key="devType.value"
            :label="devType.typeName"
            :value="devType.id"
          />
        </el-select>
      </span>

      <el-button
        type="primary"
        class="filter-item"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>

    </div>

    <div class="sf-table-top-toolbar">
      <div class="inner">
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
      <el-table-column label="电力供应商">
        <template slot-scope="scope">
          <span>{{ scope.row.electricManufacturer }}</span>
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
      <el-table-column label="开始时间">
        <template slot-scope="scope">
          <span v-if="scope.row.startTime != null">{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime != null">{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警时长">
        <template slot-scope="scope">
          <span>{{ scope.row.timeLong }}</span>
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

  </div>
</template>

<script>
import { findPage, findPDFOrExcel, select } from '@/api/report'
import manufacturerApi from '@/api/manufacturer'
import { format as dateFormat } from 'date-fns'

export default {
  name: 'FaultReport',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      totalManufacturerList: '',
      listNetManufacturer: '',
      listElectricManufacturer: '',
      alarmList: '',
      deviceTypeList: '',
      listQuery: {
        selfCode: '',
        selfLocation: '',
        daterange: [],
        endDate1: '',
        endDate2: '',
        type: '3',
        totalManufacturer: '',
        networkManufacturer: '',
        electricManufacturer: '',
        alarmDesc: '',
        devTypeId: '',
        pageNumber: 1,
        pageSize: 10,
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
    manufacturerApi.listElectricManufacturer().then(res => {
      this.listElectricManufacturer = res.data
    })
    select().then(res => {
      this.alarmList = res.data.alarmList
      this.deviceTypeList = res.data.deviceTypes
    })
  },
  methods: {
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
  },
}
</script>

<style lang="scss">

</style>
