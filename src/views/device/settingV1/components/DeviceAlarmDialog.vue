<template>
  <div class="manufacturer-container">

    <el-table
      v-loading="listLoading"
      :data="list"
      class="el-table--outline-border"
      stripe
      height="500"
    >
      <!-- 序号 -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
      />

      <!-- 名称 -->
      <el-table-column label="点位编号" width="100">
        <template>
          <span>{{ device.selfCode }}</span>
        </template>
      </el-table-column>

      <!-- 编号 -->
      <el-table-column label="点位位置" width="150">
        <template>
          <span>{{ device.selfLocation }}</span>
        </template>
      </el-table-column>

      <!-- 描述 -->
      <el-table-column label="设备名称">
        <template>
          <span>{{ device.devName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="网络IP" width="200">
        <template>
          <span>{{ device.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="警报描述" prop="alarmDesc" />

      <el-table-column label="时间" prop="updateTime" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
import deviceApi from '@/api/device'
export default {
  name: 'DeviceAlarm',
  props: {
    alarmId: { type: Number, default: undefined },
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
      },
      temp: {},
      device: {},
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
      deviceApi.findDevAlarm(this.alarmId).then(res => {
        this.list = res.data.alarmList
        this.device = res.data.device
        this.listLoading = false
      })
    },
  },
}
</script>

<style lang="scss">

</style>
