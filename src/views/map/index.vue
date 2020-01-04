<template>
  <div class="view-map-container">

    <map-wrapper class="map-wrapper-inner" />

    <panel class="widget-box widget-panel" />

    <widget-user class="widget-box widget-user-box" />

    <transition name="el-zoom-in-top">
      <WidgetDevice
        v-show="devicePanelCtrl.visible"
        :id="devicePanelCtrl.id"
        class="widget-box widget-panel-device"
        @close="handleWidgetDeviceClose"
        @edit-btn-click="handleWidgetDeviceEditBtnClick"
      />
    </transition>

    <nav-menu class="widget-box widget-nav" />
  </div>
</template>

<script>
import MapWrapper from './components/MapWrapper'
import NavMenu from './components/NavMenu/NavMenu'
import Panel from '@/views/map/components/Panel/Panel'
import WidgetUser from '@/views/map/components/Widget/WidgetUser'
import WidgetDevice from '@/views/map/components/Widget/WidgetDevice'

export default {
  name: 'Map',
  components: {
    WidgetDevice,
    WidgetUser,
    MapWrapper,
    NavMenu,
    Panel,
  },

  computed: {
    devicePanelCtrl() {
      return this.$store.state.map.devicePanelCtrl
    },
  },

  methods: {
    handleWidgetDeviceClose() {
      this.$store.dispatch('map/CLOSE_DEVICE_PANEL')
    },

    handleWidgetDeviceEditBtnClick(id) {
      console.log('handleWidgetDeviceEditBtnClick', id)
    },
  },
}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.view-map-container {
  @include relative;

  &, .bigemap-container {
    background: url('../../assets/map/map_bg.png') #fcf9f2;
  }

  .map-wrapper-inner {
    position: relative;
    z-index: 1;
  }

  .widget-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }

  .widget-nav {
  }

  .widget-panel {
    position: absolute;
    top: 10px;
    left: auto;
    right: 32px + (46px + 10px);
  }

  .widget-user-box {
    position: absolute;
    top: 10px;
    left: auto;
    right: 10px;
  }

  .widget-panel-device {
    position: absolute;
    left: 50px;
    top: 20px;
  }
}

</style>
