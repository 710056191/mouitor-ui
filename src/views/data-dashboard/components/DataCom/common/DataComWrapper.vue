<template>
  <div class="data-com-wrapper">
    <div
      :class="boxClass"
      class="data-com-box"
    >
      <div v-if="title" class="header-box">
        <p class="title-text">{{ title }}</p>
      </div>

      <div class="content-box">
        <slot></slot>
      </div>

      <DataComRim />
    </div>
  </div>
</template>

<script>
import DataComRim from './DataComRim'

export default {
  name: 'DataComWrapper',

  components: {
    DataComRim,
  },

  props: {
    title: {
      type: String,
      default: '',
    },

    nestBorder: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    boxClass() {
      return {
        'nest-border': this.nestBorder,
      }
    },
  },
}
</script>

<style lang="scss">

</style>
