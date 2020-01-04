<template>
  <div v-draggable="draggableValue" class="nav-menu" :class="navClass">
    <div ref="dragHandle" class="nav-header">
      <span>我的导航</span>
      <span
        class="icon-btn-fold"
        aria-hidden="true"
        :title="foldButton.title"
        @click.stop="headerIconButtonOnClick"
        @mousedown.stop
      >
        <svg-icon
          icon-class="thumb-tack"
        />
      </span>
    </div>

    <FitElScrollbar
      ref="scrollbar"
      class="nav-menu__inner"
      wrap-class="menu-scrollbar__wrap"
      :noresize="false"
    >
      <el-menu
        mode="vertical"
        :default-active="activeMen"
        :unique-opened="true"
        class="nav-menu__box"
      >
        <nav-menu-item
          v-for="menu in menus"
          :key="menu.path"
          :item="menu"
          :base-path="'/map'"
        />
      </el-menu>
    </FitElScrollbar>

    <!-- 侧边控制条 -->
    <div v-show="!stickOut" class="nav-control-bar">
      <div class="inner">
        <span>我的导航</span>
        <i class="icon el-icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import './nav-menu.scss'
import NavMenuItem from './NavMenuItem'
import { Draggable } from 'draggable-vue-directive'
import FitElScrollbar from '@/components/Scrollbar/FitElScrollbar'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import { getPosWithBoundaries } from '@/utils/physics'

const InitialPosTop = 90 // 初始 top
const InitialStickOut = true // 是否初始弹出
const StickOutOffsetX = 25 // 弹出时， x 的偏移量

