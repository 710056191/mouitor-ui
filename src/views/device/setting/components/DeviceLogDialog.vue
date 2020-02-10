<template>
  <div class="manufacturer-container-view module-content-box">

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
      <el-table-column label="点位编号" prop="selfCode" width="100px" />

      <!-- 编号 -->
      <el-table-column label="设备名称" prop="devName" />

      <!-- 描述 -->
      <el-table-column label="网络IP" prop="ip" width="200" />

      <el-table-column label="操作用户" prop="userName" />

      <el-table-column label="操作状态" prop="operation" />

      <el-table-column label="原因" prop="detail" />

      <el-table-column label="时间" prop="updateTime" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

    </el-table>

    <!-- 页码 -->
    <div class="sf-table-heel-pagination">
      <el-pagination
        v-show="total>0"
        :total="total"
        :current-page.sync="listQuery.pageNumber"
        :page-size.sync="listQuery.pageSize"
        @current-change="getList"
        @size-change="getList"
      />
    </div>

  </div>
</template>

<script>
import deviceApi from '@/api/device'
export default {
  name: 'DeviceLog',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
      },
      temp: {},
      rules: {
        contractCode: [{ required: true, message: '请输入合同编号', trigger: 'change' }],
        manufacturerCode: [{ required: true, message: '请输入采购商', trigger: 'change' }],
      },
    }
  },
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      deviceApi.getLog(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total
        this.listLoading = false
        if (!this.list || this.list.length < 1) {
          this.listQuery.pageNumber--
          this.getList()
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
