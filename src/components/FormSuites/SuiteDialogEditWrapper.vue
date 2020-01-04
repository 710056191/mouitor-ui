<template>
  <DialogContainerized
    :visible.sync="innerDialogVisible"
    :title="isNew ? addedTitle : editTitle "
    append-to-body
    v-bind="dialog"
  >
    <component
      :is="who"
      v-if="innerDialogVisible"
      :params="params"
      :is-new="isNew"
      @completed="handleComplete"
      @cancel="innerDialogVisible=false"
    />
  </DialogContainerized>
</template>

<script>
import DialogContainerized from '@/components/DialogBox/DialogContainerized'

export default {
  name: 'SuiteDialogEditWrapper',

  components: { DialogContainerized },

  props: {
    component: {
      type: [String, Object],
      required: true,
    },

    visible: {
      type: Boolean,
      default: false,
    },

    addedTitle: {
      type: String,
      default: '新增',
    },

    editTitle: {
      type: String,
      default: '编辑',
    },

    params: {
      type: Object,
      default: () => {
        return {}
      },
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    dialog: {
      type: Object,
      default() {
        return {}
      },
    },

  },

  data() {
    return {
      innerDialogVisible: false,
    }
  },

  computed: {
    who() {
      const component = this.component
      if (typeof component === 'string') {
        if (this.$options.components[component]) {
          return component
        }

        if (this.$parent.$options.components[component]) {
          return this.$parent.$options.components[component]
        }
      }
      return component
    },
  },

  watch: {
    innerDialogVisible(val) {
      this.$emit('update:visible', val)
    },

    visible(val) {
      if (val) {
        this.open()
      } else {
        this.innerDialogVisible = val
      }
    },
  },

  methods: {
    open() {
      // 未打开，直接打开
      if (!this.innerDialogVisible) {
        this._innerOpen()
        return
      }

      // 若已经打开，先关闭再打开
      // 目前故意限制成这样，无论是新增、编辑，都只能有一个实例
      this.innerDialogVisible = false
      this.$nextTick(() => {
        if (this.innerDialogVisible) {
          console.warn('This dialog may be controlled simultaneously by more than two places,' +
            ' which can cause unknown problems')
        }
        this._innerOpen()
      })
    },

    _innerOpen() {
      this.innerDialogVisible = true
    },

    handleComplete(arg) {
      this.$emit('completed', arg)
    },
  },

}
</script>
