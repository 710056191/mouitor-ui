<template>
  <div class="widget-user-container">
    <el-dropdown @command="handleCommand">
      <div class="avatar">
        <i class="avatar-icon el-icon-user-solid"></i>
      </div>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(m, index) in menus"
          :key="index"
          :command="m.command"
          :divided="m.divided"
          :disabled="m.disabled"
          v-text="m.label"
        />
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { logoutAndReLogin } from '@/utils/navigation'

// 菜单列表配置
const menusDefaulttList = [
  {
    command: 'name',
    label: '',
    disabled: true,
  },
  {
    divided: true,
    command: 'changePassword',
    label: '修改密码',
  },
  {
    command: 'logout',
    label: '退出系统',
  },
]

export default {
  name: 'WidgetUser',

  data() {
    return {}
  },

  computed: {
    ...mapGetters([
      'userName',
    ]),

    menus() {
      menusDefaulttList[0].label = this.userName || 'Anonymous'
      return menusDefaulttList
    },
  },

  methods: {
    handleCommand(command) {
      console.log('[WidgetUser] handleCommand', command)
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'changePassword':
          // todo 修改密码
          break
        default:
          break
      }
    },

    logout() {
      logoutAndReLogin()
    },
  },
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";

.widget-user-container {
  .avatar {
    width: 46px;
    height: 46px;
    line-height: 46px;
    border-radius: 50%;
    border: 2px solid #fff;
    background-color: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .16), 0 1px 3px 0 rgba(0, 0, 0, .12);
    cursor: pointer;
    text-align: center;

    .avatar-icon {
      font-size: 30px;
      vertical-align: middle;
      color: $page-color-primary;
    }
  }
}

</style>
