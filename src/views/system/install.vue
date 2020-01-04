<template>
  <div class="sys-install-view  module-content-box">
    <div class="sf-filter-container">

      <div class="sf-table-top-toolbar">
        <div class="inner">
          <el-button
            type="primary"
            class="filter-item"
            @click="scanDevice"
          >
            扫描设备
          </el-button>
        </div>
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
      <el-table-column label="MAC地址">
        <template slot-scope="scope">
          <span>{{ scope.row.mac }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备掩码">
        <template slot-scope="scope">
          <span>{{ scope.row.mask }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备网关">
        <template slot-scope="scope">
          <span>{{ scope.row.gateway }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务器IP">
        <template slot-scope="scope">
          <span>{{ scope.row.serverIp }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <div class="sf-table-heel-pagination">
      <el-pagination
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 弹框：编辑 -->
    <DialogContainerized
      title="初始化设备"
      :visible.sync="dialogFormVisibleEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form ref="formEdit" label-position="right" :rules="rules" :model="formEdit" label-width="100px">
        <el-form-item label="设备IP" prop="ip">
          <el-input v-model="formEdit.ip" placeholder="设备IP" />
        </el-form-item>
        <el-form-item label="设备掩码" prop="mask">
          <el-input v-model="formEdit.mask" placeholder="设备掩码" />
        </el-form-item>
        <el-form-item label="设备网关" prop="gateway">
          <el-input v-model="formEdit.gateway" placeholder="设备网关" />
        </el-form-item>
        <el-form-item label="服务器IP" prop="serverIp">
          <el-input v-model="formEdit.serverIp" placeholder="服务器IP" />
        </el-form-item>
        <el-form-item label="设备名称" prop="devName">
          <el-input v-model="formEdit.devName" placeholder="设备名称" />
        </el-form-item>
        <el-form-item label="点位编号" prop="selfCode">
          <el-input v-model="formEdit.selfCode" placeholder="点位编号" />
        </el-form-item>
        <el-form-item label="点位位置" prop="selfLocation">
          <el-input v-model="formEdit.selfLocation" placeholder="点位位置" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm('formEdit')">确 定</el-button>
      </div>
    </DialogContainerized>

  </div>
</template>

<script>
import { scanDevice, initDevice } from '@/api/install'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'Install',

  components: {
    DialogContainerized,
  },

  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
      },
      dialogFormVisibleEdit: false,
      dialogFormVisibleSetResource: false,
      formEdit: {
        command: '',
        mac: '',
        ip: '',
        mask: '',
        gateway: '',
        serverIp: '',
        devName: '',
        selfCode: '',
        selfLocation: '',
      },
      rules: {
        ip: [
          { required: true, message: '请输入IP', trigger: 'blur' },
        ],
        mask: [
          { required: true, message: '请输入掩码', trigger: 'blur' },
        ],
        gateway: [
          { required: true, message: '请输入网关', trigger: 'blur' },
        ],
        serverIp: [
          { required: true, message: '请输入服务器IP', trigger: 'blur' },
        ],
        devName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
        selfCode: [
          { required: true, message: '请输入点位编号', trigger: 'blur' },
        ],
        selfLocation: [
          { required: true, message: '请输入点位位置', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      scanDevice(this.listQuery).then(res => {
        if (res.success && res.data) {
          this.list = res.data.list
          this.total = res.data.total
        } else {
          this.$message({ message: res.message, type: 'error' })
        }
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
    handleEdit(info) {
      this.dialogFormVisibleEdit = true
      this.formEdit.command = info.command
      this.formEdit.mac = info.mac
      this.formEdit.ip = info.ip
      this.formEdit.mask = info.mask
      this.formEdit.gateway = info.gateway
      this.formEdit.serverIp = info.serverIp
    },
    editConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          initDevice(this.formEdit).then(res => {
            if (res.success) {
              this.$message({ message: '初始化设备成功', type: 'success' })
            } else {
              this.$message({ message: res.message, type: 'error' })
            }
            this.dialogFormVisibleEdit = false
            this.scanDevice()
          })
        } else {
          return false
        }
      })
    },
    scanDevice() {
      this.getList()
    },
  },
}
</script>

<style lang="scss">

</style>