export default {
  name: 'NavMenu',

  components: {
    FitElScrollbar,
    NavMenuItem,
  },

  directives: {
    Draggable,
  },

  data() {
    return {
      // 导航栏 固定展开伸出来
      stickOut: false,

      // 停靠在右边
      floatRight: false,

      draggableValue: {
        handle: undefined,
        resetInitialPos: true,
        initialPosition: {
          left: 0,
          top: InitialPosTop,
        },
        boundingElement: null,
        onPositionChange: this.onPositionChange,
        onDragEnd: this.onDragEnd,
      },
      currentPosition: {},
    }
  },

  computed: {
    menus() {
      return this.$store.getters.navRoutes
    },
    navClass() {
      // return this.stickOut ? 'stick' : ''
      return {
        'stick': this.stickOut,
        'float-right': this.floatRight,
      }
    },
    foldButton() {
      return {
        title: this.stickOut ? '收起' : '固定',
        class: this.stickOut ? 'el-icon-s-fold' : 'el-icon-s-unfold',
      }
    },
    activeMen() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
  },

  mounted() {
    const draggableValue = this.draggableValue

    draggableValue.handle = this.$refs.dragHandle
    draggableValue.boundingElement = this.$parent.$el
    this.$nextTick(() => (draggableValue.resetInitialPos = false))

    addResizeListener(draggableValue.boundingElement, this.boundsOnResize)
    this.$once('hook:beforeDestroy', () => {
      removeResizeListener(draggableValue.boundingElement, this.boundsOnResize)
    })

    this.headerIconButtonOnClick(InitialStickOut)
  },

  methods: {
    headerIconButtonOnClick(stickOut) {
      this.switchMenuStick(stickOut)

      // 设置为收起时，立即收起
      if (!this.stickOut) {
        // 收起
        // this.resetPosition({ left: 0 })
        this.autoAdhere()
      } else {
        // 固定
        this.autoStickOut()
        // this.resetPosition({ left: 25 })
      }
    },

    switchMenuStick: function(out) {
      this.stickOut = typeof out === 'boolean' ? out : !this.stickOut
      // console.log('switchMenuStick val[%o], now[%o]', out, this.stickOut)
    },

    onPositionChange(positionDiff, absolutePosition, event) {
      this.currentPosition = absolutePosition
      // console.log('onPositionChange', absolutePosition)
    },

    onDragEnd(positionDiff, absolutePosition, event) {
      const { left } = absolutePosition
      // console.log('onDragEnd', absolutePosition)

      if (left <= 20) {
        this.adhereTo(false)
        return
      }

      const boundingRect = this.draggableValue.boundingElement.getBoundingClientRect()
      const elementRect = this.$el.getBoundingClientRect()

      const rightBoundary = boundingRect.right
      const rectRight = left + elementRect.width

      if (rightBoundary - rectRight <= 20) {
        this.adhereTo(true)
        return
      }

      this.switchMenuStick(true)
      this.floatRight = false
    },

    // reset 位置
    // 以 currentPosition 的值为基准
    resetPosition(position = {}) {
      const draggableValue = this.draggableValue
      draggableValue.initialPosition = {
        ...(this.currentPosition || {}),
        ...position,
      }
      this.draggableValue.resetInitialPos = true
      this.$nextTick(() => (this.draggableValue.resetInitialPos = false))
    },

    /**
     * 使菜单粘附在侧边
     * @param {boolean} isRight - 指定在右边，否则在左边
     * @param [elementRect]
     * @param [boundingRect]
     */
    adhereTo(isRight, elementRect, boundingRect) {
      isRight = !!isRight

      let left

      if (!isRight) {
        // 左侧
        left = 0
      } else {
        // 右侧
        boundingRect = boundingRect || this.draggableValue.boundingElement.getBoundingClientRect()
        elementRect = elementRect || this.$el.getBoundingClientRect()

        left = boundingRect.right - elementRect.width
      }

      // 取消固定
      this.switchMenuStick(false)
      // 设置位置
      this.resetPosition({ left })
      // 记录粘附的 方向
      this.floatRight = isRight
    },

    // 自动根据位置，附着左侧或右侧
    autoAdhere(elementRect, boundingRect) {
      boundingRect = boundingRect || this.draggableValue.boundingElement.getBoundingClientRect()
      elementRect = elementRect || this.$el.getBoundingClientRect()

      const boundingCentralAxis = boundingRect.left + boundingRect.width / 2
      const elementCentralAxis = elementRect.left + elementRect.width / 2

      const isRight = boundingCentralAxis < elementCentralAxis
      this.adhereTo(isRight)
    },

    // 自动根据所在位置，弹出菜单
    autoStickOut() {
      let { left } = this.currentPosition
      left += StickOutOffsetX * (this.floatRight ? -1 : 1)
      this.resetPosition({ left })
    },

    boundsOnResize() {
      const adjustedPos = this.getAdjustedPos()
      const stickOut = this.stickOut
      const floatRight = this.floatRight

      // 菜单是否收起在右边
      const adhereToRight = !stickOut && floatRight

      // 调整一次位置
      if (adjustedPos) {
        this.resetPosition(adjustedPos)
      }

      // 调整了位置 或 原本吸附在右边，才需要做吸附处理
      if (adjustedPos || adhereToRight) {
        this.$nextTick(() => {
          stickOut
            ? this.autoAdhere() // 如果原本菜单是移出在中间（不收起）的，则根据调整后的位置自动附着
            : this.adhereTo(floatRight) // 如果原本是收起来的，resize 后也维持收起来，且在同一侧
        })
        console.log('boundsOnResize will be adhere...')
      }
    },

    /**
     * 获取调整过的位置，若不需要调整，返回 null
     *  什么时候会调整：
     *   resize 后， element 超出了边界
     *   调整后的位置，保证 element 全部位于边界内
     * @return {null|{top: number, left: number}}
     */
    getAdjustedPos() {
      const draggableValue = this.draggableValue

      const boundingRect = draggableValue.boundingElement.getBoundingClientRect()
      const elementRect = this.$el.getBoundingClientRect()

      const { left, top } = this.currentPosition

      const adjustedPos = getPosWithBoundaries(elementRect, boundingRect, left, top, draggableValue.boundingRectMargin)

      if (adjustedPos.left !== left || adjustedPos.top !== top) {
        // console.log('pos has adjusted...')
        return adjustedPos
      }

      return null
    },
  },
}
</script>

<style lang="scss">
</style>
