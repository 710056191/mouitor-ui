<template>
  <div
    :style="boxStyle"
    class="widget-device-box"
  >
    <DeviceMain
      ref="mainPanel"
      :loading="loader.deviceList"
      :related-devices-loading="loader.relatedDevices"
      :device="deviceData"
      :related-devices="relatedDevices"
      class=""
      @edit-btn-click="handelEditBtnClick"
      @related-device-click="openRelatedPanel"
    />

    <transition name="el-zoom-in-bottom">
      <RelatedDevices
        v-show="relatedPanelVisible"
        ref="relatedPanel"
        :devices="relatedDevices"
        class="overlap-panel"
        @close="relatedPanelVisible = false"
      />
    </transition>

    <!-- 编辑设备箱 弹框 -->
    <!-- 复用设备箱设置组件 -->
    <SuiteDialogEditWrapper
      component="DeviceEdit"
      :visible.sync="editDialog.visible"
      v-bind="editDialog.config"
      @completed="editOnSuccess"
    />
  </div>
</template>

<script>
import DeviceMain from './DeviceMain'
import RelatedDevices from './RelatedDevices'
import { loadDevice, loadRelatedDevices } from './device.business'
import SuiteDialogEditWrapper from '@/components/FormSuites/SuiteDialogEditWrapper'
import DeviceEdit from '@/views/device/setting/components/DeviceEdit'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

export default {
  name: 'WidgetDevice',

  components: {
    DeviceEdit, // eslint-disable-line vue/no-unused-components
    SuiteDialogEditWrapper,
    DeviceMain,
    RelatedDevices,
  },

  props: {
    id: {
      type: [String, Number],
      required: true,
      // default: '299',
    },
  },

  data() {
    return {
      relatedPanelVisible: false,

      loader: {
        deviceList: false,
        relatedDevices: false,
      },

      pending: {
        type: null,
      },

      // 设备数据
      deviceData: {},

      // 关联设备
      relatedDevices: [],

      editDialog: {
        visible: false,

        config: {
          addedTitle: '新增设备箱',
          editTitle: '编辑设备箱',

          isNew: false,
          params: {
            id: '',
          },

          dialog: {
            width: '800px',
          },
        },
      },

      boxHeight: null,
    }
  },

  computed: {
    boxStyle() {
      return {
        height: (typeof this.boxHeight === 'number')
          ? this.boxHeight + 'px'
          : '',
      }
    },
  },

  watch: {
    id: {
      handler(val) {
        if (val) {
          this.reset()
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.initResizeHandler()
  },

  methods: {
    reset() {
      this.relatedPanelVisible = false
      this.reloadData()
        .finally(() => {
          this.containerOnResize()
          this.$nextTick(() => {
            this.$refs.mainPanel.resetScrollBarPos()
          })
        })
    },

    reloadData() {
      const id = this.id
      const loader = this.loader

      loader.deviceList = true
      return loadDevice(id)
        .then(data => {
          const latestId = this.id
          if (data.devid !== latestId) {
            // 跳过 连续触发时，中间的请求
            console.log('[WidgetDevice] reloadData skip', id, data)
            return
          }

          Object.freeze(data)
          this.deviceData = data

          loader.deviceList = false

          this.initRelatedDevicesData()
        })
    },

    async initRelatedDevicesData() {
      this.loader.relatedDevices = true // open loading

      const selfCode = this.deviceData.selfCode
      const list = await loadRelatedDevices(selfCode)
      this.relatedDevices = list

      this.loader.relatedDevices = false // close loading
    },

    emitClose() {
      this.$emit('close')
    },

    handelEditBtnClick() {
      this.openEditDialog({ id: this.id }, false)
    },

    openRelatedPanel() {
      this.relatedPanelVisible = true
      this.$nextTick(() => {
        this.$refs.relatedPanel.resetScrollBarPos()
      })
    },

    openEditDialog(params, isNew) {
      const dialog = this.editDialog
      dialog.config.params = params
      dialog.config.isNew = !!isNew
      dialog.visible = true
    },

    editOnSuccess() {
      this.editDialog.visible = false
      this.reset()
    },

    initResizeHandler() {
      const parentElm = this.$el.parentElement
      addResizeListener(parentElm, this.containerOnResize)

      this.$once('hook:beforeDestroy', () => {
        removeResizeListener(parentElm, this.containerOnResize)
      })
    },

    containerOnResize() {
      const scrollWrap = this.$refs.mainPanel.getScrollWrap()
      // const wrapClientHeight = scrollWrap.clientHeight
      const wrapScrollHeight = scrollWrap.scrollHeight

      // console.log('containerOnResize', wrapClientHeight, wrapScrollHeight)

      // 获取 当前盒子实际需要的高度 boxNeededHeight
      // 计算 父容器能容纳的最大高度 boxAdjustedMaxHeight
      // 若 boxNeededHeight > boxAdjustedMaxHeight ，
      //   设置 盒子的高度为 boxAdjustedMaxHeight
      const mainPanelExtraHeight = 30 // 头部
      const boxExtraDistance = 20 + 20 // 上下距离

      const parentElm = this.$el.parentElement
      const containerHeight = parentElm.clientHeight

      const boxNeededHeight = wrapScrollHeight + mainPanelExtraHeight
      const boxAdjustedMaxHeight = containerHeight - boxExtraDistance

      if (boxNeededHeight > boxAdjustedMaxHeight) {
        this.boxHeight = boxAdjustedMaxHeight
      } else {
        // this.boxHeight = null
        this.boxHeight = boxNeededHeight
      }
    },
  },
}
</script>

<style lang="scss">
.widget-device-box {
  position: relative;
  overflow: hidden;

  width: 380px;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(201, 201, 201, 0.75), 0 0 6px 0 rgba(201, 201, 201, 0.75);

  .overlap-panel {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
