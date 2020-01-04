<template>
  <div class="sys-role-view module-content-box">
    <div class="sf-filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="角色名称"
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
        <el-button
          type="primary"
          class="filter-item"
          @click="createDialog=true;formAdd.name='';formAdd.desc=''"
        >
          新增角色
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
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色描述">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.modifyDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="260">
        <!-- <template slot-scope="scope">
          <el-tooltip content="设置资源" placement="top">
            <el-button icon="el-icon-key" circle @click="getResource(scope.row.id)" />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button icon="el-icon-edit" circle @click="handleUpdate(scope.row.id)" />
          </el-tooltip>
        </template> -->
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
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 弹框：新增 -->
    <DialogContainerized
      title="新增角色"
      :visible.sync="createDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form
        ref="createForm"
        :model="formAdd"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formAdd.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="formAdd.desc" placeholder="角色描述" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </span>
    </DialogContainerized>

    <!-- 弹框：编辑 -->
    <DialogContainerized
      title="编辑角色"
      :visible.sync="updateDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-form
        ref="updateForm"
        :model="formEdit"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-input v-model="formEdit.id" type="hidden" />
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formEdit.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="formEdit.desc" placeholder="角色描述" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateData">确 定</el-button>
      </span>
    </DialogContainerized>

    <!-- 弹框：设置资源 -->
    <DialogContainerized
      title="设置资源"
      :visible.sync="dialogFormVisibleSetResource"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="450px"
    >
      <el-tree
        ref="tree"
        :data="resourceTree"
        show-checkbox
        node-key="id"
        :default-expanded-keys="expandedKeys"
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSetResource = false">取 消</el-button>
        <el-button type="primary" @click="setResource()">确 定</el-button>
      </span>
    </DialogContainerized>

  </div>
</template>

<script>
import { findPage, findRecord, roleSave, roleDel, getResource, setResource } from '@/api/role'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'User',
  components: {
    FUOperationBar,
    DialogContainerized,
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      waitRoleList: null,
      alreadyRoleList: null,
      listQuery: {
        name: '',
        desc: '',
        pageNumber: 1,
        pageSize: 10,
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
        desc: [{ required: true, message: '请输入角色描述', trigger: 'change' }],
      },
      operation: {
        list: [
          { label: '设置资源', command: 'setResource' },
          { label: '编辑', command: 'edit' },
          { label: '删除', command: 'delete', variant: 'danger' },
        ],
      },
      updateDialog: false,
      createDialog: false,
      dialogFormVisibleSetResource: false,
      formEdit: {
        id: null,
        name: '',
        desc: '',
      },
      formAdd: {
        name: '',
        desc: '',
      },
      resourceTree: [],
      expandedKeys: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    handleUpdate(roleId) {
      this.updateDialog = true
      findRecord({ id: roleId }).then(res => {
        this.formEdit.id = res.data.id
        this.formEdit.name = res.data.name
        this.formEdit.desc = res.data.desc
      })
    },
    updateData() {
      this.$refs['updateForm'].validate((validate) => {
        if (validate) {
          roleSave(this.formEdit).then(ret => {
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
    handleAdd() {
      this.$refs['createForm'].validate((validate) => {
        if (validate) {
          roleSave(this.formAdd).then(ret => {
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
    getResource(roleId) {
      this.dialogFormVisibleSetResource = true
      this.formEdit.id = roleId
      this.resourceTree = []
      this.expandedKeys = []
      this.checkedKeys = []
      getResource({ roleId: roleId }).then(res => {
        const data = res.data
        // 构造角色资源树
        const tree = []
        for (const i in data) {
          if (data[i].parentId === null) {
            const parent = {}
            parent.id = data[i].id
            parent.label = data[i].name
            const childrens = []
            for (const j in data) {
              if (data[j].parentId === data[i].id) {
                const children = {}
                children.id = data[j].id
                children.label = data[j].name
                childrens.push(children)
              }
            }
            parent.children = childrens
            tree.push(parent)
            // 默认展开的父级
            if (data[i].checked === true) {
              this.expandedKeys.push(data[i].id)
            }
          } else {
            // 默认勾选的子级
            if (data[i].checked === true) {
              this.checkedKeys.push(data[i].id)
            }
          }
        }
        this.resourceTree = tree
      })
    },
    setResource() {
      // 获取所有选择的节点，包含半选的的父节点
      const nodes = this.$refs.tree.getCheckedNodes(false, true)
      const keys = nodes.map(node => node.id)

      const bindResourceId = keys.join(',')

      const roleId = this.formEdit.id
      setResource({ roleId: roleId, bindResourceId: bindResourceId }).then(res => {
        if (res.message !== '') {
          this.$message(res.message)
        } else {
          this.$message(res.success === true ? '设置资源成功' : '设置资源失败')
        }
      })
      this.dialogFormVisibleSetResource = false
    },
    // handleDel(ids) {
    //   alert(ids)
    //   this.$confirm('你确定要永久删除该角色吗？').then(() => {
    //     this.delData(ids)
    //   })
    // },
    // delData(roleId) {
    //   roleDel({ ids: roleId }).then(ret => {
    //     if (ret.success) {
    //       this.$message({
    //         message: ret.message,
    //         type: 'success',
    //       })
    //       this.getList()
    //     }
    //   })
    // },
    handleDel(id) {
      this.$confirm('你确定要永久删除该角色吗？').then(() => {
        this.delData(id)
      })
    },
    delData(id) {
      roleDel({ id: id }).then(ret => {
        if (ret.success) {
          this.$message({
            message: ret.message,
            type: 'success',
          })
          this.getList()
        }
      })
    },
    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'edit':
          this.handleUpdate(row.id)
          break

        case 'setResource':
          this.getResource(row.id)
          break

        case 'delete':
          this.handleDel(row.id)
          break

        default:
          console.warn('unknown command:', command)
          break
      }
    },
  },
}
</script>

<style lang="scss">

</style>
