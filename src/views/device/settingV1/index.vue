<template>
  <div class="machine-manufacturer-view module-content-box">
    <div class="sf-filter-container sf-filter-main">
      <el-col :span="6">
        <div class="contentLeft">
          <el-row>
            <el-col style="margin-bottom:20px;">
              <el-input
                v-model="filterText"
                placeholder="请输入搜索关键字"
              />
            </el-col>
            <el-col :span="22">
              <div style="font-weight: bold;">智能设备箱</div>
            </el-col>
            <el-col :span="2">
              <el-popover
                placement="bottom-end"
                trigger="click"
                visible-arrow
                title=""
              >
                <div class="addDev">
                  <p @click="openEditDialog(null, true)">添加设备箱</p>
                  <uploadComponent
                    :show-list="false"
                    url="/device/deviceUpload"
                    button-text="批量导入设备箱"
                    childclass="leftupload"
                    @success="handleSuccess"
                  />
                  <p @click="handleSetAllDefaultValeu">阈值初始化</p>
                  <p @click="choiceDialog = true">导入关联设备</p>
                  <p @click="workingTimeDialog = true">设置工期</p>
                  <p @click="logDialog = true">设备日志</p>
                </div>
                <el-icon slot="reference" class="el-icon-plus" style="color: blue;" />
              </el-popover>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-tree
              ref="tree"
              class="filter-tree"
              :data="placeData"
              :node-key="defaultProps.id"
              :filter-node-method="filterNode"
              @node-expand="handleNodeOpen"
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node }" class="custom-tree-node" @mouseenter="onMouseEnter(node)" @mouseleave="iconVisible=false">
                <span>{{ node.label }}</span>
                <span v-show="iconVisible" @click="addNewSetting(node)">
                  <el-icon class="el-icon-plus" />
                </span>
              </span>
            </el-tree>
          </el-row>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="contentRight">
          <el-row>
            <el-col :span="11">
              <div style="margin-top:20px">
                <!-- 基础信息组件 -->
                <BaseInfo type="setting" :data="baseData" @listenhandleEdit="handleEditFromBaseInfo" />
              </div>
            </el-col>
            <el-col :offset="1" :span="12">
              <div style="margin-top:20px">
                <StatusReport :data="baseData" :status-text="getStatusText" />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <div style="display:flex;align-items: center">
              <h3>关联设备&nbsp;</h3>
              <p style="flexGrow: 1;">(数量{{ status.total }}，正常{{ status.normalNum }}，<span style="color:red">异常{{ status.abnormalNum }}</span>)</p>
              <el-button type="primary" size="small" style="height:30px;line-height:15px" @click="handleThreshold()">查看关联设备阈值</el-button>
            </div>
            <!-- table表格信息 -->
            <el-table
              v-loading="listLoading"
              :data="list"
              class="el-table--outline-border"
              stripe
              max-height="80%"
            >

              <el-table-column label="设备类型">
                <template slot-scope="{ row }">
                  <span>{{ row.devid }}</span>
                </template>
              </el-table-column>

              <el-table-column label="设备型号">
                <template slot-scope="scope">
                  <span>{{ scope.row.modelNumber }}</span>
                </template>
              </el-table-column>

              <el-table-column label="设备名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.devName }}</span>
                </template>
              </el-table-column>

              <el-table-column label="网络IP">
                <template slot-scope="scope">
                  <span>{{ scope.row.ip }}</span>
                </template>
              </el-table-column>

              <el-table-column label="所属模块ID">
                <template slot-scope="scope">
                  <span>{{ scope.row.moduleChipId }}</span>
                </template>
              </el-table-column>

              <el-table-column label="关联设备状态" prop="legalPerson">
                <template slot-scope="scope">
                  <span>{{ options[scope.row.status].label }}</span>
                </template>
              </el-table-column>

              <el-table-column label="关联设备状态描述">
                <template slot-scope="scope">
                  <span>{{ scope.row.alarmDesc }}</span>
                </template>
              </el-table-column>

              <el-table-column label="阈值是否初始化">
                <template slot-scope="scope">
                  <span>{{ thresholdStatus[scope.row.thresholdStatus] }}</span>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作" align="center" width="250">

                <template slot-scope="{ row }">
                  <FUOperationBar
                    :list="row.c.operations"
                    :split-number="4"
                    size="small"
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
          </el-row>
        </div>
      </el-col>
      <div class="clear"></div>
    </div>
    <!-- 基础信息弹框: 新增/编辑 -->
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

    <!-- 阈值是否初始化 -->
    <el-table-column label="阈值是否初始化" width="150px">
      <template slot-scope="scope">
        <span>{{ thresholdStatus[scope.row.thresholdStatus] }}</span>
      </template>
    </el-table-column>

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

    <!-- table弹框：编辑 -->
    <DialogContainerized
      v-if="updateDialog"
      title="编辑关联设备"
      :visible.sync="updateDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form ref="Form" :model="temp" :rules="rulesEdit" label-width="100px">
        <el-form-item label="接口编号" prop="outputNumber">
          <el-select v-model="temp.outputNumber" placeholder="请选择接口编号" class="el-select-full">
            <el-option
              v-for="item in machineNumber"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="devName">
          <el-input v-model="temp.devName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="所属模块ID" prop="moduleChipId">
          <el-input v-model="temp.moduleChipId" placeholder="请输入所属模块ID" />
        </el-form-item>
        <el-form-item label="是否启用设备" prop="networkManufacturer">
          <template>
            <el-radio v-model="temp.status" label="0">启用</el-radio>
            <el-radio v-model="temp.status" label="4">不启用</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </span>
    </DialogContainerized>

  </div>
