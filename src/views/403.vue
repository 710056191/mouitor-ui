<template>
  <div class="page-403-container">
    <div class="page-403-box">
      <div>
        <p class="title">访问错误</p>
        <p class="headline" v-text="message"></p>
        <p>
          <el-button type="primary" @click="logout">退出登录</el-button>
          <el-button @click="returnHome">返回主页</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { logoutAndReLogin } from '@/utils/navigation'
import store from '@/store'

function reJudgePermission(havePermission, to, next) {
  havePermission
    ? next({
      path: to.query && to.query.redirect || '/',
      replace: true,
    })
    : next()
}

export default {
  name: 'Page403',

  data() {
    return {
      message: '无权限访问！',
    }
  },

  beforeRouteEnter(to, form, next) {
    reJudgePermission(store.getters.havePermission, to, next)
  },

  beforeRouteUpdate(to, from, next) {
    reJudgePermission(store.getters.havePermission, to, next)
  },

  methods: {
    logout() {
      logoutAndReLogin()
    },

    returnHome() {
      window.location.href = '/'
    },
  },
}
</script>

<style lang="scss">
@import "~@/styles/variables";

.page-403-container {
  display: flex;
  justify-content: center;
}

.page-403-box {

  padding-top: 100px;

  .title {
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
    color: $page-color-text-primary;
  }

  .headline {
    font-size: 20px;
    line-height: 24px;
    color: #222;
    font-weight: bold;
  }
}
</style>
