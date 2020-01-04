<!--设置工期-->
<template>
  <div class="working-time-view">
    <div>
      <el-tag
        v-for="item in list"
        :key="item.id"
        closable
        :disable-transitions="false"
        @close="handleDel(item.id)"
      >
        <el-tooltip effect="dark" :content="item.name" placement="top-start">
          <span class="el-tag-name">
            {{ item.name }}
          </span>
        </el-tooltip>
      </el-tag>
    </div>

    <div class="text-align-center">
      <el-button type="primary" icon="el-icon-plus" circle @click="handleAdd" />
    </div>

    <!-- 弹框: 新增 -->
    <DialogContainerized
      v-if="createDialog"
      title="新增工期"
      :visible.sync="createDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form ref="createForm" :model="temp" :rules="rules" label-width="100px">
        <el-form-item label="工期名称" prop="name">
          <el-input v-model="temp.name" placeholder="工期名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false">取消</el-button>
        <el-button type="primary" @click="addData">确定</el-button>
      </span>
    </DialogContainerized>

  </div>
</template>

<script>
import workingTimeApi from '@/api/protimes'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'WorkingTime',
  components: { DialogContainerized },

  data() {
    return {

      list: null,
      listLoading: true,

      temp: {},

      operation: {
        list: [
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },

      rules: {
        name: [{ required: true, message: '请输入工期名称', trigger: 'change' }],
      },

      createDialog: false,
    }
  },

  activated() {
    this.getList()
  },

  created() {
    this.getList()
  },

  methods: {

    getList() {
      this.listLoading = true
      workingTimeApi.getProTimesList().then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },

    handleAdd() {
      this.temp = {}
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs['createForm'].clearValidate()
      })
    },

    addData() {
      this.$refs['createForm'].validate((validate) => {
        if (validate) {
          workingTimeApi.addProTimes(this.temp).then(ret => {
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

    handleDel(id) {
      this.$confirm('你确定要永久删除该工期数据吗？', '提示',
        { type: 'warning' }
      ).then(() => {
        this.delData(id)
      })
    },

    delData(id) {
      workingTimeApi.delProTimes({ id: id }).then(ret => {
        if (ret.success) {
          this.$message({
            message: ret.message,
            type: 'success',
          })
          this.getList()
        }
      })
    },

  },
}
</script>

<style lang="scss">
.working-time-view{
  .el-tag {
      margin: 0 10px 10px 0;
      width:270px;
      cursor: pointer;
    .el-tag-name{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 230px;
      display: inline-block;
    }
    .el-icon-close {
      top: -8px;
    }
  }
}
</style>
