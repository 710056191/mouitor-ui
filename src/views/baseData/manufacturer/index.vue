<template>
  <div class="manufacturer-view module-content-box">
    <div class="sf-filter-container">

      <el-input
        v-model="listQuery.manufacturerName"
        placeholder="供应商名称"
        style="width: 200px;"
        class="filter-item"
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
          class="filter-item"
          :show-list="false"
          url="/manufacturer/upload.do"
          button-text="导入供应商Excel"
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
          新增供应商
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
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.manufacturerName }}</span>
        </template>
      </el-table-column>

      <!-- 编号 -->
      <el-table-column label="编号" prop="manufacturerCode" />

      <!-- 描述 -->
      <el-table-column label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.manufacturerDesc }}</span>
        </template>
      </el-table-column>

      <!-- TODO: -->
      <!-- 承包业务 -->
      <el-table-column label="承包业务">
        <template slot-scope="{row: {manufacturerTypes: types = []}}">
          <div>
            <span v-for="(item,index) of types" :key="index">
              {{ checkboxitem[item] }}<span v-if="index !== types.length -1 ">,</span>
            </span>
          </div>
        </template>
      </el-table-column>

      <!-- QQ -->
      <el-table-column label="QQ" prop="qq" />

      <!-- 微信 -->
      <el-table-column label="微信" prop="wechat" />

      <!-- 法人 -->
      <el-table-column label="法人" prop="legalPerson" />

      <!-- 营业执照 -->
      <el-table-column label="营业执照">
        <template slot-scope="{row: {otherFiles: files = []}}">
          <span>
            <a
              v-for="(file, index) in files"
              :key="index"
              :href="file.filePath"
              :title="file.name"
              target="_blank"
            >{{ '执照' + (index + 1) + (index === files.length -1 ? '' : ',') }}</a>
          </span>
        </template>
      </el-table-column>

      <!-- 相关证书 -->
      <el-table-column label="相关证书">
        <template slot-scope="{row: {otherFiles: files = []}}">
          <span>
            <a
              v-for="(file, index) in files"
              :key="index"
              :href="file.filePath"
              :title="file.name"
              target="_blank"
            >{{ '证书' + (index + 1) + (index === files.length -1 ? '' : ',') }}</a>
          </span>
        </template>
      </el-table-column>

      <!-- 创建时间 -->
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

    <!-- 弹框: 新增/编辑 -->
    <DialogContainerized
      :title="editDialog.isNew ? '新增供应商' : '编辑供应商'"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="800px"
    >
      <ManufacturerEdit
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
import { fetchManufacturerList, fetchManufacturerTemplate, delManufacturer } from '@/api/manufacturer'
import uploadComponent from '@/components/UploadComponents'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import ManufacturerEdit from './components/ManufacturerEdit'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'Manufacturer',
  components: {
    FUOperationBar,
    uploadComponent,
    ManufacturerEdit,
    DialogContainerized,
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
        manufacturerName: '',
        pageNumber: 1,
        pageSize: 10,
      },
      checkboxitem: {
        '1': '总包',
        '2': '电力',
        '3': '网络',
        '4': '设备',
        '5': '设计',
        '6': '监理',
        '7': '其他',
      },
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
      fetchManufacturerList(this.listQuery).then(res => {
        for (const p in res.data.result) {
          const manufacturerTypes = res.data.result[p].manufacturerTypes.split(',')
          if (!manufacturerTypes[manufacturerTypes.length - 1]) {
            manufacturerTypes.splice(manufacturerTypes.length - 1, 1)
          }
          res.data.result[p].manufacturerTypes = manufacturerTypes
        }
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
      fetchManufacturerTemplate()
    },
    handleDel(id) {
      this.$confirm('你确定要永久删除该供应商数据吗？').then(() => {
        this.delData(id)
      })
    },
    delData(id) {
      delManufacturer({ 'manufacturerId': id }).then(ret => {
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
    //   // this.$router.push({ name: 'ManufacturerAdd' })
    //   this.createDialog = true
    // },
    // handleUpdate(id) {
    //   this.$router.push({ name: 'ManufacturerEdit', query: { id: id }})
    // },
    handleSuccess() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleOperationBarCommand(command, row) {
      const id = row.manufacturerId
      switch (command) {
        case 'edit':
          this.openEditDialog({ id })
          break

        case 'delete':
          this.handleDel(row.manufacturerId)
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
