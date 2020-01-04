<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div
        class="login-form-area"
      >
        <div class="title-container">
          <h3 class="title">安防运维管理系统</h3>
        </div>

        <div class="form-inner-wrap">

          <div class="alert-box">
            <el-alert
              v-show="licenseMsg.visible"
              :title="licenseMsg.msg"
              type="error"
              effect="dark"
            />
          </div>

          <el-form
            ref="loginForm"
            element-loading-spinner="el-icon-loading"
            :disabled="formDisabled"
            :model="loginForm"
            :rules="loginRules"
            auto-complete="on"
            label-position="left"
            class="form-inner-box"
            @submit.native.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                maxlength="32"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                maxlength="32"
                auto-complete="on"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

            <el-button
              :loading="loginBtnLoading"
              native-type="submit"
              type="primary"
              style="width:100%;"
            >{{ loginBtnText }}
            </el-button>
          </el-form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',

  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }

    let username = ''
    let password = ''

    if (process.env.NODE_ENV !== 'production') {
      username = 'admin'
      password = '123456'
    }

    return {
      state: {
        // 初始化完成
        initialized: false,

        // 完成许可证信息获取
        loadLicense: false,

        // 可用，许可证可用
        usable: false,

        // 提交表单，登陆中
        submitting: false,

        // 已登录
        logined: false,
      },

      licenseMsg: {
        visible: false,
        msg: '',
      },

      loginForm: {
        username,
        password,
      },

      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },

      passwordType: 'password',

      redirect: undefined,
    }
  },

  computed: {
    formDisabled() {
      const state = this.state
      return !state.usable || state.submitting || state.logined
    },

    loginBtnText() {
      const state = this.state

      let text = ''

      if (!state.initialized) {
        text = '初始化...'
      } else if (!state.usable) {
        text = '许可证已过期'
      } else if (state.logined) {
        text = '正在跳转...'
      } else if (state.submitting) {
        text = '登录中...'
      } else {
        text = '登录'
      }

      return text
    },

    loginBtnLoading() {
      const state = this.state
      return !state.initialized ||
        state.submitting
    },
  },

  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },

  created() {
    this.verifyLicense()
      .finally(() => {
        this.state.initialized = true
      })
  },

  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }

        const state = this.state
        state.submitting = true

        this.$store.dispatch('user/login', this.loginForm)
          .then(() => {
            this.$router.push({ path: this.redirect || '/' })
            state.logined = true
          })
          .catch((error) => {
            console.log('登录失败，未知错误 ！！', error)
            setTimeout(() => {
              this.$refs.username.focus()
            }, 300)
          })
          .finally(() => {
            state.submitting = false
          })
      })
    },

    // 校验许可证
    verifyLicense() {
      this.state.loadLicense = false

      return this.$store.dispatch('user/verifyLicense')
        .then(this.handleLicense)
        .catch(error => {
          // todo 校验许可证遇到错误
          console.log(error)
        })
        .finally(() => {
          this.state.loadLicense = true
        })
    },

    handleLicense(info) {
      this.state.usable = info.usable

      const isShowLicenseMsg = info.isTrial || (info.usable && info.remainingDays <= 7)
      if (isShowLicenseMsg) {
        this.licenseMsg.msg = `您的${info.name}在 ${info.expireDateStr} 过期，请尽快更新License！`
        this.licenseMsg.visible = isShowLicenseMsg
      }
    },
  },
}
</script>

<style lang="scss">
@import "~@/styles/variables";

$bg: white;
$light_color: $page-color-text-primary;
$cursor: $light_color;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
      color: $light_color;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid $light_color;
    border-radius: 3px;
    color: #454545;

    margin-bottom: 28px;
  }
}
</style>

<style lang="scss">
@import "~@/styles/variables";
@import "~include-media/dist/include-media";

$bg: white;
$dark_gray: #889aa4;
$light_color: $page-color-text-primary;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-wrapper {
    position: relative;
    box-sizing: border-box;
    $padding-top: 200px;
    /* 943 * 756 */
    background: transparent url('~@/assets/login/bg.png') no-repeat -32px 0;
    padding-top: $padding-top;
    min-height: 760px;

    margin: 0 auto;
    max-width: 1400px;

    @include media("<1300px") {
      background-image: none;
      max-width: 520px;
    }
  }

  .login-form-area {
    position: absolute;
    width: 520px;
    padding: 0 35px 0;
    right: 0;

    .alert-box {
      .el-alert {
        margin-bottom: 25px;
      }
    }

    .form-inner-wrap {
      border: 1px solid $light_color;
      padding: 38px 45px;
      border-radius: 8px;
    }

    .form-inner-box {

    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 30px;
      color: $light_color;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
