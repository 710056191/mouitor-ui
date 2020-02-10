<template>
  <div>
    <template v-if="icon">
      <svg-icon :icon-class="icon" />
    </template>
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'NavMenuItemTitle',
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
}
</script>
