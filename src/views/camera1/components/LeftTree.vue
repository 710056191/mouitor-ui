<template>
  <div class="tree-main">
    <div class="tree">
      <el-row>
        <el-col style="margin-bottom:20px;">
          <el-input
            v-model="filterText"
            placeholder="请输入搜索关键字"
          />
        </el-col>
        <el-col :span="22">
          <div style="font-weight: bold;">摄像头</div>
        </el-col>
        <el-col :span="2">
          <el-popover
            placement="bottom-end"
            trigger="click"
            visible-arrow
            title=""
          >
            <div class="addDev">
              <p @click="handleNewCamera">新增摄像头</p>
              <p @click="handleImageThreshold">图像阈值</p>
              <p @click="handleQuickSetting">一键设置</p>
              <p @click="handleImageAnalysis">启动图像分析</p>
            </div>
            <el-icon slot="reference" class="el-icon-plus" style="color: blue;" />
          </el-popover>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="placeData"
          :node-key="defaultProps.id"
          :filter-node-method="filterNode"
          @node-expand="handleNodeOpen"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node }" class="custom-tree-node" @mouseenter="onMouseEnter(node)" @mouseleave="iconVisible=false">
            <span>{{ node.label }}</span>
            <!-- <span v-show="iconVisible">
              <el-icon class="el-icon-plus" />
            </span> -->
          </span>
        </el-tree>
      </el-row>
    </div>
  </div>
</template>

<script>

import {
  fireQuickSetting,
  startImageAnalysis,
} from '@/api/camera'

export default {
  name: 'LeftTree',
  props: ['placeData', 'list'],
  data() {
    return {
      filterText: '',
      //   placeData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      iconVisible: false,
      choiceDialog: false,
      workingTimeDialog: false,
      baseData: {},
      loader: {
        quickSetting: false,
        imageAnalysis: false,
      },
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },

  methods: {
    handleNodeOpen() {

    },
    handleNodeClick(val) {
      const list = this.list
      if (!val.children) {
        list.forEach(item => {
          if (item.devid === val.id) {
            // this.baseData=item
            // console.log(item)
            this.$emit('listenTree', item)
          }
        })
      }
    },
    onMouseEnter(node) {
      // console.log(node)
    },
    handleNewCamera() {
      this.$emit('listenToTree', '新增摄像头')
    },
    handleSetAllDefaultValeu() {

    },
    filterNode(value, data, node) {
      if (!value) {
        return true
      }
      // const level = node.level
      const _array = [] // 这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _array, value)
      let result = false
      _array.forEach((item) => {
        result = result || item
      })
      return result
    },
    getReturnNode(node, _array, value) {
      const isPass = node.data && node.data.label && node.data.label.indexOf(value) !== -1
      isPass ? _array.push(isPass) : ''
      this.index++
      // console.log(this.index)
      if (!isPass && node.level !== 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value)
      }
    },

    handleImageThreshold() {
      this.$router.push({ name: 'CameraManageThreshold' })
    },

    handleQuickSetting() {
      this.loader.quickSetting = true

      fireQuickSetting()
        .then((res) => {
          this.$alert(res.message || '操作成功', { type: 'success' })
        })
        .finally(() => {
          this.loader.quickSetting = false
        })
    },

    handleImageAnalysis() {
      this.loader.imageAnalysis = true

      startImageAnalysis()
        .then((res) => {
          this.$alert(res.message || '操作成功', { type: 'success' })
        })
        .finally(() => {
          this.loader.imageAnalysis = false
        })
    },
  },
}
</script>

<style lang="scss">
.tree-main{

.el-popover{
  padding: 0 0 5px 10px;
  width: 120px;
  min-width: 120px;
}

.el-popper[x-placement^="bottom"]{
  margin-top:0;
}

}

.addDev{
  p{
    margin:5px 0;
    color: #454ead;
    cursor: pointer;
  }
}
</style>
