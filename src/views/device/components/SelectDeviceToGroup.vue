<template>
  <div class="select-device-to-group">
    <div class="tree-container box-spacing">
      <el-scrollbar
        wrap-class="tree-scrollbar__wrap"
      >
        <el-tree
          ref="tree"
          v-loading="loading.initial"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          node-key="nodeKey"
          show-checkbox
          class="tree"
        />
      </el-scrollbar>
    </div>

    <div class="box-spacing">
      <el-select
        v-model="selectedGroup"
        placeholder="请选择设备分组"
        filterable
        class="el-select-full"
      >
        <el-option
          v-for="item in defineGroupList"
          :key="item.devGroupId"
          :label="item.devGroupName"
          :value="item.devGroupId"
        />
      </el-select>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button :disabled="!canBeClosed" @click="emitCancel">取消</el-button>
      <el-button type="primary" :loading="loading.update" @click="handleConfirm">确定</el-button>
    </div>

  </div>
</template>

<script>
import { getDevAndGro, addDeviceGrouping } from '@/api/deviceGrouping'

export default {
  name: 'SelectDeviceToGroup',

  data() {
    return {
      defaultProps: {
        label: 'label',
        children: 'children',
      },

      defineGroupList: null,

      treeData: null,
      // treeDefaultExpandedKeys: [-1],

      selectedGroup: '',

      loading: {
        initial: false,
        update: false,
      },
    }
  },

  computed: {
    canBeClosed() {
      return !this.loading.update
    },
  },

  mounted() {
    this.initData()
      .catch(() => {
      })
  },

  methods: {
    async initData() {
      this.loading.initial = true
      const resultData = await this.requestInitialData()
      this.transformInitialData(resultData)
      this.loading.initial = false
    },

    requestInitialData() {
      return getDevAndGro()
        .then(res => res.data)
    },

    transformInitialData(resData) {
      this.defineGroupList = resData.defineGroupList

      let list = resData.deviceList || []
      list = list.map(item => {
        return {
          label: item.devName,
          nodeKey: item.devid,
        }
      })

      console.log(resData)

      this.treeData = [{
        label: '全部设备',
        children: list,
        nodeKey: -1,
      }]
    },

    handleConfirm() {
      this.beforeUpdate()
    },

    async beforeUpdate() {
      const requestData = this.produceRequestData()
      if (!requestData) {
        return
      }

      this.loading.update = true
      const updateResult = await this.requestUpdate(requestData)

      this.loading.update = false
      if (!updateResult) {
        return
      }
      this.emitSuccess(updateResult)
    },

    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys()
    },

    produceRequestData() {
      /** @type {Array} */
      const keys = this.getCheckedKeys()
      const groupId = this.selectedGroup

      if (!keys.length) {
        this.$message.error('没有选择设备')
        return
      }
      if (!groupId) {
        this.$message.error('没有选择分组')
        return
      }

      const rootIdx = keys.indexOf(-1)
      if (rootIdx > -1) {
        keys.splice(rootIdx, 1)
      }

      return {
        array: keys.join(','),
        groupId,
      }
    },

    requestUpdate(data) {
      // console.log('requestUpdate', data)
      // return Promise.resolve()
      return addDeviceGrouping(data)
        .catch(() => {
          return null
        })
    },

    emitSuccess(arg) {
      this.$emit('success', arg)
    },

    emitCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.select-device-to-group {
  .box-spacing {
    margin-bottom: 20px;
  }

  .tree-container {
    border: 1px solid $page-border-color-base;

    .tree {
    }

    & /deep/ .tree-scrollbar__wrap {
      height: 300px;
    }
  }

  .dialog-footer {
    text-align: right;
  }
}
</style>
