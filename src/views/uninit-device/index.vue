<template>
  <div class="uninit-device-view module-content-box">
    <!-- 未初始化设备 -->
    <div class="sf-filter-container">
      <div class="top-search">
        <p>点位编号：</p>
        <el-input
          v-model="listQuery.query_selfCode"
          placeholder="请输入点位编号"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div class="top-search">
        <p>点位位置：</p>
        <el-input
          v-model="listQuery.query_selfLocation"
          placeholder="请输入点位位置"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div class="top-search">
        <p>设备名称：</p>
        <el-input
          v-model="listQuery.query_selfName"
          placeholder="请输入设备名称"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div class="top-search">
        <p>开始IP：</p>
        <el-input
          v-model="listQuery.query_ipStart"
          placeholder="请输入网络开始IP地址"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div class="top-search">
        <p>结束IP：</p>
        <el-input
          v-model="listQuery.query_ipEnd"
          placeholder="请输入网络结束IP地址"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div class="top-search">
        <p>设备状态</p>
        <el-select
          v-model="listQuery.query_status"
          placeholder="不限"
          :clearable="true"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="text-align:right">
        <el-button
          type="primary"
          class="filter-item"
          @click="handleFilter"
        >
          查询
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="delAll"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      class="el-table--outline-border"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="45"
      />
      <!-- 序号 -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
      />

      <!-- 点位编号 -->
      <el-table-column label="点位编号">
        <template slot-scope="scope">
          <span>{{ scope.row.selfCode }}</span>
        </template>
      </el-table-column>

      <!-- 点位位置 -->
      <!-- <el-table-column label="点位位置" prop="selfLocation" width="250px"> -->
      <el-table-column label="点位位置">
        <template slot-scope="scope">
          <span>{{ scope.row.selfLocation }}</span>
        </template>
      </el-table-column>

      <!-- 设备名称 -->
      <el-table-column label="设备名称">
        <template slot-scope="scope">
          <span>{{ scope.row.selfName }}</span>
        </template>
      </el-table-column>

      <!-- TODO: -->
      <!-- 承包业务 -->
      <el-table-column label="设备IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <!-- 设备箱状态 -->
      <el-table-column label="监测器状态">
        <template slot-scope="scope">
          <span :class="StatusText[scope.row.status] == '正常' ?'':'red'">{{ StatusText[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 设备箱故障状态 -->
      <el-table-column label="监测器故障状态">
        <template slot-scope="scope">
          <span :class="FaultStatusText[scope.row.faultStatus] == '正常' ?'':'red'">{{ FaultStatusText[scope.row.faultStatus] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="260"
        align="center"
      >
        <template slot-scope="{ row }">
          <FUOperationBar
            :list="operation.list"
            :split-number="4"
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
    <!-- 弹框: 详情 -->
    <DisplayDialogTable
      :visible.sync="dialogDetail.visible"
      v-bind="dialogDetail.config"
    />

    <!-- 弹框: 新增/编辑 -->
    <DialogContainerized
      title="编辑"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <TempDeviceEdit
        v-if="editDialog.visible"
        :params="editDialog.params"
        :is-new="editDialog.isNew"
        @cancel="editDialog.visible=false"
        @completed="editOnSuccess"
      />
    </DialogContainerized>

  </div>
</template>

<script>

import { getTempDeviceList, addTempDevice, delAll } from '@/api/temp-device'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DisplayDialogTable from '@/components/DialogBox/DisplayDialogTable'
import { deviceDetailDialogValue } from './utils/business'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import TempDeviceEdit from './components/TempDeviceEdit'
import {
  StatusText,
  FaultStatusText,
} from '@/config/const/device/camera-status'

export default {
  name: 'TempDevice',
  components: { FUOperationBar, DisplayDialogTable, DialogContainerized, TempDeviceEdit },
  data() {
    return {
      StatusText,
      FaultStatusText,
      operation: {
        list: [
          {
            label: '详情',
            command: 'View',
          },
          {
            label: '编辑',
            command: 'edit',
          },
          {
            label: '入库',
            command: 'verb',
          },
          {
            label: '删除',
            command: 'delete',
            variant: 'danger',
          },
        ],
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        query_selfCode: '',
        query_selfLocation: '',
        query_selfName: '',
        query_ipStart: '',
        query_ipEnd: '',
        query_status: '',
        pageNumber: 1,
        pageSize: 10,
      },
      relaStatusMap: {},
      options: [
        { label: '不限', value: '' },
        { label: '正常', value: '0' },
        { label: '故障', value: '1' },
        { label: '报警', value: '2' },
        { label: '停用', value: '3' },
        { label: '已初始化', value: '4' },
      ],
      // 查看 详情 弹框
      dialogDetail: deviceDetailDialogValue(),
      editDialog: {
        visible: false,
        isNew: false,
        params: {
          id: '',
        },
      },
      multipleSelection: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    reloadList(...args) {
      this.getList(...args)
    },
    getList() {
      this.listLoading = true
      getTempDeviceList(this.listQuery).then(res => {
        this.relaStatusMap = res.data.relaStatusMap
        this.list = res.data.result
        this.total = res.data.total
        this.listLoading = false
        if (this.list.length < 1 && this.listQuery.pageNumber > 1) {
          this.listQuery.pageNumber--
          this.getList()
        }
      })
    },
    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleSelectionChange(val) {
      // 全选
      this.multipleSelection = val
    },
    delAll() {
      // 批量删除
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.deviceId)
      })
      const params = ids.join(',')
      this.$confirm('确定要删除选中项吗？').then(() => {
        delAll({ deviceIds: params }).then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success',
            })
            this.reloadList()
          }
        })
      })
    },
    handleOperationBarCommand(command, row) {
      const id = row.deviceId
      switch (command) {
        case 'View':
          this.dialogDetail.config.params = { id }
          this.dialogDetail.visible = true
          break

        case 'edit':
          this.openEditDialog({
            id: row.deviceId,
          })
          break

        case 'verb':
          this.handleVerb({
            id: row.deviceId,
          })
          break

        case 'delete':
          this.handleOperationDelete(row)
          break
        default:
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

    handleOperationDelete(row) {
      const id = row.deviceId
      this.$confirm('确定要删除这条数据吗？').then(() => {
        delAll({ 'deviceIds': id }).then(res => {
          // console.log(res)
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success',
            })
            this.reloadList()
          }
        })
      })
    },

    handleVerb(params) {
      // 入库
      this.$confirm('确定要入库吗？').then(() => {
        addTempDevice(params).then(res => {
          // console.log(res)
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success',
            })
            this.reloadList()
          }
        })
      })
    },
    editOnSuccess() {
      this.editDialog.visible = false
      this.reloadList()
    },
  },
}
</script>

<style lang="scss" scoped>

.top-search{
    display: inline-table;
    margin-right: 30px;
    p{
        width: 80px;
        height: 100%;
        margin: 0;
        padding: 0;
        margin-bottom: 10px;
        display: inline-table;
    }
    .filter-item{
        .el-input__inner{
            height: 30px;
            padding: 0;
        }
    }
}

</style>
