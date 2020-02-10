<template>
  <section class="widget-device-main">
    <div class="top-bar">
      <el-button
        icon="el-icon-close"
        circle
        class="panel-btn-close"
        @click="handleClose"
      />
    </div>

    <FitElScrollbar
      ref="fitElScrollbar"
      wrap-class="device-main-scrollbar__wrap"
      class="device-main-scrollbar"
    >
      <header class="header">
        <div class="header__content">
          <h2 class="header-title">点位编号: {{ device.selfCode || '- -' }}</h2>

          <dl class="secondary-area">
            <dt>点位位置:</dt>
            <dd>{{ devicePosition || '--' }}</dd>

            <dt>修改时间:</dt>
            <dd>{{ device.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</dd>
          </dl>
          <div class="itude">
            <dl>
              <dt>经度：</dt>
              <dd>{{ device.longitude }}</dd>
            </dl>
            <dl>
              <dt>纬度：</dt>
              <dd style="padding:0">{{ device.latitude }}</dd>
            </dl>
          </div>
        </div>

        <!-- <div class="header__extra">
          <div class="number">{{ faultDeviceCount }}</div>
          <p class="describe">故障设备数量</p>
        </div> -->
      </header>

      <div
        v-loading="loading"
        class="content__body"
      >
        <section class="information-box">
          <div class="box-header">
            <div class="header-title">
              <h3 class="title-text">设备箱信息</h3>
              <el-button
                icon="el-icon-edit-outline"
                circle
                class="extra-btn"
                @click="emitEditBtnClick"
              />
            </div>
          </div>

          <div class="box-inner">
            <ul
              v-for="(chunks, cIdx) in displayInfos"
              :key="cIdx"
              class="info-chunk"
            >
              <li
                v-for="(line, lIdx) in chunks"
                :key="lIdx"
              >
                <span
                  class="info-item-label"
                  :class="line.css.labelCss"
                >{{ line.label }}</span>
                <span
                  class="info-item-value"
                  :class="line.css.valueCss"
                >{{ line.value || '-' }}</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="related-device-box">
          <div class="box-header">
            <div class="header-title">
              <h3 class="title-text">关联设备<span style="color:red;font-size:12px">(关联设备故障数量：{{ faultDeviceCount }})</span></h3>
              <el-button
                :disabled="relatedDevicesLoading || !(relatedDevices && relatedDevices.length)"
                icon="el-icon-arrow-right"
                circle
                class="extra-btn"
                @click="emitRelatedDeviceClick"
              />
            </div>
          </div>

          <div class="box-inner">
            <el-table
              v-loading="relatedDevicesLoading"
              :data="relatedDevices"
              height="180"
              stripe
              class="devices-table"
            >
              <el-table-column
                type="index"
                label=""
                align="center"
                width="50px"
              />

              <el-table-column
                label="设备名称"
                prop="devName"
              />

              <el-table-column
                label="状态描述"
                align="right"
                prop="statusText"
                width="130px"
              >
                <template slot-scope="{ row }">
                  <span
                    :class="{ 'color-danger': row.alarmDesc }"
                    v-text="row.alarmDesc || (row.s && row.s.statusText) || '-'"
                  ></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </section>
      </div>
    </FitElScrollbar>
  </section>
</template>

<script>

import { createDeviceDisplayInfos } from './device.business'
import {
  Status,
} from '@/config/const/device/device-status'
import FitElScrollbar from '@/components/Scrollbar/FitElScrollbar'

export default {
  name: 'WidgetDeviceMain',
  components: { FitElScrollbar },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    relatedDevicesLoading: {
      type: Boolean,
      default: false,
    },

    device: {
      type: Object,
      default() {
        return {}
      },
    },

    relatedDevices: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {}
  },

  computed: {
    displayInfos() {
      const device = this.device
      return createDeviceDisplayInfos(device || {})
    },

    faultDeviceCount() {
      const relatedDevices = this.relatedDevices || []
      let count = 0
      for (let i = 0; i < relatedDevices.length; i++) {
        const device = relatedDevices[i]
        if (device.status !== Status.normal) {
          count++
        }
      }
      return count
    },

    /* 点位位置 */
    devicePosition() {
      const device = this.device || {}
      let selfAddr1 = device.selfAddr1 || ''
      const selfAddr2 = device.selfAddr2 || ''

      selfAddr1 && (selfAddr1 += ' ')
      return selfAddr1 + selfAddr2
    },
  },

  methods: {

    handleClose() {
      this.$parent.emitClose()
    },

    emitEditBtnClick() {
      this.$emit('edit-btn-click')
    },

    emitRelatedDeviceClick() {
      this.$emit('related-device-click')
    },

    getScrollWrap() {
      return this.$refs.fitElScrollbar.getScrollbarWrap()
    },

    resetScrollBarPos() {
      this.$refs.fitElScrollbar.resetBarPos()
    },
  },
}
</script>

<style lang="scss">
.widget-device-main {
  $lc-top-bar-height: 30px;
  $lc-header-bg-color: #4f58b5;

  position: relative;
  width: 100%;
  height: 100%;

  /* top-bar */
  .top-bar {
    position: relative;
    background-color: $lc-header-bg-color;
    height: $lc-top-bar-height;
  }

  /* header */
  .header {
    position: relative;
    display: flex;
    justify-content: space-between;
    /*height: 118px;*/
    padding: 0 16px 8px;
    color: #fff;
    background-color: $lc-header-bg-color;
  }

  .header__content {

    .header-title {
      font-size: 18px;
      font-weight: normal;
      margin: 0;
    }

    .secondary-area {
      font-size: 12px;
      margin: 0;
      padding-top: 18px;

      > dt {
        float: left;
      }

      > dd {
        margin-left: 5em;
        padding-bottom: 8px;
      }
    }
    .itude{
      display: flex;
      justify-content: space-between;
      >dl{
        font-size: 12px;
        display: flex;
        justify-content: left;
        margin: 0;
        >dd{
          margin: 0;
        }
      }
      >dl:nth-child(1){
        flex: 2;
      }
      >dl:nth-child(2){
        flex: 3;
      }
    }
  }

  .header__extra {
    width: 80px;
    text-align: center;
    flex: none;

    .number {
      font-size: 45px;
      font-style: italic;
      background: url('~@/assets/map/widget/device-detail-highlight-number-bg.png') no-repeat;
      background-position-x: center;
      height: 62px;
      line-height: 62px;
      background-position-y: -4px;
    }

    .describe {
      margin: 0;
      font-size: 12px;
      padding-top: 4px;
    }
  }

  .panel-btn-close {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 16px;
    padding: 4px;
    color: white;
    background-color: transparent;
    border: none;

    &:hover {
      background-color: rgba(215, 215, 215, 0.3);
    }
  }

  /* scrollbar */
  .device-main-scrollbar {
    height: calc(100% - #{$lc-top-bar-height});
  }

  .device-main-scrollbar__wrap {
    overflow-x: hidden;
  }

  /* content */
  .content__body {
    padding: 0 16px 30px;

    /* box-header */
    .box-header {
      margin-bottom: 14px;
      padding: 14px 0 6px;
      border-bottom: 1px solid #191ccb;
    }

    .header-title {
      position: relative;
      font-size: 14px;
      font-weight: bold;
      color: #191ccb;

      .title-text {
        margin: 0;
        font-size: 14px;
      }

      .extra-btn {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 14px;
        padding: 2px;
        border: none;
      }
    }

    .box-inner {
      /*padding: 20px 0;*/
    }
  }

  .related-device-box {

  }

  /* 设备箱信息 */
  .info-chunk {
    color: #777777;
    font-size: 14px;
    line-height: 22px;
    margin: 0;
    padding: 0 0 15px;

    &:last-child {
      padding-bottom: 0;
    }

    li {
      list-style: none;
      display: flex;
      justify-content: space-between;
    }

    .info-item-label {
    }

    .info-item-value {
      color: #333333;
    }
  }

  .devices-table.el-table {
    color: #222222;
    border: 1px solid #c8cbf5;

    thead {
      color: #717171;
    }

    th {
      background-color: #ffffff; // todo 看看能不能把公共样式 bg-color 以上一级
      padding: 0;
      line-height: 30px;
    }

    .el-table__body {
      font-size: 14px;

      td {
        height: 30px;
        line-height: 30px;
        padding: 0;
      }
    }

    tr {
      background-color: #e5e7fe;

      &.el-table__row--striped td {
        background-color: #fff;
      }
    }
  }

  /* util style */
  .color-danger {
    color: #e63636 !important;
  }
}
</style>
