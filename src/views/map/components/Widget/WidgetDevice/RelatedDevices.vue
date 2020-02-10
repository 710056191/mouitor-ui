<template>
  <section class="widget-device-related">
    <header class="panel-header">
      <p class="header-title">关联设备</p>
      <div class="go-back-area">
        <el-link
          type="primary"
          class="btn-go-back"
          icon="el-icon-arrow-left"
          @click="emitClose"
        >返回
        </el-link>
      </div>
    </header>

    <div class="content">
      <FitElScrollbar
        ref="fitElScrollbar"
        wrap-class="device-list-scrollbar__wrap"
        class="device-list-scrollbar"
      >
        <ol class="device-list">
          <li
            v-for="(item, index) in devices"
            :key="index"
            class="device-list-item"
          >
            <div class="device-item">
              <span class="item-index">{{ index + 1 }}</span>
              <table class="device-details">
                <tr>
                  <td>设备型号</td>
                  <td>{{ item.modelNumber || '-' }}</td>
                </tr>
                <tr>
                  <td>设备名称</td>
                  <td>{{ item.devName || '-' }}</td>
                </tr>
                <tr>
                  <td>网络ip</td>
                  <td>{{ item.ip || '-' }}</td>
                </tr>
                <tr>
                  <td>设备状态</td>
                  <td>{{ item.s && item.s.statusText || '-' }}</td>
                </tr>
                <tr>
                  <td>状态描述</td>
                  <td
                    :class="{ 'color-danger': item.alarmDesc }"
                    v-text="item.alarmDesc || '-'"
                  ></td>
                </tr>
              </table>
            </div>
          </li>
        </ol>
      </FitElScrollbar>
    </div>
  </section>
</template>

<script>
import FitElScrollbar from '@/components/Scrollbar/FitElScrollbar'
export default {
  name: 'WidgetDeviceRelatedDevices',
  components: { FitElScrollbar },

  props: {
    devices: {
      type: Array,
      default() {
        return []
      },
    },
  },

  methods: {
    emitClose() {
      this.$emit('close')
    },

    resetScrollBarPos() {
      this.$refs.fitElScrollbar.resetBarPos()
    },
  },
}
</script>

<style lang="scss">
.widget-device-related {
  $lc-header-height: 42px;

  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;

  .panel-header {
    position: relative;
    font-size: 14px;
    padding: 0 16px;
    color: #191ccb;
    text-align: center;

    border-bottom: 1px solid #dedede;

    .header-title {
      height: $lc-header-height;
      line-height: $lc-header-height;
      margin: 0;
    }

    .go-back-area {
      position: absolute;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .btn-go-back {
      height: 22px;
      line-height: 22px;
    }
  }

  .content {
    height: calc(100% - #{$lc-header-height + 1px});
  }

  .device-list-scrollbar {
    height: 100%;
  }

  .device-list-scrollbar__wrap {
    overflow-x: hidden;
  }

  /* device-list */
  .device-list {
    color: #333333;
    font-size: 14px;
    margin: 0;
    padding: 0 16px 18px;

    > li {
      list-style: none;
    }
  }

  .device-list-item {
    padding: 16px 0;
    line-height: 16px;
    border-bottom: 1px solid #eeeeee;
  }

  .device-item {
    display: flex;

    .item-index {
      width: 30px;
      padding-top: 4px;
      padding-left: 8px;
      flex: none;
    }
  }

  .device-details {

    td:first-child {
      width: 90px;
      color: #777777;
      vertical-align: top;
    }
  }

  /* util style */
  .color-danger {
    color: #e63636;
  }
}
</style>
