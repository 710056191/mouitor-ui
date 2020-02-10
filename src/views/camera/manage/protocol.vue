<template>
  <div class="camera-protocol-view">
    <!-- 主体内容 -->
    <SuiteTable
      ref="table"
      :table-props="tableProps"
    >
      <template v-slot:default>
        <div class="sf-table-top-toolbar">
          <div class="inner">
            <el-button type="primary" @click="addBtnOnClick">新增协议</el-button>
          </div>
        </div>
      </template>

      <template slot="append">
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="{ row }">
            <FUOperationBar
              :list="operation.list"
              @command="handleOperationBarCommand($event, row)"
            />
          </template>
        </el-table-column>
      </template>

    </SuiteTable>

    <DialogContainerized
      :title="dialog.isNew ? '新增协议' : '编辑协议' "
      append-to-body
      :visible.sync="dialog.visible"
    >
      <ProtocolEdit
        v-if="dialog.visible"
        :params="dialog.params"
        :is-new="dialog.isNew"
        @completed="editOnSuccess"
        @cancel="dialog.visible=false"
      />
    </DialogContainerized>
  </div>
</template>

<script>
import {
  fetchList,
  del as deleteProtocol,
} from '@/api/protocol'

import SuiteTable from '@/components/FormSuites/SuiteTable'
import FUOperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import ProtocolEdit from '@/views/camera/manage/components/ProtocolEdit'

// 协议优先级 txt
const ProtocolPriorityTextMap = {
  0: '',
  1: '默认',
}

export default {
  name: 'CameraManageProtocol',

  components: {
    SuiteTable,
    ProtocolEdit,
    DialogContainerized,
    FUOperationBar,
  },

  data() {
    const tablePropsValue = () => {
      const columns = [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'protocolName',
          label: '协议名称',
        },
        {
          prop: 'protocolDesc',
          label: '协议描述',
        },
        {
          prop: 'protocolValue',
          label: '协议字符',
        },
        {
          prop: 'username',
          label: '用户名',
        },
        {
          prop: 'priorityFlag',
          label: '默认协议',
          formatter(row, column, value) {
            return ProtocolPriorityTextMap[value]
          },
        },
      ]

      columns.forEach(col => {
        col.minWidth = '-'
      })
      Object.freeze(columns)

      const params = {
        deviceId: this.$route.params.id,
      }

      return {
        columns,

        fetch(params) {
          return fetchList(params)
        },

        params,
      }
    }

    return {
      tableProps: tablePropsValue(),

      operation: {
        list: [
          {
            label: '编辑',
            command: 'edit',
          },
          {
            label: '删除',
            command: 'delete',
            variant: 'danger',
          },
        ],
      },

      dialog: {
        visible: false,
        isNew: false,

        params: {
          id: '',
        },
      },
    }
  },

  methods: {
    reloadList(resetPageIndex = false) {
      this.$refs['table'].reload(resetPageIndex)
    },

    addBtnOnClick() {
      this.openEditDialog({
        // id: undefined,
        deviceId: this.$route.params.id,
      }, true)
    },

    openEditDialog(params, isNew) {
      const dialog = this.dialog

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

    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'edit':
          this.openEditDialog({
            id: row.deviceProtocolId,
            deviceId: this.$route.params.id,
          })
          break

        case 'delete':
          this.handleOperationDelete(row)
          break
        default:
      }
    },

    async handleOperationDelete(row = {}) {
      const {
        deviceProtocolId,
        protocolName = '',
      } = row

      if (!deviceProtocolId) {
        this.$message.error('找不到协议 id ，无法删除')
        console.error('[CameraManageProtocol] handleOperationDelete cannot found protocol id', row)
        return
      }

      const confirmTask = () => {
        const type = 'warning'
        return this.$confirm(`确认要删除 ${protocolName} 吗？`, '删除', { type })
          .catch(() => Promise.reject(null))
      }

      const deleteTask = async() => {
        await deleteProtocol({ id: deviceProtocolId })
          .catch(() => Promise.reject(null))

        this.$message.success(`${protocolName} 已删除`)
      }

      try {
        await confirmTask()
        await deleteTask()
        this.reloadList()
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
      this.dialog.visible = false
      this.reloadList()
    },
  },
}
</script>

<style lang="scss">
.camera-protocol-view {
  margin: 20px;

  .toolbar-box {
    float: right;
  }
}
</style>
