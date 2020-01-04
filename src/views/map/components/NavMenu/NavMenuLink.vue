<template>
  <component :is="who" v-bind="extra">
    <slot></slot>
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'NavMenuLink',
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  computed: {
    external() {
      return isExternal(this.path)
    },
    who() {
      return this.external ? 'a' : 'router-link'
    },
    extra() {
      return this.external ? {
        href: this.path,
        target: '_blank',
        rel: 'noopener',
      } : {
        to: this.path,
      }
    },
  },
}
</script>
