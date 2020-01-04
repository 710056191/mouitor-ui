<template>
  <div class="manufacturer-view module-content-box">

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
      <el-table-column label="点位编号">
        <template slot-scope="scope">
          <span>{{ scope.row.device.selfCode }}</span>
        </template>
      </el-table-column>

      <!-- 编号 -->
      <el-table-column label="设备名称">
        <template slot-scope="scope">
          <span>{{ scope.row.device.devName }}</span>
        </template>
      </el-table-column>

      <!-- 描述 -->
      <el-table-column label="网络IP" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.device.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="监控名称">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorItem.itemName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="监控项下限值">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorSet.lowlValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="监控项上限值">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorSet.upperValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="监控项度量单位">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorItem.itemUnit }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="100px">
        <!-- <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" circle @click="handleUpdate(scope.row.monitorSet.setid, scope.row.monitorItem.itemCode)" />
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

    <!-- 弹框：编辑 -->
    <DialogContainerized
      v-if="updateDialog"
      title="编辑设备阈值"
      :visible.sync="updateDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form ref="updateForm" :model="temp.monitorSet" :rules="rules" label-width="100px">
        <el-form-item label="下限值" prop="lowlValue">
          <el-input v-model="temp.monitorSet.lowlValue" type="number" placeholder="下限值" />
        </el-form-item>
        <el-form-item label="上限值" prop="upperValue">
          <el-input v-model="temp.monitorSet.upperValue" type="number" placeholder="上限值" />
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
import tsApi from '@/api/thresholdSetting'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'DeviceSettingThreshold',
  components: {
    FUOperationBar,
    DialogContainerized,
  },
  // props: {
  //   tsId: { type: Number, default: undefined },
  //   tsIp: { type: String, default: undefined },
  // },
  data() {
    return {
      list: [],
      total: 0,
      tsId: '',
      tsIp: '',
      listLoading: true,
      updateDialog: false,
      listQuery: {
        isThirdDev: '',
        pageNumber: 1,
        pageSize: 10,
      },
      operation: {
        list: [
          { label: '编辑', command: 'edit' },
        ],
      },
      temp: {},
      device: {},
      des: {
        MONITOR: {},
        CAMERA: { S0008: '摄像机', S0010: '摄像机' },
        FILLLIGTH: { S0008: '补光灯、爆光灯', S0010: '补光灯、爆光灯' },
        FAN: { S0008: '风扇' },
        MODEM: { S0008: '光猫' },
        HEATER: { S0004: '加热器' },
      },
      rules: {
        lowlValue: [{ required: true, message: '请输入下限值', trigger: 'change' }],
        upperValue: [{ required: true, message: '请输入上限值', trigger: 'change' }],
      },
    }
  },
  activated() {
    this.tsId = this.$route.query.tsId
    this.tsIp = this.$route.query.tsIp
    this.listQuery.isThirdDev = this.$route.query.isThirdDev
    this.getList()
  },
  created() {
    this.tsId = this.$route.query.tsId
    this.tsIp = this.$route.query.tsIp
    this.listQuery.isThirdDev = this.$route.query.isThirdDev
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.devId = this.tsId
      tsApi.fetchList(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total
        this.listLoading = false
        if ((!this.list || this.list.length < 1) && this.listQuery.pageNumber > 1) {
          this.listQuery.pageNumber--
          this.getList()
        }
      })
    },
    handleUpdate(id, code) {
      tsApi.getById(id).then(ret => {
        this.temp = ret.data
        this.temp.update_code = code
        this.updateDialog = true
        this.$nextTick(() => {
          this.$refs['updateForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['updateForm'].validate(validate => {
        if (validate) {
          if (this.temp.update_code === 'S0010') {
            if ((this.temp.monitorSet.lowlValue !== '0' && this.temp.monitorSet.upperValue !== '0') || (this.temp.monitorSet.lowlValue !== '1' && this.temp.monitorSet.upperValue !== '1')) {
              this.$confirm('直流标识的上下值同为0，交流标识上下值同为1', '提示', {
                type: 'warning',
                center: true,
              }).then(() => {
                return
              }).catch(() => {
                return
              })
            }
          }
          tsApi.update({ devid: this.temp.monitorSet.devid, setid: this.temp.monitorSet.setid, lowlValue: this.temp.monitorSet.lowlValue, upperValue: this.temp.monitorSet.upperValue }).then(ret => {
            this.$message({
              message: ret.message,
              type: 'success',
            })
            this.getList()
            this.updateDialog = false
          })
        }
      })
    },
    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'edit':
          this.handleUpdate(row.monitorSet.setid, row.monitorItem.itemCode)
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
