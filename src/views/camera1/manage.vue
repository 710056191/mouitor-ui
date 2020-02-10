<template>
  <div class="camera-manage-view module-content-box">
    <div class="sf-filter-container sf-filter-main">
      <el-row>
        <el-col :span="6">
          <div class="contentLeft">
            <LeftTree :place-data="placeData" :list="list" @listenTree="treeClick" @listenToTree="handleTreeClick" />
          </div>
        </el-col>
        <!-- <el-divider direction="vertical" /> -->
        <el-col :span="18">
          <div class="contentRight">
            <el-row>
              <el-col :span="11">
                <div style="margin-top:20px">
                  <!-- 基础信息组件 -->
                  <BaseInfo :data="baseData" type="camera" @listenhandleEdit="handleEditFromBaseInfo" />
                </div>
              </el-col>
              <el-col :offset="1" :span="12">
                <div style="margin-top:20px">
                  <StatusReport :data="baseData" :status-text="getStatusText" />
                </div>
              </el-col>
            </el-row>
            <el-row style="padding:5px 0">
              <div class="button">
                <div v-show="radio" class="radio">
                  <el-radio-group v-model="radio" size="mini">
                    <el-radio-button label="报警记录" />
                    <el-radio-button label="通信协议" />
                    <el-radio-button label="基准图片" />
                  </el-radio-group>
                </div>
                <div class="child-button">
                  <!-- <el-button v-if="radio ==='报警记录'" icon="el-icon-refresh" size="mini">刷新</el-button> -->
                  <el-button v-if="radio ==='通信协议'" icon="el-icon-plus" size="mini" @click="addProtocol">新增协议</el-button>
                </div>
              </div>
              <Alarm v-if="radio ==='报警记录'" :id="baseData?baseData.devid : ''" />
              <Protocol v-if="radio ==='通信协议'" :id="baseData?baseData.devid : ''" ref="Protocol" />
              <BenchmarkPicture v-if="radio ==='基准图片'" :id="baseData?baseData.devid : ''" />

            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--  -->

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
  del as deleteCamera,
} from '@/api/camera'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DisplayDialogTable from '@/components/DialogBox/DisplayDialogTable'
import { CameraManageDetailDialogValue } from './utils/dialog-helper'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import CameraEdit from '@/views/camera/manage/components/CameraEdit'
import LeftTree from './components/LeftTree'
import StatusReport from '../device/settingV1/components/StatusReport'
import BaseInfo from '../device/settingV1/components/BaseInfo'
import Alarm from './manage/alarm' // 报警记录
import Protocol from './manage/protocol' // 通信协议
import BenchmarkPicture from './manage/benchmark-pic' // 基准图片
import { getDevByAddr } from '@/api/address'

export default {
  name: 'V1CameraManage',
  components: { CameraEdit, DialogContainerized, DisplayDialogTable, FUOperationBar,
    LeftTree, StatusReport, BaseInfo, Alarm, Protocol, BenchmarkPicture },

  data() {
    return {

      list: null, // 摄像头列表
      total: 0,
      listLoading: true,
      waitRoleList: null,
      alreadyRoleList: null,
      listQuery: {
        selfCode: '',
        selfLocation: '',
        pageNumber: 1,
        pageSize: 8,
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
      baseData: {}, // 基础信息
      getStatusText: {},
      radio: '',
      placeData: [], // 树形控件数据
    }
  },

  created() {
    this.getList()
    const height = document.documentElement.clientHeight
    console.log(height)
  },

  methods: {
    reloadList(...args) {
      this.getList(...args)
    },

    handleEditFromBaseInfo(editvisibel, data) {
      const dialog = this.editDialog
      dialog.visible = editvisibel
      this.openEditDialog({ deviceId: data.devid })
    },

    treeClick(data) {
      // console.log(data)
      data.type = 'camera'
      this.baseData = data
      this.radio = '报警记录'
    },

    handleTreeClick(type) {
      this.openEditDialog(null, true)
    },

    getList() {
      this.listLoading = true
      getDevByAddr({ pageNumber: '',
        pageSize: '',
        addressName: '',
        deviceTypeId: '2' }).then(res => {
        const data = res.data
        this.list = res.data
        this.listLoading = false
        const places = []
        const proCode = ''
        data.map(item => {
          places.push({
            label: item.selfAddr1,
            type: 'selfAddr1',
            children: [{
              label: item.selfAddr2,
              children: [{
                label: item.devName,
                code: item.selfCode,
                id: item.devid,
              }],
            }],
          })
        })
        this.placeData = this.mapList(places)
      })
    },
    // 数组去重整合
    mapList(data) {
      const arr = []
      data.forEach(item => {
        // console.log(item)
        if (arr === null) {
          arr.push(item)
        } else {
          const isExit = arr.some((li, idx) => {
            if (li.label === item.label) {
              if (item.children && li.children) {
                arr[idx].children = [...li.children, ...item.children]
              } else if (item.children && !li.children) {
                arr[idx].children = [...item.children]
              } else if (!item.children && li.children) {
                arr[idx].children = [...li.children]
              }
              return true
            }
          })
          if (!isExit) {
            arr.push(item)
          }
        }
      })
      arr.forEach((item, idx) => {
        const type = item instanceof Array
        if (!type && item.children) {
          const children = this.mapList(item.children)
          arr[idx].children = children
        }
      })
      return arr
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
    addProtocol() {
      this.$refs.Protocol.addBtnOnClick()
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

.camera-manage-view{
  .sf-filter-main>.el-row{
    border: 1px #ccc solid;
    height: auto;
  }
  .el-col-6{
    max-height: 825px;
    border-right:1px #ccc solid;
    overflow: auto;
  }
  .contentLeft{
  padding: 20px;
  box-sizing: border-box;
  height: 100%;

}
  .el-col-18{
    border-left:1px #ccc solid;
    max-height: 825px;
    margin-left: -1px;
  .contentRight{
    padding: 0 20px;
    box-sizing: border-box;
    max-height: 825px;
    .el-row:nth-child(1){
      height: 40%;
    }
    .el-row:nth-child(2){
      height: 60%;
      overflow: hidden;
    }
    .el-table{
      margin-top: 10px !important;
      max-height: 450px;
      tr{
        td{
          font-size: 14px;
          padding: 7px 0;
        }
      }

    }
  }
  }
  .button{
    display: flex;
    justify-content: space-between;
  }
  .el-table__body-wrapper{
        overflow: overlay;
        max-height: 405px;
      }
      .el-table__body-wrapper::-webkit-scrollbar-track {
  display: none; //Safari and Chrome
}
}

@media (min-height:910px) {
  .sf-filter-main>.el-row{
    max-height: 830px;
    .el-col-6{
      max-height: 825px;
    }
    .el-col-18{
      .contentRight{
        max-height: 825px;
        .el-table{
          max-height: 450px;
        }
      }
    }
  }
}

@media (max-height:910px) {
  .sf-filter-main>.el-row{
    max-height: 700px;
    .el-col-6{
      max-height: 695px;
    }
    .el-col-18{
      .contentRight{
        max-height: 695px;
        .el-table{
          max-height: 310px;
        }
      }
    }
  }
}

</style>
