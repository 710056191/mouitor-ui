<!--

Events:
  command: 与 ElDropdown 类同

-->

<template>
  <div
    :class="barClass"
  >
    <!-- 当button为icon样式时，有tooltip文字提示 -->
    <template v-for="(btn, index) in buttonList">
      <el-tooltip v-if="btn.iconName" :key="index" :content="btn.label" placement="top">
        <el-button
          v-if="btn.iconName"
          ref="buttons"
          :key="index"
          :size="barSize"
          :class="{'action-button--danger': btn.variant === 'danger'}"
          class="action-button"
          :icon="btn.iconName"
          circle
          @click="handleButtonClick(btn, index)"
        />
      </el-tooltip>
    </template>

    <template v-for="(btn, index) in buttonList">
      <el-button
        v-if="!btn.iconName"
        ref="buttons"
        :key="index"
        :size="barSize"
        :class="{'action-button--danger': btn.variant === 'danger'}"
        class="action-button"
        :icon="btn.iconName"
        @click="handleButtonClick(btn, index)"
      >
        {{ btn.label }}
      </el-button>
    </template>

    <template v-if="hasDropdown">
      <el-button
        key="trigger-button"
        class="trigger-button"
        :size="barSize"
      >
        <el-dropdown
          trigger="click"
          :size="barSize"
          @command="handleDropdownCommand"
        >
          <span class="trigger-area">
            <i class="el-icon-more"></i>
          </span>

          <el-dropdown-menu
            slot="dropdown"
            class="fu-operation-bar-menu"
          >
            <el-dropdown-item
              v-for="(item, index) in menuItems"
              :key="index"
              :command="item.command"
            >
              <template>{{ item.label }}</template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'FUOperationBar',

  props: {
    splitNumber: {
      type: Number,
      default: 3,
    },

    list: {
      type: Array,
      required: true,
    },
    // e.g.
    // command, to 二选一
    //
    // list: [
    //   {
    //     label: '编辑',
    //     command: 'edit',
    //   },
    //   {
    //     label: '详情',
    //     to: {}, // 路由跳转对象，同 vue-router 的 to, string/object
    //     replace: false,
    //   },
    // ],

    // button, dropdown size
    size: {
      type: String,
      default: '',
    },
  },

  data() {
    return {}
  },

  computed: {
    barSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },

    barClass() {
      const rootClass = 'fu-operation-bar'
      const size = this.barSize
      return [
        rootClass,
        size
          ? `${rootClass}--${size}`
          : '',
      ]
    },

    innerList() {
      return this.list
        .map(item => {
          const {
            command,
            to,
            replace,
          } = item

          let validCommand = command
          if (!validCommand && to) {
            validCommand = {
              action: '$router',
              to,
              replace,
            }
          }

          if (!validCommand) {
            throw new Error('[FUOperationBar] list-item `command` and `to` cannot both be empty')
          }

          return {
            ...item,
            command: validCommand,
          }
        })
    },

    hasDropdown() {
      return this.innerList.length > this.splitNumber
    },

    buttonList() {
      return this.innerList.slice(0, this.splitNumber)
    },

    menuItems() {
      return this.hasDropdown
        ? this.innerList.slice(this.splitNumber)
        : []
    },
  },

  methods: {
    handleButtonClick(btn, index) {
      const instance = this.$refs['buttons'][index]
      this.emitCommand(btn.command, instance)
    },

    handleDropdownCommand(command, instance) {
      this.emitCommand(command, instance)
    },

    emitCommand(command, instance) {
      this.$emit('command', command, instance)

      if (command && command.action === '$router') {
        this.handleRouterCommand(command)
      }
    },

    handleRouterCommand(command) {
      const { to, replace } = command
      const { $router } = this
      if (!to || !$router) return
      replace ? $router.replace(to) : $router.push(to)
    },
  },
}
</script>

<style lang="scss">
.fu-operation-bar {
  @import "~@/lib/element-ui/theme/common/var";
  @import "~element-ui/packages/theme-chalk/src/mixins/mixins";
  @import "~element-ui/packages/theme-chalk/src/mixins/button";

  $lc-button-first-color: #121d8f;
  $lc-button-first-bg-color: #d9e2ff;
  $lc-button-second-color: #1d45b4;
  $lc-button-second-bg-color: #d6edff;
  $lc-button-third-color: #b38004;
  $lc-button-third-bg-color: #f7efca;

  $lc-button-danger-color: #b82828;
  $lc-button-danger-bg-color: #f6bbbb;

  @mixin padding-size($padding-vertical, $padding-horizontal) {
    $lc-vertical: $padding-vertical - 2px;
    $lc-horizontal: $padding-horizontal - 8px;
    $lc-trigger-horizontal: 5px + 2px;

    .el-button {
      padding: $lc-vertical $lc-horizontal;
    }

    .trigger-area {
      padding: $lc-vertical $lc-trigger-horizontal;
    }
  }

  @include padding-size($--button-padding-vertical, $--button-padding-horizontal);

  @include m(medium) {
    @include padding-size($--button-medium-padding-vertical, $--button-medium-padding-horizontal);
  }
  @include m(small) {
    @include padding-size($--button-small-padding-vertical, $--button-small-padding-horizontal);
  }
  @include m(mini) {
    @include padding-size($--button-mini-padding-vertical, $--button-mini-padding-horizontal);
  }

  .action-button + .action-button {
    margin-left: 2px;
  }

  .action-button + .trigger-button {
    margin-left: -2px;
  }

  /* 按顺序添加颜色 */
  .action-button {
    &:nth-child(1) {
      @include button-variant($lc-button-first-color, $lc-button-first-bg-color, $lc-button-first-bg-color)
    }

    &:nth-child(2) {
      @include button-variant($lc-button-second-color, $lc-button-second-bg-color, $lc-button-second-bg-color)
    }

    &:nth-child(3) {
      @include button-variant($lc-button-third-color, $lc-button-third-bg-color, $lc-button-third-bg-color)
    }
  }

  /* 按类型设置颜色 */
  .action-button {
    &.action-button {
      &--danger {
        @include button-variant($lc-button-danger-color, $lc-button-danger-bg-color, $lc-button-danger-bg-color)
      }
    }
  }

  .trigger-button {
    position: relative;
    padding: 0;

    .trigger-area {
      display: block;
    }
  }

  .el-dropdown {
    font-size: inherit;
  }
}

/* 下拉菜单 */
.el-dropdown-menu.fu-operation-bar-menu {
  .el-dropdown-menu__item {
    min-width: 80px;
  }
}
</style>
