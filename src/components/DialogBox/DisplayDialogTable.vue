<!--
用于显示详情的逻辑组件

默认显示布局
label_1    value
label_2    value
...
label_n    value

常用 props:
fields    - 配置列表 label 和 字段 key
params    - 原封不动传递给 fetch 函数
fetch     - 加载数据的获取函数

-->
<template>
  <DialogContainerized
    :visible.sync="innerDialogVisible"
    :close-on-press-escape="true"
    :close-on-click-modal="true"
    v-bind="innerDialog"
  >
    <el-table
      v-loading="loading"
      :show-header="false"
      :data="result"
      stripe
    >
      <el-table-column
        v-for="(col, index) in innerColumns"
        :key="index"
        v-bind="col"
      />
    </el-table>
  </DialogContainerized>
</template>

<script>

import DialogContainerized from './DialogContainerized'
import _merge from 'lodash/merge'

const DefaultColumns = [
  { label: 'title', prop: 'title', width: '130px', align: 'right' },
  { label: 'value', prop: 'value' },
]

const DefaultDialogProps = {
  title: '查看详情',
  appendToBody: true,
}

export default {
  name: 'DisplayDialogTable',
  components: { DialogContainerized },

  props: {

    visible: {
      type: Boolean,
      default: false,
    },

    // fields = [
    //   { label: 'labelName：', prop: 'propName' },
    //   { label: 'labelName：', prop: 'propName', formatter: (value, prop, data, field) => data[prop] },
    // ]
    fields: {
      type: Array,
      required: true,
    },

    fetch: {
      type: Function,
      required: true,
    },

    dialog: {
      type: Object,
      default() {
        return {}
      },
    },

    columns: {
      type: Array,
      default() {
        return []
      },
    },

    // 原封不动传给 fetch 函数
    params: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      innerDialogVisible: false,

      innerDialog: {},

      innerColumns: [],

      loading: false,

      requested: false,

      requestData: null,

      result: null,
    }
  },

  watch: {
    innerDialogVisible(val) {
      this.$emit('update:visible', val)
    },

    visible(val) {
      this.innerDialogVisible = val

      if (val) {
        if (this.loading) {
          return
        }

        this.load()
      }
    },

    dialog: {
      immediate: true,
      deep: true,
      handler(val) {
        this.innerDialog = _merge({}, DefaultDialogProps, val)
      },
    },

    columns: {
      immediate: true,
      deep: true,
      handler(val) {
        this.innerColumns = Array.isArray(val) && val.length
          ? _merge({}, DefaultColumns, val)
          : DefaultColumns
      },
    },
  },

  methods: {
    async load() {
      this.loading = true

      let data = null
      let requested = false

      try {
        data = await this.fetch(this.params)
        requested = true
      } catch (e) {
        requested = false
        console.log('[DisplayDialogTable] load error', e)
        this.$message.error('加载失败\n' + e.message)
      }

      this.loading = false
      this.requested = requested

      this.requestData = data
      this.result = this.mapFields(data)
    },

    /**
     * mapFields
     * @param {Array} data
     */
    mapFields(data) {
      const fields = this.fields
      return fields.map(field => {
        const {
          prop,
          label,
          formatter,
        } = field

        let value = data[prop]
        if (formatter && typeof formatter === 'function') {
          value = field.formatter(value, prop, data, field)
        }

        return {
          title: label,
          value,
        }
      })
    },
  },
}
</script>
