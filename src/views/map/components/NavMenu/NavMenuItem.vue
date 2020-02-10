<template>
  <div class="nav-menu-item-wrapper">
    <!-- 已经没有子菜单，最后一级 -->
    <!-- 直接渲染标题 -->
    <template v-if="!haveSubMenu">
      <nav-menu-link :path="currPath">
        <el-menu-item :index="currPath">
          <nav-menu-item-title :title="meta.title" :icon="meta.icon" class="menu-item__no-sub-menu" />
        </el-menu-item>
      </nav-menu-link>
    </template>

    <!-- 递归渲染子菜单 -->
    <!-- 先渲染本级的标题，再递归渲染 children -->
    <el-submenu v-else :index="currPath">
      <template slot="title">
        <nav-menu-item-title :title="meta.title" :icon="meta.icon" class="menu-item__have-sub-menu" />
      </template>

      <nav-menu-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="currPath"
      />
    </el-submenu>
  </div>
</template>

<script>
import { resolve as pathResolve } from 'path'

import NavMenuItemTitle from './NavMenuItemTitle'
import NavMenuLink from './NavMenuLink'
import { isExternal } from '@/utils/validate'

export default {
  name: 'NavMenuItem',
  components: {
    NavMenuLink,
    NavMenuItemTitle,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  computed: {
    haveSubMenu() {
      const menu = this.targetMenu
      return menu.children && menu.children.length > 0
    },
    isModuleWrapper() {
      const item = this.item
      return item && item.meta && item.meta.isModuleWrapper
    },
    targetMenu() {
      const item = this.item
      if (this.isModuleWrapper) {
        return item.children && item.children[0]
      }
      return item
    },
    currPath() {
      return this.resolvePath(this.targetMenu.path)
    },
    meta() {
      return this.targetMenu.meta
    },
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      const paths = []
      if (this.isModuleWrapper) {
        paths.push(this.item.path)
      }
      paths.push(routePath)
      return pathResolve(this.basePath, ...paths)
    },
  },
}
</script>

<style>
.menu-item__have-sub-menu {
  /*background-color: antiquewhite;*/
}

.menu-item__no-sub-menu {
  /*background-color: aliceblue;*/
}
</style>
