<template>
  <div class="fee-rule-view module-content-box">
    <el-row>

      <el-col :span="4">
        <h4>计费方式:</h4>
        <el-radio-group v-model="Ruleradio" @change="contractRadio(Ruleradio,'rule')">
          <el-radio style="display:block;margin:10px 5px;" label="1">分段收费</el-radio>
          <el-radio style="display:block;margin:10px 5px;" label="2">分层收费</el-radio>
        </el-radio-group>
        <h4>合同编号:</h4>
        <el-radio-group v-model="radio" @change="contractRadio(radio,'fee')">
          <el-radio v-for="item in contractList" :key="item.contractCode" style="display:block;margin:10px 5px;" :label="item.id">{{ item.contractCode }}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="20">
        <!-- <SuiteTable
        ref="table"
        :table-props="tableProps"
      >
        <template v-slot:col_operation="{ row }">
          <FUOperationBar
            :list="operation.list"
            @command="handleOperationBarCommand($event, row)"
          />
        </template>

        <template v-slot:default> -->
        <div class="sf-table-top-toolbar">
          <div class="inner">
            <el-button
              type="primary"
              @click="openAddWin()"
            >新增计费规则
            </el-button>
          </div>
        </div>
        <el-table
          :data="list"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="ruleTypeId"
            label="计费方式"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.ruleTypeId ===1 ? '分段收费': scope.row.ruleTypeId ===2 ?'分层收费' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ruleName"
            label="计费名称"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="ruleTime"
            label="计费时间"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="priceStr"
            label="计费单价"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="totalPriceLowerLimit"
            label="最低费用"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.totalPriceLowerLimit ? scope.row.totalPriceLowerLimit +'元' :'' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPriceUpperLimit"
            label="最高费用"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.totalPriceUpperLimit ? scope.row.totalPriceUpperLimit + '元' :'' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ruleRoundingId"
            label="计费规则"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="alarms"
            label="计费范围"
            align="center"
          />
          <!-- <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="200"
            align="center"
          /> -->
          <!-- 操作 -->
          <el-table-column label="操作" align="center" width="250">

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
            :total="total"
            :current-page.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @current-change="getList"
            @size-change="getList"
          />
        </div>
      <!-- </template>
      </SuiteTable> -->
      </el-col>
    </el-row>

    <!-- 弹框：新增(分层) -->
    <DialogContainerized
      title="新增分层计费规则"
      :visible.sync="dialogFormVisibleAdd"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="600px"
    >
      <el-form :model="formAdd" label-width="100px">
        <el-form-item label="计费名称">
          <el-input v-model="formAdd.ruleName" placeholder="计费名称" />
        </el-form-item>
        <el-form-item label="计费时间">
          <el-row class="el-row-distance">
            <el-col :span="10">
              <el-input v-model="formAdd.rangeLowerLimit" placeholder="下限" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              ~
            </el-col>
            <el-col :span="10">
              <el-input v-model="formAdd.rangeUpperLimit" placeholder="上限" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              小时
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费单价">
          <el-row class="el-row-distance">
            <el-col :span="16">
              <el-input v-model="formAdd.price" placeholder="单价" />
            </el-col>
            <el-col :span="8">
              <el-select v-model="formAdd.unitId" class="el-select-full" @change="choiceway">
                <el-option label="元/小时" value="1" />
                <el-option label="元/24小时" value="2" />
                <el-option label="元/48小时" value="3" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费限价">
          <el-row class="el-row-distance">
            <el-col :span="10">
              <el-input v-model="formAdd.totalPriceLowerLimit" placeholder="最低" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              ~
            </el-col>
            <el-col :span="10">
              <el-input v-model="formAdd.totalPriceUpperLimit" placeholder="最高" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              元
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费规则">
          <el-radio-group v-model="formAdd.ruleRoundingId">
            <el-radio label="0">默认价格</el-radio>
            <el-radio label="1">四舍五入</el-radio>
            <el-radio label="2">向前取整</el-radio>
            <el-radio label="3">向后取整</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计费范围">
          <el-radio-group v-model="formAdd.alarms">
            <el-radio :label="1">断网</el-radio>
            <el-radio :label="2">断电</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </div>
    </DialogContainerized>

    <!-- 弹框：新增(分段) -->
    <DialogContainerized
      title="新增分段计费规则"
      :visible.sync="dialogFormVisibleAddSection"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="600px"
    >
      <el-form :model="formAdd" label-width="100px">
        <el-form-item label="计费名称">
          <el-input v-model="formAdd.ruleName" placeholder="计费名称" />
        </el-form-item>
        <el-form-item label="计费时间">
          <el-row class="el-row-distance">
            <el-col :span="10">
              <el-input v-model="formAdd.rangeLowerLimit" placeholder="下限" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              ~
            </el-col>
            <el-col :span="10">
              <el-input v-model="formAdd.rangeUpperLimit" placeholder="上限" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              小时
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费价格">
          <el-row class="el-row-distance">
            <el-col :span="22">
              <el-input v-model="formAdd.price" placeholder="价格" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              元
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费范围">
          <el-radio-group v-model="formAdd.alarms">
            <el-radio label="1">断网</el-radio>
            <el-radio label="2">断电</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddSection = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </div>
    </DialogContainerized>

    <!-- 弹框：编辑(分层) -->
    <DialogContainerized
      title="编辑分层计费规则"
      :visible.sync="dialogFormVisibleEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="600px"
    >
      <el-form :model="formEdit" label-width="100px">
        <el-form-item label="计费名称">
          <el-input v-model="formEdit.ruleName" placeholder="计费名称" />
        </el-form-item>
        <el-form-item label="计费时间">
          <el-row class="el-row-distance">
            <el-col :span="10">
              <el-input v-model="formEdit.rangeLowerLimit" placeholder="下限" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              ~
            </el-col>
            <el-col :span="10">
              <el-input v-model="formEdit.rangeUpperLimit" placeholder="上限" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              小时
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费单价">
          <el-row class="el-row-distance">
            <el-col :span="16">
              <el-input v-model="formEdit.price" placeholder="单价" />
            </el-col>
            <el-col :span="8">
              <el-select v-model="formAdd.unitId" class="el-select-full" @change="choiceway">
                <el-option label="元/小时" value="1" />
                <el-option label="元/24小时" value="2" />
                <el-option label="元/48小时" value="3" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费限价">
          <el-row class="el-row-distance">
            <el-col :span="10">
              <el-input v-model="formEdit.totalPriceLowerLimit" placeholder="最低" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              ~
            </el-col>
            <el-col :span="10">
              <el-input v-model="formEdit.totalPriceUpperLimit" placeholder="最高" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              元
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费规则">
          <el-radio-group v-model="formEdit.ruleRoundingId">
            <el-radio :label="0">默认价格</el-radio>
            <el-radio :label="1">四舍五入</el-radio>
            <el-radio :label="2">向前取整</el-radio>
            <el-radio :label="3">向后取整</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit()">确 定</el-button>
      </div>
    </DialogContainerized>

    <!-- 弹框：编辑(分段) -->
    <DialogContainerized
      title="编辑分段计费规则"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisibleEditSection"
      append-to-body
      width="600px"
    >
      <el-form :model="formEdit" label-width="100px">
        <el-form-item label="计费名称">
          <el-input v-model="formEdit.ruleName" placeholder="计费名称" />
        </el-form-item>
        <el-form-item label="计费时间">
          <el-row class="el-row-distance">
            <el-col :span="10">
              <el-input v-model="formEdit.rangeLowerLimit" placeholder="下限" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              ~
            </el-col>
            <el-col :span="10">
              <el-input v-model="formEdit.rangeUpperLimit" placeholder="上限" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              小时
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="计费价格">
          <el-row class="el-row-distance">
            <el-col :span="22">
              <el-input v-model="formEdit.price" placeholder="价格" />
            </el-col>
            <el-col :span="2" class="el-col-center">
              元
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditSection = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit()">确 定</el-button>
      </div>
    </DialogContainerized>

    <!-- 弹框：详情 -->
    <DisplayDialogTable
      :visible.sync="stratificationDialogDetail.visible"
      v-bind="stratificationDialogDetail.config"
    />

    <!-- 弹框：详情 -->
    <DisplayDialogTable
      :visible.sync="sectionDialogDetail.visible"
      v-bind="sectionDialogDetail.config"
    />

  </div>