</template>

<script>
import StatusReport from './components/StatusReport'
import BaseInfo from './components/BaseInfo'
import deviceApi from '@/api/device'
import deviveLogDialog from './components/DeviceLogDialog'
import uploadComponent from '@/components/UploadComponents'
import WorkingTimeDialog from './components/WorkingTimeDialog'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DeviceEdit from './components/DeviceEdit'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import proTimesApi from '@/api/protimes'
// import { prototype } from 'events'
import addressApi from '@/api/address'
import sameApi from '@/api/sameMachine'
import DeviceRelatedTable from './components/DeviceRelatedTable'

export default {
  name: 'DeviceSetting',
  components: {
    FUOperationBar,
    deviveLogDialog,
    uploadComponent,
    DeviceEdit,
    DialogContainerized,
    WorkingTimeDialog,
    DeviceRelatedTable,
    BaseInfo,
    StatusReport,
  },
  data() {
    return {
      // 设备编号01-08（2019.8.28）
      machineNumber: [
        { value: '01', label: '01' },
        { value: '02', label: '02' },
        { value: '03', label: '03' },
        { value: '04', label: '04' },
        { value: '05', label: '05' },
        { value: '06', label: '06' },
        { value: '07', label: '07' },
        { value: '08', label: '08' },
      ],
      moduleIdSelect: [],
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
        pageNumber: 1,
        pageSize: 10,
      },

      // 设备类型
      DeviceTypes: null,

      DeviceTypeMap: null,

      status: {
        total: 0, // 关联设备数量
        normalNum: 0, // 状态正常数量
        abnormalNum: 0, // 状态异常数量
      },
      proTimesIdList: null,
      rules: {
        manufacturerName: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
      },

      rulesEdit: {
        outputNumber: [{ required: true, message: '请选择接口编号', trigger: 'change' }],
        devName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        moduleChipId: [{ required: true, message: '请输入所属模块ID', trigger: 'change' }],
      },

      temp: {
        manufacturerTypes: [],
      },

      tsId: undefined,
      logDialog: false,
      alarmDialog: false,
      workingTimeDialog: false,
      linkAddressDialog: false,
      choiceDialog: false,
      updateDialog: false, // tabel的编辑弹窗
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

      relaStatusMap: {},
      placeData: [], // 左边树形控件数据
      defaultProps: {
        label: 'label',
        children: 'children',
        id: 'districtCode',
      },
      filterText: '',
      iconVisible: false, // 左边树形控件的添加icon
      operation: Object.freeze({
        list: [
          { label: '编辑', command: 'edit', iconName: 'el-icon-edit' },
          { label: '删除', command: 'delete', variant: 'danger', iconName: 'el-icon-delete' },
        ],
        listWithSwitch: [
          { label: '开启', command: 'open', iconName: 'el-icon-open' },
          { label: '关闭', command: 'close', iconName: 'el-icon-turn-off' },
          { label: '编辑', command: 'edit', iconName: 'el-icon-edit' },
          { label: '删除', command: 'delete', variant: 'danger', iconName: 'el-icon-delete' },
        ],
      }),
      baseData: {}, // 基础信息
      // 查看 详情 弹框
      cityName: '',
      outputNumber: ['01', '02', '03', '04', '05', '06', '07', '08'],
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },

  created() {
    this.initPage()
    this.getList()
    this.getProTimesList()
  },

  activated() {
    this.getList()
    this.getProTimesList()
  },

  methods: {

    handleEditFromBaseInfo(editvisibel, data) {
      const dialog = this.editDialog
      dialog.visible = editvisibel
      this.openEditDialog({ id: data.devid })
    },
    initPage() {
      this.loadPageData()
        .catch(error => console.error(error))
    },

    getProTimesList() {
      proTimesApi.getProTimesList().then(res => {
        if (res.success) {
          this.proTimesIdList = res.data
        }
      })
    },

    filterNode(value, data, node) {
      if (!value) {
        return true
      }
      // const level = node.level
      const _array = [] // 这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _array, value)
      let result = false
      _array.forEach((item) => {
        result = result || item
      })
      return result
    },
    getReturnNode(node, _array, value) {
      const isPass = node.data && node.data.label && node.data.label.indexOf(value) !== -1
      isPass ? _array.push(isPass) : ''
      this.index++
      // console.log(this.index)
      if (!isPass && node.level !== 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value)
      }
    },

    handleDownload() {
      deviceApi.fetchTemplate()
    },

    reloadList(...args) {
      this.getList(...args)
    },

    getList() {
      this.listLoading = true
      const listQuery = {
        selfCode: '',
        selfLocation: '',
        devName: '',
        ipStart: '',
        ipEnd: '',
        status: '',
      }
      let province = []
      addressApi.getDistrict({ code: '' })
        .then(res => {
          // console.log(res)
          province = res.data
        })
      deviceApi.fetchList(listQuery).then(res => {
        this.relaStatusMap = res.data.relaStatusMap
        const data = res.data.page.result
        this.DataList = data
        // console.log(data)
        const places = []
        let proCode = ''
        data.forEach(item => {
          // console.log(item)
          if (item.province) {
            for (let i = 0; i < province.length; i++) {
              if (item.province === province[i].districtCode) {
                item.province = province[i].districtName
                proCode = province[i].districtCode
              }
            }
            places.push({
              label: item.province,
              type: 'province',
              code: proCode,
              children: [{
                label: item.city,
                type: 'city',
                code: item.city,
                children: [{
                  label: item.area,
                  type: 'area',
                  code: item.area,
                  children: [{
                    label: item.town,
                    type: 'town',
                    code: item.town,
                    children: [{
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
                    }],
                  }],
                }],
              }],
            })
          }
        })
        this.placeData = this.mapList(places)
        this.listLoading = false
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

    handleNodeOpen(data) {
      let arr = []
      addressApi.getDistrict({ code: data.code })
        .then(res => {
          arr = res.data
          this.placeData.map(item => {
            if (data.type === 'province') {
              if (item.label === data.label) {
                item.children.map(li => {
                  arr.map(obj => {
                    if (li.label === obj.districtCode) {
                      li.label = obj.districtName
                    }
                  })
                })
              }
            }
            if (data.type === 'city') {
              item.children.map(li => {
                if (li.label === data.label) {
                  this.cityName = li.label
                  li.children.map(obj => {
                    arr.map(str => {
                      if (obj.label === str.districtCode) {
                        obj.label = str.districtName
                      }
                    })
                  })
                }
              })
            }
            if (data.type === 'area') {
              item.children.map(city => {
                if (city.label === this.cityName) {
                  city.children.map(area => {
                    if (area.label === data.label) {
                      area.children.map(obj => {
                        arr.map(str => {
                          if (obj.label === str.districtCode) {
                            obj.label = str.districtName
                          }
                        })
                      })
                    }
                  })
                }
              })
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    handleNodeClick(data) {
      const list = this.DataList
      if (!data.children) {
        list.forEach(item => {
          if (data.id === item.devid) {
            this.baseData = item
            return
          }
        })
        this.listQuery.selfCode = data.code
        this.listLoading = true
        // addressApi.getDevByAddr({ params })
        sameApi.fetchList(this.listQuery)
          .then(res => {
            // console.log(res)
            const data = res.data.result
            this.list = this.transformListData(data)
            this.total = res.data.total
            let num1 = 0 // 状态正常
            let num2 = 0 // 状态异常
            data.forEach(item => {
              if (this.options[item.status].label === '正常') {
                num1 = num1 + 1
              } else {
                num2 = num2 + 1
              }
            })
            this.status = {
              total: data.length,
              normalNum: num1,
              abnormalNum: num2,
            }
            if (this.list.length < 1 && this.listQuery.pageNumber > 1) {
              this.listQuery.pageNumber--
            }
            this.listLoading = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    transformListData(list) {
      const DeviceTypeMap = this.DeviceTypeMap
      const Operation = this.operation
      return list.map(device => {
        device.s = {}
        device.c = {}
        const typeObj = DeviceTypeMap[device.devtypeid] || {}
        device.s.devType = typeObj.typeName || ''
        // 补光灯(3) 爆光灯(6) ，多 开启、关闭的操作
        if (device.devtypeid === 3 || device.devtypeid === 6) {
          device.c.operations = Operation.listWithSwitch
        } else {
          device.c.operations = Operation.list
        }

        return device
      })
    },

    async loadPageData() {
      const { data: DeviceTypes } = await sameApi.getType()
      this.DeviceTypes = DeviceTypes

      const DeviceTypeMap = DeviceTypes.reduce((obj, item) => {
        obj[item.id] = item
        return obj
      }, {})
      this.DeviceTypeMap = DeviceTypeMap
    },

    handleDel(id) {
      this.$confirm('你确定要永久删除该设备数据吗？').then(() => {
        this.delData(id)
      })
    },

    delData(id) {
      sameApi.del({ 'id': id }).then(ret => {
        if (ret.success) {
          this.$message({
            message: ret.message,
            type: 'success',
          })
          this.getList()
        }
      })
    },

    handleUpdate(id, devTypeId) {
      this.temp = { }
      sameApi.findById(id).then(ret => {
        const { devid, devtypeid, moduleChipId, devName, outputNumber, devStatus, status } = ret.data
        this.temp = {
          devid: devid,
          devtypeid: devtypeid,
          moduleChipId: moduleChipId,
          devName: devName,
          outputNumber: outputNumber,
          devStatus: devStatus,
          status: status,
        }
        this.updateDialog = true
        this.$nextTick(() => {
          this.$refs['Form'].clearValidate()
        })
      }).then(() => {
        sameApi.moduleId({ devTypeId: devTypeId, selfCode: this.code }).then(item => {
          this.moduleIdSelect = item.data
          this.updateDialog = true
          this.$nextTick(() => {
            this.$refs['Form'].clearValidate()
          })
        })
      })
    },

    updateData() {
      this.$refs['Form'].validate((validate) => {
        console.log(validate)
        if (validate) {
          // if (!this.outputNumber.indexOf(this.temp.outputNumber) < 0) {
          //   this.$message({
          //     message: '接口编号只能填写为以下数字“01，02，03，04，05，06，07，08”',
          //     type: 'error',
          //   })
          //   return
          // }
          sameApi.update(this.temp).then(ret => {
            if (ret.success) {
              this.$message({
                message: ret.message,
                type: 'success',
              })
              this.getList()
              this.updateDialog = false
            }
          })
        }
      })
    },

    handleDeviceOpen(row) {
      this.handleDeviceResetStatus({
        id: row.devid,
        isOpen: true,
        name: row.devName,
      })
    },

    handleDeviceClose(row) {
      this.handleDeviceResetStatus({
        id: row.devid,
        isOpen: false,
        name: row.devName,
      })
    },

    async handleDeviceResetStatus(options) {
      const {
        id,
        isOpen,
        name = '',
      } = options

      const actionName = isOpen ? '开启' : '关闭'
      const openStatus = isOpen ? 0 : 1

      const sendData = { deviceId: id, openStatus }

      if (!id) {
        this.$message.error('找不到 id ，无法' + actionName)
        console.error('handleDeviceResetStatus cannot found id', options)
        return
      }

      const confirmTask = () => {
        const type = 'warning'
        return this.$confirm(`确认要${actionName} ${name} 吗？`, actionName, { type })
          .then((data) => {
            console.log(options)
          })
          .catch(() => Promise.reject(null))
      }

      const executeTask = async() => {
        await sameApi.reset(sendData)
          .catch(() => Promise.reject(null))

        this.$message.success(`${name} 已${actionName}`)
      }

      try {
        await confirmTask()
        await executeTask()
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

    handleSetAllDefaultValeu() {
      deviceApi.setAllDefaultValue().then(ret => {
        this.$message({
          message: ret.message,
          type: 'success',
        })
      })
    },

    handleThreshold() {
      if (this.baseData.devid) {
        this.$router.push({ name: 'DeviceSettingThreshold', query: { tsId: this.baseData.devid, isThirdDev: 1 }})
      }
    },

    handleSuccess() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    onMouseEnter(node) {
      // console.log(node)
      if (node.childNodes.length !== 0) {
        this.iconVisible = true
      }
    },

    addNewSetting(node) {
      console.log(node)
      this.openEditDialog(node, true)
    },

    handleOperationBarCommand(command, row) {
      const id = row.devid
      // console.log(command)
      switch (command) {
        case 'Threshold':
          this.handleThreshold(id, row.ip)
          break

        case 'Edit':
          this.openEditDialog({ id })
          break

        case 'open':
          this.handleDeviceOpen(row)
          break

        case 'close':
          this.handleDeviceClose(row)
          break

        case 'edit':
          this.handleUpdate(row.devid, row.devtypeid)
          break

        case 'delete':
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

<style lang="scss" >

.machine-manufacturer-view{

.sf-filter-main{
  // height: auto;
  border: 1px #ccc solid;
}
.el-col-6{
  height: 100%;
}
.contentLeft{
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
}
.el-col-18{
  border-left:1px #ccc solid;
  height: 100%;
}
.contentRight{
  padding: 0 20px;
  box-sizing: border-box;
  height: 100%;
  > .el-row:nth-child(1){
    height: 40%;
  }
  > .el-row:nth-child(2){
    height: 60%;
  }
  .el-table{
    border: 1px solid #ccc;
    position: relative;
    overflow: auto;
    th{
      font-size: 14px;
    }
    td{
      font-size: 12px;
      padding: 5px 0;
    }
  }
  .el-table::before{
    height: 0;

  }
}
.el-table--outline-border tr:nth-child(7n) > td{
      border:none;
    }
.el-icon-plus{
  font-weight: bold;
  cursor: pointer;
}

p{
  // vertical-align: middle;
  line-height: 23px;
}

.el-popover{
  padding: 0 0 5px 10px;
  width: 120px;
  min-width: 120px;
}

.el-popper[x-placement^="bottom"]{
  margin-top:0;
}

.addDev{
  p{
    margin:5px 0;
    color: #454ead;
    cursor: pointer;
  }
}

.filter-tree{
  font-size: 14px;
}

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
    .svg-icon {
      font-size: 50px;
      height: auto;
      position: absolute;
      top: -15px;
    }
    .mess-name{
      position: absolute;
      bottom:30px;

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

.el-table__body-wrapper::-webkit-scrollbar-track {
  display: none; //Safari and Chrome
}

//设置滚动条宽度为0
// ::-webkit-scrollbar{
//   width:0;
// }

.clear{ clear: both; }

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

}

</style>
