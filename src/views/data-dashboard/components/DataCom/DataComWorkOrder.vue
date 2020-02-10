<template>
  <DataComWrapper
    title="工单进度统计"
  >
    <div class="data-com-work-order">
      <!--  -->
      <el-table
        :data="info.list"
        height="310px"
      >
        <el-table-column
          prop="workOrderNumber"
          label="工单"
        />
        <el-table-column
          prop="alarmAddress"
          label="设备名称"
        />
        <el-table-column
          label="进度"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color:#ffd52b">待维修</span>
            <span v-if="scope.row.status == 1" style="color:#ffd52b">维修中</span>
            <span v-if="scope.row.status == 3" style="color:#ffd52b">维修完成</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </DataComWrapper>
</template>

<script>
import DataComWrapper from './common/DataComWrapper'
import DataComponent from './mixins/data-component'
export default {
  name: 'DataComWorkOrder',

  components: { DataComWrapper },

  mixins: [DataComponent],

  data() {
    return {
      list: [{
        work_order: '骏和广场项目',
        signed: '完成',
        construction: '进行中',
        maintain: '未开始',
      }],
    }
  },

  methods: {
    handleChartInfo() {
      // console.log(this.info)
    },
  },
}
</script>

<style lang="scss" scoped>
.data-com-work-order {
  display: flex;

  min-height: 250px;
  .el-table,/deep/ .el-table tr,/deep/ .el-table th,/deep/ .el-table td{
    background-color: transparent;
    border: none;
  }

  /deep/ .el-table td{
    color: #288dff;
    font-size: 16px;
  }

  /deep/ .el-table__body tr:hover,/deep/ .el-table__body tr:hover>td{
    background-color: #18478b
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar{
    display: none;
  }
  .el-table::before{
    background-color: transparent;
  }
  .el-table{
    margin-top: 10px
  }

  /deep/ .el-table__header thead tr th .cell{
    font-size: 16px;
  }

  /deep/ .el-table__body tbody tr td .cell{
    overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
  }

  /deep/ .el-table__body tbody tr{
    padding:2px 0
  }

}
</style>
