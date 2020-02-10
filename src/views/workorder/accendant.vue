<template>
  <div class="sys-accendant-view module-content-box">
    <div class="sf-filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="维修人员名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索
      </el-button>
    </div>

    <div class="sf-table-top-toolbar">
      <div class="inner">
        <el-button
          type="primary"
          class="filter-item"
          @click="openSetDialog(null, true)"
        >
          设置报警类型
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="openEditDialog(null, true)"
        >
          新增维修人员
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
      <el-table-column label="维修人员名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.mail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属供应商">
        <template slot-scope="scope">
          <span>{{ scope.row.manufacturerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目工期">
        <template slot-scope="scope">
          <span v-for="item in proTimesIdList" :key="item.id">
            <template v-if="item.id == scope.row.proTimesId">
              {{ item.name }}
            </template>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="是否接收通知" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.receiveStatus == 0">是</span>
          <span v-if="scope.row.receiveStatus == 1">否</span>
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

    <!-- 弹框：设置报警类型 -->
    <DialogContainerized
      :title="setDialog.isNew ? '设置报警类型' : '设置报警类型'"
      :visible.sync="setDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="800px"
    >
      <AlarmTypeDialog
        v-if="setDialog.visible"
        :params="setDialog.params"
        :is-new="setDialog.isNew"
        @completed="setOnSuccess"
        @cancel="setDialog.visible=false"
      />
    </DialogContainerized>

    <!-- 弹框: 新增/编辑 -->
    <DialogContainerized
      :title="editDialog.isNew ? '新增维修人员' : '编辑维修人员'"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="800px"
    >
      <AccendantEditDialog
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
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import accendantApi from '@/api/accendant'
import proTimesApi from '@/api/protimes'
import AlarmTypeDialog from './components/AlarmTypeDialog'
import AccendantEditDialog from './components/AccendantEditDialog'

export default {
  name: 'Accendant',

  components: {
    FUOperationBar,
    DialogContainerized,
    AlarmTypeDialog,
    AccendantEditDialog,
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
      setDialog: {
        visible: false,
        isNew: false,
        params: {},
      },
      listQuery: {
        name: '',
        selfLocation: '',
        devName: '',
        ipStart: '',
        ipEnd: '',
        status: '',
        pageNumber: 1,
        pageSize: 10,
      },

      proTimesIdList: null,

      AccendantEditDialog: false,
      AlarmTypeDialog: false,

      operation: {
        list: [
          { label: '编辑', command: 'Edit' },
          { label: '删除', command: 'Del' },
        ],
      },

    }
  },

  created() {
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

    reloadList(...args) {
      this.getList(...args)
    },

    getList() {
      this.listLoading = true
      accendantApi.findPage(this.listQuery).then(res => {
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

    handleDel(id) {
      console.log('dsfas' + id)
      this.$confirm('你确定要永久删除该设备数据吗？').then(() => {
        this.delData(id)
      })
    },

    delData(id) {
      accendantApi.recordDelete({ 'id': id }).then(ret => {
        if (ret.success) {
          this.$message({
            message: ret.message,
            type: 'success',
          })
          this.getList()
        }
      })
    },

    handleSuccess() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleOperationBarCommand(command, row) {
      const id = row.id

      switch (command) {
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

    openSetDialog(params, isNew) {
      const dialog = this.setDialog

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

    setOnSuccess() {
      this.setDialog.visible = false
      this.reloadList()
    },

  },

}
</script>

<style lang="scss">
.test-wins-choice{
  .el-checkbox{
    margin:5px 5px 5px 0;
    width: 200px;
  }
}
</style>