</template>

<script>
import { findPage, addFeeRule, findById, ruleEdit, ruleDelete, getContractList } from '@/api/fee-rule'
import DisplayDialogTable from '@/components/DialogBox/DisplayDialogTable'
import { FeeRuleDialogValue } from './feeRule/feeRule-detail'
import { confirmDeleteData, tablePropsValue } from '@/views/datareport/feeRule/feeRule-table'
import SuiteTable from '@/components/FormSuites/SuiteTable'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import { unitStr, ruleRoundingType, alarmsStr } from '@/config/const/report/fee-rule-status'

export default {
  name: 'FeeRule',
  components: {
    FUOperationBar,
    DisplayDialogTable,
    SuiteTable,
    DialogContainerized,
  },
  data() {
    return {
      tableProps: tablePropsValue(),

      operation: {
        list: [
          {
            label: '详情',
            command: 'detail',
          },
          {
            label: '编辑',
            command: 'edit',
          },
          {
            label: '删除',
            command: 'delete',
            variant: 'danger',
          },
        ],
      },

      stratificationDialogDetail: FeeRuleDialogValue('2'),
      sectionDialogDetail: FeeRuleDialogValue('1'),

      list: null,
      total: 0,
      listLoading: false,
      contractList: null,
      listQuery: {
        ruleTypeId: '',
        feeContractId: null,
        pageNumber: 1,
        pageSize: 10,
      },
      dialogFormVisibleEdit: false,
      dialogFormVisibleEditSection: false,
      dialogFormVisibleAdd: false,
      dialogFormVisibleAddSection: false,
      formEdit: {
        ruleId: '',
        ruleName: '',
        ruleRoundingId: '0',
        rangeLowerLimit: '',
        rangeUpperLimit: '',
        totalPriceLowerLimit: '',
        totalPriceUpperLimit: '',
        price: '',
        unitId: '1',
        ruleTypeId: '',
        feeContractId: '',
      },

      formAdd: {
        ruleName: '',
        ruleRoundingId: '0',
        alarms: '',
        rangeLowerLimit: '',
        rangeUpperLimit: '',
        totalPriceLowerLimit: '',
        totalPriceUpperLimit: '',
        price: '',
        unitId: '1',
        ruleTypeId: '',
        feeContractId: '',
      },
      radio: '',
      Ruleradio: '',
    }
  },
  mounted() {
    this.getContract()
    this.getList()
    // this.$refs.table.$refs.table.$refs.searchForm.params.ruleTypeId = 2
  },
  methods: {
    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'detail':
          this.handleDetail(row)
          break

        case 'edit':
          this.handleUpdate(row)
          break

        case 'delete':
          confirmDeleteData(row)
          break
        default:
      }
    },

    openAddWin() {
      // const param = this.$refs.table.getSearchFormPlainParams()
      this.formAdd.alarms = ''
      if (this.Ruleradio === '2') {
        if (this.radio !== '') {
          this.dialogFormVisibleAdd = true
        } else {
          this.$message('请选择合同编号')
        }
      } else {
        if (this.radio !== '') {
          this.dialogFormVisibleAddSection = true
        } else {
          this.$message('请选择合同编号')
        }
      }
    },

    handleDetail(row) {
      if (row.ruleTypeId === 2) {
        this.stratificationDialogDetail.config.params = row
        this.stratificationDialogDetail.visible = true
      } else {
        this.sectionDialogDetail.config.params = row
        this.sectionDialogDetail.visible = true
      }
    },
    getContract() {
      getContractList().then(res => {
        this.contractList = res.data
      })
    },
    contractRadio(val, type) {
      if (type === 'rule') {
        this.listQuery.ruleTypeId = val
        this.Ruleradio = val
        this.formAdd.ruleTypeId = val
      } else if (type === 'fee') {
        this.radio = val
        this.listQuery.feeContractId = val
        this.formAdd.feeContractId = val
      }
      if (this.listQuery.ruleTypeId && this.listQuery.feeContractId) {
        this.getList()
      }
    },
    getList() {
      if (this.contractCode !== null) {
        this.listLoading = true
        findPage(this.listQuery).then(res => {
          res.data.result.forEach(item => {
            let unit = ''
            if (item.ruleTypeId === 2) {
              unit = unitStr[item.unitId]
            }

            if (item.rangeLowerLimit && item.rangeUpperLimit) {
              item.ruleTime = item.rangeLowerLimit + ' ~ ' + item.rangeUpperLimit + '小时'
            } else {
              item.ruleTime = '∞ ~ ∞'
            }

            item.priceStr = item.price + unit
            item.ruleRoundingId = ruleRoundingType[item.ruleRoundingId]
            item.alarms = alarmsStr[item.alarms]
          })
          this.list = res.data.result
          this.total = res.data.result.length
          this.listLoading = false
        })
      }
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
    con_number() {
      this.getList()
    },
    choiceway() {
      this.getList()
    },
    handleAdd() {
      if (!this.formAdd.ruleName) {
        this.$message('请输入计费名称')
        return
      }
      if (!this.formAdd.rangeLowerLimit) {
        this.$message('请输入计费下限时间')
        return
      }
      const onlyTimeRule = /^([1-9]\d*|[0]{1,1})$/
      if (!onlyTimeRule.test(this.formAdd.rangeLowerLimit)) {
        this.$message('计费下限时间为整数')
        return
      }
      if (this.formAdd.rangeUpperLimit) {
        if (!onlyTimeRule.test(this.formAdd.rangeUpperLimit)) {
          this.$message('计费上限时间为整数')
          return
        }
      }
      if (this.formAdd.price === '') {
        this.$message('请输入计费价格')
        return
      }
      var onlyPriceRule = /^([1-9]\d*|0)(\.\d*[1-9])?$/
      if (!onlyPriceRule.test(this.formAdd.price)) {
        this.$message('请输入正确格式的计费价格')
        return
      }
      if (!this.formAdd.alarms) {
        this.$message('请选择计费范围')
        return
      }
      this.formAdd.alarms = this.formAdd.alarms + ','
      this.formAdd.ruleTypeId = this.listQuery.ruleTypeId
      addFeeRule(this.formAdd).then(res => {
        if (res.success) {
          this.$message({ message: '新增成功', type: 'success' })
          if (this.listQuery.ruleTypeId === '1') {
            this.dialogFormVisibleAddSection = false
          } else {
            this.dialogFormVisibleAdd = false
          }
          this.getList()
        } else {
          this.$message({ message: res.message, type: 'error' })
        }
      })
    },
    handleUpdate(row) {
      // const param = this.$refs.table.getSearchFormPlainParams()
      if (row.ruleTypeId === 2) {
        this.dialogFormVisibleEdit = true
      } else {
        this.dialogFormVisibleEditSection = true
      }
      findById({ ruleId: row.ruleId }).then(res => {
        if (res.success) {
          this.formEdit.ruleName = res.data.ruleName
          this.formEdit.ruleRoundingId = res.data.ruleRoundingId
          this.formEdit.rangeLowerLimit = res.data.rangeLowerLimit
          this.formEdit.rangeUpperLimit = res.data.rangeUpperLimit
          this.formEdit.totalPriceLowerLimit = res.data.totalPriceLowerLimit
          this.formEdit.totalPriceUpperLimit = res.data.totalPriceUpperLimit
          this.formEdit.price = res.data.price
          this.formEdit.unitId = res.data.unitId
          this.formEdit.ruleTypeId = res.data.ruleTypeId
          this.formEdit.feeContractId = res.data.feeContractId
          this.formEdit.ruleId = res.data.ruleId
        }
      })
    },
    handleEdit() {
      if (!this.formEdit.ruleName) {
        this.$message('请输入计费名称')
        return
      }
      if (!this.formEdit.rangeLowerLimit) {
        this.$message('请输入计费下限时间')
        return
      }
      const onlyTimeRule = /^([1-9]\d*|[0]{1,1})$/
      if (!onlyTimeRule.test(this.formEdit.rangeLowerLimit)) {
        this.$message('计费下限时间为整数')
        return
      }
      if (this.formEdit.rangeUpperLimit) {
        if (!onlyTimeRule.test(this.formEdit.rangeUpperLimit)) {
          this.$message('计费上限时间为整数')
          return
        }
      }
      if (this.formEdit.price === '') {
        this.$message('请输入计费价格')
        return
      }
      var onlyPriceRule = /^([1-9]\d*|0)(\.\d*[1-9])?$/
      if (!onlyPriceRule.test(this.formEdit.price)) {
        this.$message('请输入正确格式的计费价格')
        return
      }
      ruleEdit(this.formEdit).then(res => {
        if (res.success) {
          this.$message({ message: '编辑成功', type: 'success' })
        } else {
          this.$message({ message: res.message, type: 'error' })
        }
        if (this.listQuery.ruleTypeId === '1') {
          this.dialogFormVisibleEditSection = false
        } else {
          this.dialogFormVisibleEdit = false
        }
        this.getList()
      })
    },
    handleDelete(ruleId) {
      this.$confirm('确认删除数据吗').then(() => {
        ruleDelete({ ruleId: ruleId }).then(res => {
          if (res.success) {
            this.$message({ message: '删除成功', type: 'success' })
          } else {
            this.$message({ message: '删除失败', type: 'error' })
          }
          this.getList()
        })
      })
    },

  },
}
</script>

<style lang="scss">

.fee-rule-view{
  >.el-row{
    border: 1px solid #ccc;
    max-height: 800px;
    .el-col-4{
      padding: 10px;
      margin-top: 30px;
      border-right: 1px solid #ccc;
      overflow: auto
    }
    .el-col-20{
      border-left: 1px solid #ccc;
      margin-left: -1px;
      padding: 10px;
      .el-table{
        border: 1px solid #ccc;
        tbody{
          tr>td{
            font-size: 14px;
          }
        }
      }
    }
  }

}

</style>
