<template>
  <div class="layout-map-overlay">
    <Map />

    <DialogContainerized
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :before-close="dialogBeforeClose"
      :modal="true"
      :close-on-click-modal="false"
      :fullscreen="true"
      :show-close="false"
      :close-on-press-escape="true"
      custom-class="map-module-dialog"
    >
      <template v-slot:title>
        <el-breadcrumb class="module-header-breadcrumb" separator="/">
          <transition-group name="breadcrumb">
            <el-breadcrumb-item
              v-for="(item, index) in routeLevels"
              :key="item.path"
            >
              <span
                v-if="item.redirect==='noRedirect'|| index === routeLevels.length-1"
                class="no-redirect"
              >{{ item.meta.title }}</span>
              <a
                v-else
                class="breadcrumb-item__link"
                @click.prevent="handleTitleLink(item)"
              >{{ item.meta.title }}</a>
            </el-breadcrumb-item>
          </transition-group>
        </el-breadcrumb>

        <div class="module-header-btn-toolbar">
          <el-button icon="el-icon-back" @click="handleGoBackBtnClick">返回</el-button>
          <el-button icon="el-icon-close" @click="handleCloseBtnClick">关闭</el-button>
        </div>
      </template>

      <module-main />
    </DialogContainerized>
  </div>
</template>

<script>
import Map from '@/views/map/index'
import ModuleMain from '@/layout/components/ModuleMain/index'
import pathToRegexp from 'path-to-regexp'
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'MapOverlay',

  components: {
    DialogContainerized,
    ModuleMain,
    Map,
  },

  props: {
    registerRoutePath: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      dialog: {
        title: '',
        visible: false,
      },

      routeLevels: null,
    }
  },

  computed: {
  },

  mounted() {
    this.handleSubView(this.$route)
  },

  beforeRouteEnter(to, form, next) {
    next(vm => {
      vm.updateSubViewTitle(to)
    })
  },

  beforeRouteUpdate(to, from, next) {
    // console.log('[MapOverlay] beforeRouteUpdate')
    this.handleSubView(to)
    this.updateSubViewTitle(to)
    next()
  },

  beforeRouteLeave(to, from, next) {
    // console.log('[MapOverlay] beforeRouteLeave')
    next()
  },

  methods: {
    /**
     * 处理 子视图
     * @param {Object} targetRoute - 将要进入的子视图
     */
    handleSubView(targetRoute = {}) {
      const { path, meta } = targetRoute
      this.dialog.title = (meta && meta.title) || ''
      this.decideDialogViewVisible(path)
    },

    /**
     * 根据传入的路由路径，判断 弹框 是否需要显示
     * 如果是 当前 view 的路由，不显示弹框，否则显示
     * @param {string} nextRoutePath
     */
    decideDialogViewVisible(nextRoutePath) {
      this.toggleDialogVisible(!this.isSelfPath(nextRoutePath))
    },

    toggleDialogVisible(value) {
      this.dialog.visible = typeof value === 'boolean' ? value : !this.dialog.visible
    },

    dialogBeforeClose(hideCB) {
      // 点击弹框关闭按钮，直接切换路由，由里面的 组件 自行决定是否中断导航
      this.triggerCloseModule(hideCB)
    },

    /**
     * 判断是否当前组件的路由路径
     * @param {string=} routePath - 待判断的路由路径
     * @return {boolean}
     */
    isSelfPath(routePath) {
      if (!routePath) {
        return false
      }
      if (routePath.charAt(routePath.length - 1) === '/') {
        routePath = routePath.slice(0, routePath.length - 1)
      }
      return routePath === this.registerRoutePath
    },

    updateSubViewTitle(to) {
      const matched = to.matched

      const routeLevels = []
      let belongToSubview = false

      for (let i = 0; i < matched.length; i++) {
        const matchedElement = matched[i]

        if (belongToSubview) {
          if (matchedElement.path.endsWith('/')) {
            continue
          }
          if (matchedElement.meta && matchedElement.meta.title) {
            routeLevels.push(matchedElement)
          }
          continue
        }

        if (this.isSelfPath(matchedElement.path)) {
          belongToSubview = true
        }
      }

      this.routeLevels = routeLevels
    },

    handleTitleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },

    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      const toPath = pathToRegexp.compile(path)
      return toPath(params)
    },

    triggerCloseModule(onComplete) {
      this.$router.push(this.registerRoutePath, onComplete)
    },

    handleGoBackBtnClick() {
      this.$router.go(-1)
    },

    handleCloseBtnClick() {
      this.triggerCloseModule()
    },
  },
}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.layout-map-overlay {
  $lc-module-dialog-header-height: 48px;

  @include relative;

  /* el-dialog 弹框 */
  .map-module-dialog {
    > .el-dialog__header {
      position: relative;
      background-color: #f3f4f8;
      height: $lc-module-dialog-header-height;
      padding: 0 20px;

      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .module-header-breadcrumb {
    line-height: 24px;
    height: 24px;

    a.breadcrumb-item__link:hover {
      text-decoration: underline;
    }

    .no-redirect {
      cursor: text;
    }
  }

  .module-header-btn-toolbar {
    > .el-button {
      border: none;
      background: none;
      padding: 10px;
    }
  }
}

</style>
