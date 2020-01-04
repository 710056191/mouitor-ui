<template>
  <div class="manufacturer-view module-content-box">
    <div class="sf-filter-container">

      <div style="margin-bottom:10px;">
        <el-alert
          :title="'点位编号：'+code"
          type="success"
          :description="'点位位置：'+location"
          :closable="false"
        />
      </div>

      <div class="filter-item">
        <el-button
          type="primary"
          :loading="listLoading"
          @click="getList"
        >刷新
        </el-button>
      </div>
    </div>

    <div class="sf-table-top-toolbar">
      <div class="inner">
        <el-button
          type="primary"
          class="filter-item"
          @click="handleAdd"
        >
          新增关联设备
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="handleThreshold"
        >
          查看阈值
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
      <el-table-column label="接口编号">
        <template slot-scope="scope">
          <span>{{ scope.row.outputNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备类型" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.s.devType }}</span>
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

      <el-table-column label="网络IP" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属模块ID">
        <template slot-scope="scope">
          <span>{{ scope.row.moduleChipId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="关联设备状态" prop="legalPerson" width="150">
        <template slot-scope="scope">
          <span>{{ options[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="关联设备状态描述" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="阈值是否初始化" width="150">
        <template slot-scope="scope">
          <span>{{ thresholdStatus[scope.row.thresholdStatus] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="250">
        <!-- <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" circle @click="handleUpdate(scope.row.devid, scope.row.devtypeid)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDel(scope.row.devid)" />
        </template> -->
        <template slot-scope="{ row }">
          <FUOperationBar
            :list="row.c.operations"
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

    <!-- 弹框：新增 -->
    <DialogContainerized
      v-if="createDialog"
      title="新增关联设备"
      :visible.sync="createDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form
        ref="createForm"
        :model="temp"
        :rules="rules"
        label-width="100px"
      >
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
        <el-form-item label="设备类型" prop="devtypeid">
          <el-select v-model="temp.devtypeid" placeholder="请选择设备类型" class="el-select-full" @change="deviceTypeChange">
            <el-option
              v-for="item in deviceTypeSelect"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="modelNumber">
          <el-select v-model="temp.modelNumber" placeholder="请选择设备型号" class="el-select-full">
            <el-option
              v-for="item in deviceLibrarySelect"
              :key="item.id"
              :label="item.modelNumber"
              :value="item.modelNumber"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="devName">
          <el-input v-model="temp.devName" placeholder="设备名称" class="filter-item" />
        </el-form-item>
        <el-form-item label="所属模块ID" prop="moduleChipId">
          <el-input v-model="temp.moduleChipId" placeholder="模块ID" class="filter-item" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false">取消</el-button>
        <el-button type="primary" @click="addData">确定</el-button>
      </span>
    </DialogContainerized>

    <!-- 弹框：编辑 -->
    <DialogContainerized
      v-if="updateDialog"
      title="编辑关联设备"
      :visible.sync="updateDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form ref="updateForm" :model="temp" :rules="rulesEdit" label-width="100px">
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
          <el-input v-model="temp.moduleChipId" placeholder="模块ID" class="filter-item" />
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
        <el-button type="primary" @click="updateData">确定</el-button>
      </span>
    </DialogContainerized>
  </div>
</template>

<script>
import sameApi from '@/api/sameMachine'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'DeviceRelatedDevice',
  components: {
    FUOperationBar,
    DialogContainerized,
  },
  // props: {
  //   location: { type: String, default: undefined },
  //   code: { type: [String, Number], default: undefined },
  // },
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
      // query params
      code: '',
      location: '',

      // 设备类型
      DeviceTypes: null,

      DeviceTypeMap: null,

      list: null,
      total: 0,
      listLoading: true,
      devId: null,
      province: {},
      city: {},
      area: {},
      town: {},
      listQuery: {
        selfCode: '',
        pageNumber: 1,
        pageSize: 10,
      },
      rules: {
        outputNumber: [{ required: true, message: '请选择接口编号', trigger: 'change' }],
        devtypeid: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        modelNumber: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        devName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
      },
      rulesEdit: {
        outputNumber: [{ required: true, message: '请选择接口编号', trigger: 'change' }],
        devName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
      },
      operation: Object.freeze({
        list: [
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
        listWithSwitch: [
          { label: '开启', command: 'open' },
          { label: '关闭', command: 'close' },
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete' },
        ],
      }),
      temp: {
        manufacturerTypes: [],
      },
      updateDialog: false,
      createDialog: false,
      options: {
        '0': '正常',
        '1': '故障',
        '2': '报警',
        '3': '停用',
        '4': '未启用',
      },
      thresholdStatus: {
        0: '未初始化',
        1: '初始化完成',
        2: '初始化中',
        3: '初始化失败',
      },
      getStatusText: {
        0: '正常',
        1: '异常',
        2: '报警',
        3: '停用',
        4: '已初始化',
      },
      getFaultStatusText: {
        1: '温度异常',
        2: '湿度异常',
        3: '电压异常',
        4: '网络异常',
        5: '断电异常',
        6: '其他',
      },
      outputNumber: ['01', '02', '03', '04', '05', '06', '07', '08'],
      // relaStatusMap: {},
      deviceTypeSelect: [],
      deviceLibrarySelect: [],
    }
  },

  mounted() {
    this.initPage()
    this.resetPage()
  },

  beforeRouteUpdate() {
    this.resetPage()
  },

  methods: {
    initPage() {
      this.loadPageData()
        .catch(error => console.error(error))
    },

    resetPage() {
      this.location = this.$route.query.location
      this.code = this.$route.query.code
      this.listQuery.selfCode = this.code
      this.devId = this.$route.query.devId
      this.getList()
    },

    getList() {
      this.listLoading = true
      sameApi.fetchList(this.listQuery).then(res => {
        // this.relaStatusMap = res.data.relaStatusMap
        const list = res.data.result || []

        this.total = res.data.total
        this.listLoading = false

        if (list.length < 1 && this.listQuery.pageNumber > 1) {
          this.listQuery.pageNumber--
          this.getList()
          return
        }
        this.list = this.transformListData(list)
      })
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

    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    async loadPageData() {
      const { data: DeviceTypes } = await sameApi.getType()
      Object.freeze(DeviceTypes)
      this.DeviceTypes = DeviceTypes

      const DeviceTypeMap = DeviceTypes.reduce((obj, item) => {
        obj[item.id] = item
        return obj
      }, {})
      Object.freeze(DeviceTypeMap)
      this.DeviceTypeMap = DeviceTypeMap
    },

    handleDel(id) {
      this.$confirm('你确定要永久删除该供应商数据吗？').then(() => {
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
    handleAdd() {
      this.temp = {
        devtypeid: '',
        selfCode: this.code,
        modelNumber: '',
        moduleChipId: '',
        devName: '',
        outputNumber: '',
      }
      sameApi.getType().then(ret => {
        this.deviceTypeSelect = ret.data
      })
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs['createForm'].clearValidate()
      })
    },
    addData() {
      this.$refs['createForm'].validate((validate) => {
        if (validate) {
          // if (this.outputNumber.indexOf(this.temp.outputNumber) < 0) {
          //   this.$message({
          //     message: '接口编号只能填写为以下数字“01，02，03，04，05，06，07，08,09”',
          //     type: 'error',
          //   })
          //   return
          // }
          sameApi.add(this.temp).then(ret => {
            if (ret.success) {
              this.$message({
                message: ret.message,
                type: 'success',
              })
              this.getList()
              this.createDialog = false
            }
          })
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
          this.$refs['updateForm'].clearValidate()
        })
      }).then(() => {
        sameApi.moduleId({ devTypeId: devTypeId, selfCode: this.code }).then(item => {
          this.moduleIdSelect = item.data
          this.updateDialog = true
          this.$nextTick(() => {
            this.$refs['updateForm'].clearValidate()
          })
        })
      })
    },
    updateData() {
      this.$refs['updateForm'].validate((validate) => {
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
    deviceTypeChange() {
      sameApi.getDeviceLibrary(this.temp.devtypeid).then(ret => {
        this.deviceLibrarySelect = ret.data
        this.temp.modelNumber = ''
      })
    },

    handleOperationBarCommand(command, row) {
      const id = row.devid
      switch (command) {
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
    handleThreshold() {
      this.$router.push({ name: 'DeviceSettingThreshold', query: { tsId: this.devId, isThirdDev: 1 }})
    },
  },
}
</script>

<style lang="scss">

</style>
