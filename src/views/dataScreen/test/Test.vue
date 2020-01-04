<template>
  <div>
    test component
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: ['data', 'info'],
  data() {
    return {

    }
  },
  watch: {
    data: function(newdata) {
      this.data = newdata
      this.getIndexData()
    },
    info: function(newdata) {
      this.info = newdata
      if (this.info && this.data) {
        console.log('info:', this.info)
        console.log('data:', this.data)
      }
    },
  },
  mounted() {
    console.log(1)
  },
  methods: {
    getIndexData() {
      console.log(this.data)
    },
  },
}
</script>

<style lang="scss">

</style>
