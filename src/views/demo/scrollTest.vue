<template>
  <div class="scroll-test">
    <WarningReporterComponent />
  </div>
</template>

<script>
import WarningReporterComponent from '@/views/monitor/components/WarningReporterComponent'
export default {
  name: 'ScrollTest',
  components: {
    WarningReporterComponent,
  },
}
</script>

<style scoped>
.scroll-test{
  height: 200px;
}
</style>
