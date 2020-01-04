<template>
  <div class="camera-manage-view module-content-box">
    <div class="sf-filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item
          class="filter-item"
        >
          <el-input
            v-model="listQuery.selfCode"
            placeholder="点位编号"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>

        <el-form-item
          class="filter-item"
        >
          <el-input
            v-model="listQuery.selfLocation"
            placeholder="点位位置"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>

        <el-form-item class="filter-item">

          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
          </el-button>

          <!-- <el-button
            type="primary"
            icon="el-icon-plus"
            @click=""
          >
          </el-button> -->

        </el-form-item>
      </el-form>
    </div>

    <div class="sf-table-top-toolbar">
      <div class="inner">
        <el-button
          type="primary"
          class="filter-item"
          @click="handleImageThresholdClick"
        >
          图像阈值
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          :loading="loader.quickSetting"
          @click="handleQuickSettingClick"
        >
          一键设置
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          :loading="loader.imageAnalysis"
          @click="handleImageAnalysisClick"
        >
          启动图像分析
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="openEditDialog(null, true)"
        >
          新增摄像头
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
      <el-table-column label="设备名称">
        <template slot-scope="scope">
          <span>{{ scope.row.devName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备型号">
        <template slot-scope="scope">
          <span>{{ scope.row.modelNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网络IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口号">
        <template slot-scope="scope">
          <span>{{ scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口编号">
        <template slot-scope="scope">
          <span>{{ scope.row.outputNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">正常</span>
          <span v-if="scope.row.status == 1" class="red">故障</span>
        </template>
      </el-table-column>
      <el-table-column label="设备故障状态">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="初始化状态">
        <template slot-scope="scope">
          <span v-if="scope.row.thresholdStatus == 0" class="red">未初始化</span>
          <span v-if="scope.row.thresholdStatus == 1">已初始化</span>
          <span v-if="scope.row.thresholdStatus == 2" class="red">初始化中</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{ row }">
          <f-u-operation-bar
            :list="tableOperation.list"
            @command="handleOperationBarCommand($event, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
    <div class="sf-table-heel-pagination">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 弹框: 查看详情 -->
    <DisplayDialogTable
      :visible.sync="dialogDetail.visible"
      v-bind="dialogDetail.config"
    />

    <!-- 弹框：新增/编辑 -->
    <DialogContainerized
      :title="editDialog.isNew ? '新增摄像头' : '编辑摄像头'"
      append-to-body
      width="450px"
      :visible.sync="editDialog.visible"
    >
      <CameraEdit
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
import {
  findPage,
  fireQuickSetting,
  startImageAnalysis,
  del as deleteCamera,
} from '@/api/camera'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DisplayDialogTable from '@/components/DialogBox/DisplayDialogTable'
import { CameraManageDetailDialogValue } from './utils/dialog-helper'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import CameraEdit from '@/views/camera/manage/components/CameraEdit'

export default {
  name: 'CameraManage',
  components: { CameraEdit, DialogContainerized, DisplayDialogTable, FUOperationBar },

  data() {
    return {
      loader: {
        quickSetting: false,
        imageAnalysis: false,
      },

      list: null,
      total: 0,
      listLoading: true,
      waitRoleList: null,
      alreadyRoleList: null,
      listQuery: {
        selfCode: '',
        selfLocation: '',
        pageNumber: 1,
        pageSize: 10,
      },

      tableOperation: {
        list: [
          {
            label: '详情',
            command: 'detail',
          },
          {
            label: '报警记录',
            command: 'alarmRecord',
          },
          {
            label: '通信协议',
            command: 'protocol',
          },
          {
            label: '基准图片',
            command: 'benchmarkPicture',
          },
          {
            label: '编辑',
            command: 'edit',
          },
          {
            label: '删除',
            command: 'delete',
          },
        ],
      },

      dialogFormVisibleEdit: false,

      dialogFormVisibleSetResource: false,
      formEdit: {
        id: null,
        name: '',
        desc: '',
      },
      formAdd: {
        selfCode: '',
        selfLocation: '',
        devName: '',
        ip: '',
        port: '',
        mask: '',
        getway: '',
        mac: '',
        outputNumber: '',
        modelNumber: '',
        totalManufacturerId: '',
        electricManufacturer: '',
        networkManufacturer: '',
      },

      // 查看详情弹框
      dialogDetail: CameraManageDetailDialogValue(),

      // 编辑 弹框
      editDialog: {
        visible: false,
        isNew: false,

        params: {
          deviceId: '',
        },
      },
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

    handleImageThresholdClick() {
      this.$router.push({ name: 'CameraManageThreshold' })
    },

    handleQuickSettingClick() {
      this.loader.quickSetting = true

      fireQuickSetting()
        .then((res) => {
          this.$alert(res.message || '操作成功', { type: 'success' })
        })
        .finally(() => {
          this.loader.quickSetting = false
        })
    },

    handleImageAnalysisClick() {
      this.loader.imageAnalysis = true

      startImageAnalysis()
        .then((res) => {
          this.$alert(res.message || '操作成功', { type: 'success' })
        })
        .finally(() => {
          this.loader.imageAnalysis = false
        })
    },

    handleOperationBarCommand(command, row) {
      console.log(arguments)

      const toRouteNameMap = {
        alarmRecord: 'CameraManageAlarm',
        protocol: 'CameraManageProtocol',
        benchmarkPicture: 'CameraManageBenchmarkPic',
      }

      switch (command) {
        case 'detail':
          this.dialogDetail.config.params = row
          this.dialogDetail.visible = true
          break

        case 'alarmRecord':
        case 'protocol':
        case 'benchmarkPicture': {
          const routeName = toRouteNameMap[command]
          if (row.devid && routeName) {
            this.$router.push(
              {
                name: toRouteNameMap[command],
                params: { id: row.devid },
              },
            )
          } else {
            console.warn('[CameraManage] handleOperationBarCommand cannot found devid or routeName', command, routeName, row)
          }
        }
          break

        case 'edit':
          this.openEditDialog({
            deviceId: row.devid,
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

    async handleOperationDelete(row = {}) {
      const {
        devid: deviceId,
        devName = '',
      } = row

      if (!deviceId) {
        this.$message.error('找不到 id ，无法删除')
        console.error('[CameraManage] handleOperationDelete cannot found id', row)
        return
      }

      const confirmTask = () => {
        const type = 'warning'
        return this.$confirm(`确认要删除 ${devName} 吗？`, '删除', { type })
          .catch(() => Promise.reject(null))
      }

      const deleteTask = async() => {
        await deleteCamera({ id: deviceId })
          .catch(() => Promise.reject(null))

        this.$message.success(`${devName} 已删除`)
      }

      try {
        await confirmTask()
        await deleteTask()
        this.getList()
      } catch (thrown) {
        switch (typeof thrown) {
          case 'string':
            this.$message.error(thrown)
            break

          case 'object':
          default:
            thrown && console.error(thrown)
        }
      }
    },

    editOnSuccess(res) {
      this.$message({
        message: res.message,
        type: 'success',
      })
      this.editDialog.visible = false
      this.reloadList()
    },
  },
}
</script>

<style lang="scss">

</style>
