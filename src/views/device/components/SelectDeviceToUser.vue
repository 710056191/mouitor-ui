<template>
  <div class="select-device-to-group">
    <div>已选 <span style="color:#0e1587;font-weight: 600">{{ checked.length }}</span> 设备箱</div>
    <div class="tree-container box-spacing">
      <el-scrollbar
        wrap-class="tree-scrollbar__wrap"
      >
        <!-- <el-tree
          ref="tree"
          v-loading="loading.initial"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          node-key="nodeKey"
          show-checkbox
          class="tree"
        /> -->
        <el-checkbox-group v-model="checked" @change="handleCheckedChange">
          <el-checkbox v-for="item in treeData" :key="item.nodeKey" :label="item.nodeKey">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
    </div>

    <div class="box-spacing">
      <el-select
        v-model="selectedUser"
        placeholder="请选择管理员"
        filterable
        class="el-select-full"
      >
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="item.username"
          :value="item.id"
        />
      </el-select>
    </div>

    <div slot="footer" class="operation-bar">
      <el-button :disabled="!canBeClosed" @click="emitCancel">取消</el-button>
      <el-button type="primary" :loading="loading.update" @click="handleConfirm">确定</el-button>
    </div>

  </div>
</template>

<script>
import { addDeviceUser, findDevNoRelation } from '@/api/deviceUserManage'

export default {
  name: 'SelectDeviceToUser',

  data() {
    return {
      defaultProps: {
        label: 'label',
        children: 'children',
      },

      userList: null,
      defineGroupList: null,

      treeData: null,
      // treeDefaultExpandedKeys: [-1],
      checked: [],
      isIndeterminate: true, // checked 是否选中
      selectedUser: '',

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
      // return getRelation()
      return findDevNoRelation()
        .then(res => res.data)
    },

    transformInitialData(resData) {
      // const { user, deviceGroup = [] } = resData
      // const tree = deviceGroup.map(group => {
      //   const { defineGroup, devices = [] } = group
      //   const children = devices.map(deviceItem => {
      //     return {
      //       label: deviceItem.devName,
      //       nodeKey: `${deviceItem.devid}`,
      //     }
      //   })

      //   return {
      //     label: defineGroup.devGroupName,
      //     nodeKey: '_groundId_' + defineGroup.devGroupId,
      //     children,
      //   }
      // })

      const tree = []
      if (resData) {
        const { users, devices } = resData
        devices.map(item => {
          tree.push({
            label: item.devName,
            nodeKey: `${item.devid}`,
          })
        })
        console.log(tree)
        this.userList = users
        this.treeData = this.unique(tree, ['nodeKey'])
      }
    },

    // 根据数组中的某一对象去重数组
    unique(arr, u_key) {
      const map = new Map()
      arr.forEach((item, index) => {
        if (!map.has(item[u_key])) {
          map.set(item[u_key], item)
        }
      })
      return [...map.values()]
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

    handleCheckedChange(value) {
      this.checked = value
    },

    produceRequestData() {
      /** @type {Array} */
      // const keys = this.getCheckedKeys()
      const keys = this.checked
      const userId = this.selectedUser
      console.log(keys)

      if (!keys.length) {
        this.$message.error('没有选择设备')
        return
      }
      if (!userId) {
        this.$message.error('没有选择管理员')
        return
      }

      const keyIdsStr = keys
        .filter(
          (/** @type string */key) => {
            return !key.startsWith('_groundId_')
          },
        )
        .join(',')

      return {
        array: keyIdsStr,
        userId,
      }
    },

    requestUpdate(data) {
      // console.log('requestUpdate', data)
      // return Promise.resolve()
      return addDeviceUser(data)
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
    height: 300px;
    overflow-y: auto;
    padding: 10px;
    text-align: center;
    .el-checkbox{
      width: 33%;
      margin: 0 ;
      overflow: hidden;
    }
  }

  //   .tree {
  //   }

  //   & /deep/ .tree-scrollbar__wrap {
  //
  //   }
  // }

  .operation-bar{
    text-align: right;
  }
}
</style>
