<template>
  <div class="map-panel">
    <el-tabs class="panel-tabs">
      <el-tab-pane label="区划" lazy>
        <panel-zone />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import './panel.scss'

import PanelZone from '@/views/map/components/Panel/PanelZone'

export default {
  name: 'Panel',
  components: {
    PanelZone,
  },
}
</script>

<style lang="scss">

</style>
