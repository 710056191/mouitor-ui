<template>
  <div class="deviceLibrary-view module-content-box">
    <div class="sf-filter-container">

      <el-input
        v-model="listQuery.modelNumber"
        placeholder="设备型号"
        style="width: 200px;"
        class="filter-item"
        :clearable="true"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />

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
        <uploadComponent
          :show-list="false"
          url="/deviceLibrary/upload.do"
          button-text="导入Excel"
          class="filter-item"
          @success="handleSuccess"
        />
        <el-button
          type="primary"
          class="filter-item"
          @click="handleDownloadTemplate"
        >
          模板下载
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="openEditDialog(null, true)"
        >
          新增设备库
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

      <!-- 名称 -->
      <el-table-column label="名称" prop="name" />

      <!-- 设备型号 -->
      <el-table-column label="设备型号" prop="modelNumber" />

      <!-- 设备类型 -->
      <el-table-column label="设备类型">
        <template slot-scope="scope">
          <span>{{ deviceTypes[scope.row.deviceType] }}</span>
        </template>
      </el-table-column>

      <!-- 厂家 -->
      <el-table-column label="厂家" prop="manufacturerName" />

      <!-- 工作电压 -->
      <el-table-column label="工作电压">
        <template v-if="scope.row.voltage" slot-scope="scope">
          <span>{{ scope.row.voltage }}V</span>
        </template>
      </el-table-column>

      <!-- AC/DC -->
      <el-table-column label="AC/DC">
        <template v-if="scope.row.voltageType" slot-scope="scope">
          <span>{{ scope.row.voltageType }}V</span>
        </template>
      </el-table-column>

      <!-- 标准功率 -->
      <el-table-column label="标准功率">
        <template v-if="scope.row.standardPower" slot-scope="scope">
          <span>{{ scope.row.standardPower }}W</span>
        </template>
      </el-table-column>

      <!-- 电压上限 -->
      <el-table-column label="电压上限">
        <template v-if="scope.row.voltageMax" slot-scope="scope">
          <span>{{ scope.row.voltageMax }}V</span>
        </template>
      </el-table-column>

      <!-- 电压下限 -->
      <el-table-column label="电压下限">
        <template v-if="scope.row.voltageMin" slot-scope="scope">
          <span>{{ scope.row.voltageMin }}V</span>
        </template>
      </el-table-column>

      <!-- 电流上限 -->
      <el-table-column label="电流上限">
        <template v-if="scope.row.electricityMax" slot-scope="scope">
          <span>{{ scope.row.electricityMax }}A</span>
        </template>
      </el-table-column>

      <!-- 电流下限 -->
      <el-table-column label="电流下限">
        <template v-if="scope.row.electricityMin" slot-scope="scope">
          <span>{{ scope.row.electricityMin }}A</span>
        </template>
      </el-table-column>

      <!-- 温度上限 -->
      <el-table-column label="温度上限">
        <template v-if="scope.row.temperatureMax" slot-scope="scope">
          <span>{{ scope.row.temperatureMax }}℃</span>
        </template>
      </el-table-column>

      <!-- 温度下限 -->
      <el-table-column label="温度下限">
        <template v-if="scope.row.temperatureMin" slot-scope="scope">
          <span>{{ scope.row.temperatureMin }}℃</span>
        </template>
      </el-table-column>

      <!-- 湿度上限 -->
      <el-table-column label="湿度上限">
        <template v-if="scope.row.humidityMax" slot-scope="scope">
          <span>{{ scope.row.humidityMax }}Pa</span>
        </template>
      </el-table-column>

      <!-- 湿度下限 -->
      <el-table-column label="湿度下限">
        <template v-if="scope.row.humidityMin" slot-scope="scope">
          <span>{{ scope.row.humidityMin }}Pa</span>
        </template>
      </el-table-column>

      <el-table-column label="转速上限">
        <template slot-scope="scope">
          <span>{{ scope.row.fanSpeedMax }}<template v-if="scope.row.fanSpeedMax">转/s</template></span>
        </template>
      </el-table-column>

      <el-table-column label="转速下限">
        <template slot-scope="scope">
          <span>{{ scope.row.fanSpeedMin }}<template v-if="scope.row.fanSpeedMin">转/s</template></span>
        </template>
      </el-table-column>

      <!-- 技术资料 -->
      <el-table-column label="技术资料">
        <template slot-scope="{row: {technicalDataFiles: files = []}}">
          <span
            v-for="(file, index) in files"
            :key="index"
          >
            <el-tooltip :content="file.name" placement="top">
              <el-link
                :href="file.filePath"
                :title="file.name"
                icon="el-icon-download"
                target="_blank"
              >{{ '资料' + (index + 1) + (index === files.length -1 ? '' : ',') }}
              </el-link>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="{ row }">
          <FUOperationBar
            :list="operation.list"
            @command="handleOperationBarCommand($event, row)"
          />
        </template>
      </el-table-column>
    </el-table>

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

    <!-- 弹框：编辑 -->
    <DialogContainerized
      :title="editDialog.isNew ? '新增设备库' : '编辑设备库'"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="800px"
    >
      <DeviceLibraryEdit
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
  fetchDeviceLibraryList,
  fetchDeviceLibraryTemplate,
  delDeviceLibrary,
} from '@/api/deviceLibrary'
// import manufacturerApi from '@/api/manufacturer'
import uploadComponent from '@/components/UploadComponents'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DeviceLibraryEdit from './components/DeviceLibraryEdit'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'DeviceLibrary',
  components: {
    FUOperationBar,
    uploadComponent,
    DeviceLibraryEdit,
    DialogContainerized,
  },
  data() {
    return {
      url: '/deviceLibrary/devLibUpload.do',
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
        modelNumber: undefined,
        typeCode: undefined,
        pageNumber: 1,
        pageSize: 10,
      },
      temp: {
        manufacturerTypes: [],
      },
      rules: {
        modelNumber: [{ required: true, message: '请输入设备型号', trigger: 'change' }],
      },
      deviceTypes: {
        1: '监控终端',
        2: '摄像头',
        3: '补光灯',
        4: '机箱',
        5: '风扇',
        6: '爆光灯',
        7: '光猫',
        8: '加热器',
      },
      manufacturers: [],
      operation: {
        list: [
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },
    }
  },
  activated() {
    this.getList()
    // manufacturerApi.findManufacturer().then(ret => {
    //   this.manufacturers = ret.data
    // })
  },
  created() {
    this.getList()
    // manufacturerApi.findManufacturer().then(ret => {
    //   this.manufacturers = ret.data
    // })
  },
  methods: {
    reloadList(...args) {
      this.getList(...args)
    },
    getList() {
      this.listLoading = true
      fetchDeviceLibraryList(this.listQuery).then(res => {
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
    handleDownloadTemplate() {
      fetchDeviceLibraryTemplate()
    },
    handleDel(id) {
      this.$confirm('你确定要永久删除该设备数据吗？').then(() => {
        this.delData(id)
      })
    },
    delData(id) {
      delDeviceLibrary(id).then(ret => {
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
    //   this.$router.push({ name: 'DeviceLibraryAdd' })
    // },
    // handleUpdate(id) {
    //   this.$router.push({ name: 'DeviceLibraryEdit', query: { id: id }})
    // },
    handleSuccess() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleOperationBarCommand(command, row) {
      const id = row.id
      switch (command) {
        case 'edit':
          this.openEditDialog({ id })
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

<style lang="scss">

</style>
