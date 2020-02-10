<!--
ElDialog 的封装
加上了内容滚动条的支持

prop, listener:
 除组件自身定义的外，其他全部透传给 ElDialog

TODO:
现在滚动条的高度由 css 设置，计算过程固定了 dialog header 高度
改成根据 header 高度动态设定
  可能方案：css 限制 dialog 的高度（现在是限制的是 scrollbar_wrap 高度），动态设置 scrollbar_wrap 的高度

-->

<template>
  <el-dialog
    v-bind="$attrs"
    :visible.sync="innerVisible"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :class="['dialog-containerized', { 'dialog-containerized--fullscreen': isFullscreen } ]"
    :custom-class="dialogCustomClass"
    top=""
    v-on="$listeners"
  >
    <template v-if="$scopedSlots.title" v-slot:title>
      <slot name="title"></slot>
    </template>

    <FitElScrollbar
      :class="['containerized-scroll', 'containerized-scroll--' + sizeModifier]"
      wrap-class="containerized-scroll__wrap"
    >
      <template v-slot:default>
        <slot name="default"></slot>
      </template>
    </FitElScrollbar>

    <template v-if="$scopedSlots.footer" v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
import FitElScrollbar from '@/components/Scrollbar/FitElScrollbar'

export default {
  name: 'DialogContainerized',

  components: { FitElScrollbar },

  inheritAttrs: false,

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    maximized: {
      type: Boolean,
      default: false,
    },

    // 更改 ElDialog 的默认值
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },

    // 更改 ElDialog 的默认值
    closeOnPressEscape: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    innerVisible: {
      get() {
        return this.visible
      },

      set(val) {
        this.$emit('update:visible', val)
      },
    },

    isFullscreen() {
      return this.$attrs.fullscreen
    },

    sizeModifier() {
      const attrsWidth = this.$attrs['width']
      const hasAttrsWidth = !!attrsWidth

      const maximized = this.isFullscreen || this.maximized
      if (maximized) {
        return 'maximized'
      }

      if (!hasAttrsWidth) {
        return 'minimized'
      }
      return 'default'
    },

    dialogCustomClass() {
      const dialogClass = 'dialog--' + this.sizeModifier
      const attrCustomClass = this.$attrs['custom-class']
      return attrCustomClass
        ? dialogClass + ' ' + attrCustomClass
        : dialogClass
    },
  },
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
@import "~include-media/dist/include-media";

@at-root {
  $padding-vertical: 24px;
  $padding-horizontal: 24px;

  // el-dialog__header 默认高度，写在这里用于计算
  $-dialog-header-height: 54px;

  @mixin scrollbar-wrap-max-height($max-height) {
    & > .containerized-scroll__wrap {
      max-height: $max-height;
    }
  }

  /* dialog 自身 */
  .dialog-containerized {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: $padding-vertical $padding-horizontal;

    > .el-dialog {
      position: relative;
      width: 100%;
      margin: 0;
      overflow: hidden;

      > .el-dialog__body {
        padding: 0; // 覆盖 ElDialog 默认 padding
      }

      /* minimized */
      &.dialog--minimized {
        @include media(">=xs") {
          max-width: 560px;
        }
      }
    }
  }

  /* containerized-scroll */
  .dialog-containerized {

    .containerized-scroll {
      height: 100%;

      @include scrollbar-wrap-max-height(calc(100vh - #{ 2 * $padding-vertical + $-dialog-header-height}));

      > .el-scrollbar__wrap {
        overflow-x: auto;
        min-height: 0;

        & > .el-scrollbar__view {
          // padding-bottom 加多 17px
          //  是因为弥补 el-scrollbar__wrap 设置负的 margin-bottom
          //  其值根据平台的滚动条宽度动态设置，这里省事直接设置 17px 了
          padding: 10px 20px (16px + 17px);
        }
      }

      > .el-scrollbar__bar {
        &.is-horizontal {
          height: 10px;
        }

        &.is-vertical {
          width: 10px;
        }
      }
    }
  }

  .dialog-containerized--fullscreen {
    padding: 0;

    .containerized-scroll--maximized {
      @include scrollbar-wrap-max-height(calc(100vh - #{$-dialog-header-height - 17px}));
    }
  }

}
</style>
