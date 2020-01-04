<template>
  <div class="procurement-view module-content-box">
    <div class="sf-filter-container">
      <el-input
        v-model="listQuery.contractCode"
        placeholder="合同编号"
        style="width: 200px;"
        class="filter-item"
        :clearable="true"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.manufacturerCode"
        placeholder="供应商编号"
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
          url="/procurement/upload.do"
          button-text="导入采购信息文件"
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
          新增采购库
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
      <el-table-column label="合同编号" prop="contractCode" />

      <!-- 编号 -->
      <el-table-column label="供应商编号" prop="manufacturerCode" />

      <!-- 描述 -->
      <el-table-column label="检索内容" prop="retrievalContent" />

      <!-- TODO: -->
      <!-- 承包业务 -->
      <el-table-column label="合同日期" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.contractDateStart | parseTime('{y}/{m}/{d}') }}-{{ scope.row.contractDateEnd | parseTime('{y}/{m}/{d}') }}</span>
        </template>
      </el-table-column>

      <!-- qq -->
      <el-table-column label="验收日期" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.checkDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <!-- 微信 -->
      <el-table-column label="设计(供应商)">
        <template slot-scope="scope">
          <span>{{ scope.row.design }}</span>
        </template>
      </el-table-column>

      <!-- 法人 -->
      <el-table-column label="监理(供应商)">
        <template slot-scope="scope">
          <span>{{ scope.row.supervisor }}</span>
        </template>
      </el-table-column>

      <!-- 营业执照 -->
      <el-table-column label="招标文件">
        <template slot-scope="{row: {bidinvitingFileUrls: files = []}}">
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
              >{{ '文件' + (index + 1) + (index === files.length -1 ? '' : ',') }}</el-link>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>

      <!-- 相关证书 -->
      <el-table-column label="投标文件">
        <template slot-scope="{row: {bidFileUrls: files = []}}">
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
              >{{ '文件' + (index + 1) + (index === files.length -1 ? '' : ',') }}</el-link>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>

      <!-- 相关证书 -->
      <el-table-column label="合同文件">
        <template slot-scope="{row: {contractFileUrls: files = []}}">
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
              >{{ '文件' + (index + 1) + (index === files.length -1 ? '' : ',') }}</el-link>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>

      <!-- 相关证书 -->
      <el-table-column label="合同文件">
        <template slot-scope="{row: {checkFileUrls: files = []}}">
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
              >{{ '文件' + (index + 1) + (index === files.length -1 ? '' : ',') }}</el-link>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>

      <!-- 创建时间 -->
      <el-table-column label="运维时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.maintenanceTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
      :title="editDialog.isNew ? '新增采购库' : '编辑采购库'"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="800px"
    >
      <ProcurementEdit
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
import { fetchProcurementList, fetchProcurementTemplate, delProcurement } from '@/api/procurement'
import uploadComponent from '@/components/UploadComponents'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import ProcurementEdit from './components/ProcurementEdit'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'Procurement',
  components: {
    FUOperationBar,
    uploadComponent,
    ProcurementEdit,
    DialogContainerized,
  },
  data() {
    return {
      url: '/procurement/proUpload.do',
      list: null,
      total: 0,
      manufacturers: '',
      listLoading: true,
      editDialog: {
        visible: false,
        isNew: false,
        params: {
          id: '',
        },
      },
      listQuery: {
        contractCode: '',
        manufacturerCode: '',
        pageNumber: 1,
        pageSize: 10,
      },
      temp: {},
      rules: {
        contractCode: [{ required: true, message: '请输入合同编号', trigger: 'change' }],
        manufacturerCode: [{ required: true, message: '请输入采购商', trigger: 'change' }],
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
      fetchProcurementList(this.listQuery).then(res => {
        this.list = res.data.result
        this.total = res.data.total
        this.listLoading = false
        if (this.list.length < 1 && this.listQuery.pageNumber > 1) {
          this.listQuery.pageNumber--
          this.getList()
        }
      })
    },
    handleSuccess() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleDownloadTemplate() {
      fetchProcurementTemplate()
    },
    handleDel(id) {
      this.$confirm('你确定要永久删除该采购数据吗？').then(() => {
        this.delData(id)
      })
    },
    delData(id) {
      delProcurement(id).then(ret => {
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
    //   this.$router.push({ name: 'ProcurementAdd' })

    // },
    // handleUpdate(id) {
    //   this.$router.push({ name: 'ProcurementEdit', query: { id: id }})
    // },
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
