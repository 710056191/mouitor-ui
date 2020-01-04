<!-- 状态报告组件 -->
<template>
  <div class="content">
    <el-row>
      <div>状态报告</div>
    </el-row>
    <div style="border:1px solid #ccc" class="basecontent">
      <el-row>
        <el-col style="height:13px;" />
      </el-row>
      <el-row>
        <el-col :span="10">
          设备箱状态
        </el-col>
        <el-col :span="14">
          {{ statusText[data.status] }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          状态描述
        </el-col>
        <el-col :span="14">
          {{ data.alarmDesc }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          警报代码
        </el-col>
        <el-col :span="14">
          {{ data.alarmCode }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          警报描述
        </el-col>
        <el-col :span="14">
          {{ data.alarmDesc }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          当前温度
        </el-col>
        <el-col :span="14">
          {{ data.lastTemperature }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          当前湿度
        </el-col>
        <el-col :span="14">
          {{ data.lastDampness }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          电源电压
        </el-col>
        <el-col :span="14">
          {{ data.last12voltage }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          电源电流
        </el-col>
        <el-col :span="14">
          {{ data.last24voltage }}
        </el-col>
      </el-row>
      <el-row>
        <el-col style="height:13px;padding-right:5px" />
      </el-row>
      <el-row>
        <el-col style="height:13px;padding-right:5px" />
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusReport',
  props: ['data', 'statusText'],
  data() {
    return {

    }
  },
}
</script>

<style lang="scss" scoped>
.content {
    margin-bottom: 5px;
    .basecontent{
        margin-top: 20px;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 4px;
        .el-row:nth-child(2n){
            background: #eee;
        }
        .el-row{
            padding: 3px;
            .el-col-10{
                padding-left: 15px;
                box-sizing: border-box;
            }
            .el-col-14{
                text-align: right;
                padding-right: 10px;
                box-sizing: border-box;
            }
            .el-col{
                font-size: 12px
            }
        }
    }
}

</style>
