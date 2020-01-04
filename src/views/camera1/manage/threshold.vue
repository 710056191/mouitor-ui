<template>
  <div class="camera-manage-threshold-view">
    <el-search-table-pagination
      ref="table"
      list-field="data.result"
      total-field="data.total"
      page-index-key="pageNumber"
      page-size-key="pageSize"
      :columns="tableConfig.columns"
      :fetch="tableConfig.fetchFunc"
      :pagination-layout="tableConfig.pagination.layout"
    >

      <template slot="append">
        <el-table-column label="操作" width="100">
          <template slot-scope="{ row }">
            <operation-bar
              :list="tableConfig.operation.list"
              @command="handleOperationBarCommand($event, row)"
            />
          </template>
        </el-table-column>
      </template>

    </el-search-table-pagination>

    <dialog-containerized
      title="编辑图像阈值"
      append-to-body
      :visible.sync="dialog.visible"
    >
      <ThresholdEdit
        v-if="dialog.visible"
        :params="dialog.editParams"
        @completed="thresholdEditOnSuccess"
        @cancel="dialog.visible=false"
      />
    </dialog-containerized>
  </div>
</template>

<script type="text/jsx">
import ElSearchTablePagination from 'el-search-table-pagination/packages/search-table-pagination'
import { fetchList } from '@/api/threshold'
import OperationBar from '@/components/FormUnit/OperationBar/index'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'
import ThresholdEdit from '@/views/camera/manage/components/ThresholdEdit'

export default {
  name: 'CameraManageThreshold',

  components: {
    ThresholdEdit,
    DialogContainerized,
    OperationBar,
    ElSearchTablePagination,
  },

  data() {
    return {
      tableConfig: {
        columns: [
          {
            prop: 'threshold',
            label: '阈值',
            minWidth: '-',
          },
          {
            prop: 'hamming',
            label: '图片相似度',
            minWidth: '-',
          },
          {
            prop: 'binaryThreshold',
            label: '二值化阈值',
            minWidth: '-',
          },
          {
            prop: 'binaryPercent',
            label: '二值化比值',
            minWidth: '-',
          },
        ],

        fetchFunc(params) {
          return fetchList(params)
        },

        operation: {
          list: [
            {
              label: '编辑',
              command: 'edit',
            },
          ],
        },

        pagination: {
          layout: 'total, sizes, prev, pager, next, jumper',
        },
      },

      dialog: {
        visible: false,
        editParams: {
          id: '',
        },
      },
    }
  },

  methods: {
    reloadList(resetPageIndex = false) {
      this.$refs['table'].searchHandler(arguments[0])
    },

    handleOperationBarCommand(command, row) {
      switch (command) {
        case 'edit':
          this.dialog.editParams = {
            id: row.thresholdId,
          }
          this.dialog.visible = true
          break
        default:
      }
    },

    thresholdEditOnSuccess(res) {
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
.camera-manage-threshold-view {
  margin: 20px;
}
</style>
