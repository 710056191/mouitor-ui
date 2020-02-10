<!--
fix resize bug:

原因：
因为 el-scrollbar 只监听内部 view resize ，而不监听本身 的resize，
所以在外围 resize 后，滚动条长度会异常

解决：
对 scrollbar 根元素添加 resize 监听，触发其内部 update 方法
-->

<template>
  <ElScrollbar
    ref="scrollbar"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </ElScrollbar>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

export default {
  name: 'FitElScrollbar',

  inheritAttrs: false,

  mounted() {
    const scrollbar = this.$refs.scrollbar
    addResizeListener(scrollbar.$el, scrollbar.update)

    this.$once('hook:beforeDestroy', () => {
      removeResizeListener(scrollbar.$el, scrollbar.update)
    })
  },

  methods: {
    getScrollbar() {
      return this.$refs.scrollbar
    },

    getScrollbarWrap() {
      const scrollbar = this.getScrollbar()
      return scrollbar && scrollbar.$refs.wrap
    },

    resetBarPos() {
      // TODO:FIX 以下代码会导致 mounted 里注册的 resize 无效果
      // const wrap = this.getScrollbarWrap()
      // wrap.scrollLeft = 0
      // wrap.scrollTop = 0
    },
  },
}
</script>
