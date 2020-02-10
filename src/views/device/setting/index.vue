<template>
  <div class="machine-manufacturer-view module-content-box">
    <div class="sf-filter-container">
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
      <el-input
        v-model="listQuery.devName"
        placeholder="设备名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.ipStart"
        placeholder="网络开始IP地址"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.ipEnd"
        placeholder="网络结束IP地址"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="请选择设备状态"
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

        <!-- <uploadComponent
          :show-list="false"
          url="/cameraExcel/upload.do"
          button-text="上传设备关联表"
          @success="handleSuccess"
        />
        <el-button
          type="primary"
          class="filter-item"
          @click="handleDownload"
        >
          下载设备关联表
        </el-button> -->

        <uploadComponent
          :show-list="false"
          url="/device/deviceUpload"
          button-text="批量导入设备箱"
          @success="handleSuccess"
        />

        <el-button
          type="primary"
          class="filter-item"
          @click="choiceDialog = true"
        >
          设备关联表
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="logDialog = true"
        >
          设备日志
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="handleSetAllDefaultValeu"
        >
          阈值初始化
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="openEditDialog(null, true)"
        >
          新增设备箱
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="workingTimeDialog = true"
        >
          设置工期
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="handIpInfo"
        >
          ip批量修改
        </el-button>
        <!-- <el-button
          type="primary"
          class="filter-item"
          @click="linkAddressDialog = true"
        >
          设置关联地址
        </el-button> -->
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

      <!-- 工期 -->
      <el-table-column label="工期">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.proTimesId }}</span>
        </template> -->

        <template slot-scope="scope">
          <span v-for="item in proTimesIdList" :key="item.id">
            <template v-if="item.id == scope.row.proTimesId">
              {{ item.name }}
            </template>
          </span>
        </template>
      </el-table-column>

      <!-- 点位编号 -->
      <el-table-column label="点位编号">
        <template slot-scope="scope">
          <span>{{ scope.row.selfCode }}</span>
        </template>
      </el-table-column>

      <!-- 点位位置 -->
      <!-- <el-table-column label="点位位置" prop="selfLocation" width="250px"> -->
      <el-table-column label="点位位置" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.selfAddr1 }}{{ scope.row.selfAddr2 }}</span>
        </template>
      </el-table-column>

      <!-- 设备名称 -->
      <el-table-column label="设备名称">
        <template slot-scope="scope">
          <span>{{ scope.row.devName }}</span>
        </template>
      </el-table-column>

      <!-- TODO: -->
      <!-- 承包业务 -->
      <el-table-column label="网络IP" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <!-- 设备箱状态 -->
      <el-table-column label="设备箱状态" width="150px">
        <template slot-scope="scope">
          <span :class="getStatusText[scope.row.status] == '正常' ?'':'red'">{{ getStatusText[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 设备箱故障状态 -->
      <el-table-column label="设备箱状态描述" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmDesc }}</span>
        </template>
      </el-table-column>

      <!-- 关联设备状态 -->
      <el-table-column label="关联设备状态" prop="legalPerson" width="150px">
        <template slot-scope="scope">
          <span :class="relaStatusMap[scope.row.devid] == '正常' ?'':'red'">{{ relaStatusMap[scope.row.devid] }}</span>
        </template>
      </el-table-column>

      <!-- 阈值是否初始化 -->
      <el-table-column label="阈值是否初始化" width="150px">
        <template slot-scope="scope">
          <span>{{ thresholdStatus[scope.row.thresholdStatus] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="320"
        align="center"
      >
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

    <!-- 弹框: 详情 -->
    <DisplayDialogTable
      :visible.sync="dialogDetail.visible"
      v-bind="dialogDetail.config"
    />

    <!-- 弹框: 设备日志-->
    <DialogContainerized
      v-if="logDialog"
      title="设备日志"
      :visible.sync="logDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="1000px"
    >
      <deviveLogDialog />
    </DialogContainerized>

    <!-- 弹框: 报警记录-->
    <DialogContainerized
      v-if="alarmDialog"
      title="报警记录"
      :visible.sync="alarmDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="1000px"
    >
      <deviceAlarmDialog :alarm-id="alarmId" />
    </DialogContainerized>

    <!-- 弹框: 新增/编辑 -->
    <DialogContainerized
      :title="editDialog.isNew ? '新增设备箱' : '编辑设备箱'"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="800px"
    >
      <DeviceEdit
        v-if="editDialog.visible"
        :params="editDialog.params"
        :is-new="editDialog.isNew"
        @completed="editOnSuccess"
        @cancel="editDialog.visible=false"
      />
    </DialogContainerized>

    <!-- 弹框: 设置工期-->
    <DialogContainerized
      v-if="workingTimeDialog"
      title="设置工期"
      :visible.sync="workingTimeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="600px"
    >
      <WorkingTimeDialog />
    </DialogContainerized>

    <!-- 弹框: 设置关联地址-->
    <DialogContainerized
      v-if="linkAddressDialog"
      title="设置关联地址"
      :visible.sync="linkAddressDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="800px"
    >
      <LinkAddressDialog />
    </DialogContainerized>

    <!-- 弹框: 设备关联表-->
    <DialogContainerized
      v-if="choiceDialog"
      title="设备关联表"
      :visible.sync="choiceDialog"
      append-to-body
      width="450px"
    >
      <DeviceRelatedTable />
    </DialogContainerized>

  </div>
</template>

<script>
import deviceApi from '@/api/device'
import deviveLogDialog from './components/DeviceLogDialog'
import deviceAlarmDialog from './components/DeviceAlarmDialog'
import uploadComponent from '@/components/UploadComponents'
import WorkingTimeDialog from './components/WorkingTimeDialog'
import LinkAddressDialog from './components/LinkAddressDialog'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DisplayDialogTable from '@/components/DialogBox/DisplayDialogTable'
import { deviceDetailDialogValue } from '@/views/device/setting/setting.business'
import DeviceEdit from './components/DeviceEdit'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import proTimesApi from '@/api/protimes'
import DeviceRelatedTable from '@/views/device/setting/components/DeviceRelatedTable'

export default {
  name: 'DeviceSetting',

  components: {
    DeviceRelatedTable,
    DisplayDialogTable,
    FUOperationBar,
    deviveLogDialog,
    deviceAlarmDialog,
    uploadComponent,
    DeviceEdit,
    DialogContainerized,
    WorkingTimeDialog,
    LinkAddressDialog,
  },

  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
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
        devName: '',
        ipStart: '',
        ipEnd: '',
        status: '',
        pageNumber: 1,
        pageSize: 10,
      },

      proTimesIdList: null,

      rules: {
        manufacturerName: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
      },

      alarmId: undefined,
      tsId: undefined,
      tsIp: undefined,
      sameLocation: undefined,
      sameCode: undefined,
      logDialog: false,
      createDialog: false,
      alarmDialog: false,
      workingTimeDialog: false,
      linkAddressDialog: false,
      choiceDialog: false,
      options: [
        { label: '正常', value: '0' },
        { label: '故障', value: '1' },
        { label: '报警', value: '2' },
        { label: '停用', value: '3' },
        { label: '未启用', value: '4' },
      ],
      thresholdStatus: {
        0: '未初始化',
        1: '初始化完成',
        2: '初始化中',
        3: '初始化失败',
      },
      getStatusText: {
        0: '正常',
        1: '故障',
        2: '报警',
        3: '停用',
        4: '未启用',
      },
      getFaultStatusText: {
        1: '温度异常',
        2: '湿度异常',
        3: '电压异常',
        4: '网络异常',
        5: '断电异常',
        6: '其他',
      },
      relaStatusMap: {},

      operation: {
        list: [
          { label: '编辑', command: 'Edit' },
          { label: '关联设备', command: 'WatchSameAreaDevice' },
          { label: '报警记录', command: 'Alarm', variant: 'danger' },
          { label: '详情', command: 'View' },
          { label: '阈值初始化', command: 'SetSingleDefaultValeu' },
          { label: '设备阈值', command: 'Threshold' },
          { label: '删除', command: 'Del' },
        ],
      },

      // 查看 详情 弹框
      dialogDetail: deviceDetailDialogValue(),
    }
  },

  created() {
    this.getList()
    this.getProTimesList()
  },

  activated() {
    this.getList()
    this.getProTimesList()
  },

  methods: {

    getProTimesList() {
      proTimesApi.getProTimesList().then(res => {
        if (res.success) {
          this.proTimesIdList = res.data
        }
      })
    },

    handleDownload() {
      deviceApi.fetchTemplate()
    },

    reloadList(...args) {
      this.getList(...args)
    },

    getList() {
      this.listLoading = true
      deviceApi.fetchList(this.listQuery).then(res => {
        this.relaStatusMap = res.data.relaStatusMap
        this.list = res.data.page.result
        this.total = res.data.page.total
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

    handleDel(id) {
      this.$confirm('你确定要永久删除该设备数据吗？').then(() => {
        this.delData(id)
      })
    },

    delData(id) {
      deviceApi.del({ 'id': id }).then(ret => {
        if (ret.success) {
          this.$message({
            message: ret.message,
            type: 'success',
          })
          this.getList()
        }
      })
    },

    // handleAdd() {
    //   /this.$router.push({ name: 'DeviceAdd' })
    // },
    // handleUpdate(id) {
    //   this.$router.push({ name: 'DeviceEdit', query: { id: id }})
    // },

    handleSetAllDefaultValeu() {
      deviceApi.setAllDefaultValue().then(ret => {
        this.$message({
          message: ret.message,
          type: 'success',
        })
      })
    },

    handleSetSingleDefaultValeu(id) {
      deviceApi.setSingleDefaultValue(id).then(ret => {
        this.$message({
          message: '发送初始化阈值指令成功',
          type: 'success',
        })
      })
    },

    handleWatchSameAreaDevice(location, code, devId) {
      this.$router.push({ name: 'DeviceRelatedDevice', query: { location: location, code: code, devId: devId }})
    },

    handIpInfo() {
      this.$router.push({ name: 'IpInfoUpdate' })
    },

    handleAlarm(id) {
      this.alarmId = id
      this.alarmDialog = true
    },

    handleThreshold(id, ip) {
      this.$router.push({ name: 'DeviceSettingThreshold', query: { tsId: id, tsIp: ip, isThirdDev: 0 }})
    },

    handleSuccess() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleOperationBarCommand(command, row) {
      const id = row.devid

      switch (command) {
        case 'View':
          this.dialogDetail.config.params = { id }
          this.dialogDetail.visible = true
          break

        case 'WatchSameAreaDevice':
          this.handleWatchSameAreaDevice(row.selfLocation, row.selfCode, row.devid)
          break

        case 'Alarm':
          this.handleAlarm(id)
          break

        case 'SetSingleDefaultValeu':
          this.handleSetSingleDefaultValeu(id)
          break

        case 'Threshold':
          this.handleThreshold(id, row.ip)
          break

        case 'Edit':
          this.openEditDialog({ id })
          break

        case 'Del':
          this.handleDel(id)
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
.wins-choice{
  margin-bottom: 20px;

  .mess{
      width: 150px;
      height: 150px;
      display:flex;
      justify-content:center;
      align-items:center;
      background: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      margin: 0 auto;
    cursor: pointer;

    .svg-icon {
      font-size: 50px;
      height: auto;
      position: absolute;
      top: -15px;
    }
    .mess-name{
      position: absolute;
      bottom:30px;
      text-align: center;

      p {
        margin: 0;
      }
    }
    .upload-component-area{
      opacity: 0;
      .el-button{
        width: 150px;
        height: 150px;
        padding: 0;
      }
    }
  }
}
</style>
