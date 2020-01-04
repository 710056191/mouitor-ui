<!--
目前封装了 ElSearchTablePagination
其文档:
https://github.com/zollero/el-search-table-pagination

-->

<template>
  <div class="suite-table-area">
    <ElSearchTablePagination
      ref="table"
      v-bind="innerTableProps"
      class="table-wrapper"
    >
      <!--
      form slot
      slotProps: { loading: Boolean, search: Function }
      -->
      <template v-slot:form="slotProps">
        <slot name="form" v-bind="slotProps"></slot>
      </template>

      <template v-slot:default>
        <slot name="default"></slot>
      </template>

      <template v-slot:prepend>
        <slot name="prepend"></slot>
      </template>

      <template v-slot:append>
        <slot name="append"></slot>
      </template>

      <!--
      columns slot
      column.slotName in columns
       slotProps: {row, $index}
      -->
      <template v-for="(column) in columnSlots" v-slot:[column.slotName]="slotProps">
        <slot
          :name="column.slotName"
          v-bind="slotProps"
        ></slot>
      </template>

    </ElSearchTablePagination>
  </div>
</template>

<script>
import ElSearchTablePagination from 'el-search-table-pagination/packages/search-table-pagination'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'

const DefaultTableProps = {
  listField: 'data.result',
  totalField: 'data.total',
  pageIndexKey: 'pageNumber',
  pageSizeKey: 'pageSize',

  pageSizes: [10, 20, 50],
  // paginationLayout: 'prev, pager, next, jumper, ->, total, sizes',
  paginationLayout: 'total, sizes, prev, pager, next, jumper',

  // table
  stripe: true,
}

const tablePropsRepairer = (props) => {
  // minWidth:
  // 若未定义，则设置 columns[].minWidth 默认值
  //  其 ElSearchTablePagination 在内部模板处会设置 minWidth 默认值
  //  PS: !!若需要设置 width ，minWidth 需同时设为 '' 以绕过其内部的判断逻辑
  //
  // type: selection/index => align = center
  // 若 column 类型是 selection/index ，将 align 默认设为 center

  if (Array.isArray(props.columns)) {
    const columns = props.columns
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i]

      // minWidth
      if (col.minWidth === undefined) {
        col.minWidth = '-'
      }

      // align
      if (col.type === 'selection' || col.type === 'index') {
        (col.align === undefined) && (col.align = 'center')
      }
    }
  }
  return props
}

const findSubmitButtonIns = function(arg_searchForm) {
  /** @type {Vue} */
  const searchForm = arg_searchForm

  const $children = searchForm.$refs['form'].$children
  const lastFormItem = $children[$children.length - 1]

  return lastFormItem && lastFormItem.$children.find(child => {
    const options = child.$options
    return options && (options._componentTag === 'el-button')
  })
}

function submitButtonTricker(searchFormInc) {
  // 1. 将 submit button 的 type, 从 `button` 改成 `submit`，以支持搜索表单回车触发
  //
  // 基于 el-search-table-pagination v0.4.30 组件结构
  //  node_modules/el-search-table-pagination/packages/search/src/main.vue

  const buttonIns = findSubmitButtonIns(searchFormInc)
  if (!buttonIns) {
    console.warn('submitButtonTricker cannot found submit button instance')
    return
  }

  if (buttonIns.$el.type === 'button') {
    buttonIns.$el.type = 'submit'
  }
}

export default {
  name: 'SuiteTable',

  components: {
    ElSearchTablePagination,
  },

  props: {
    // 传递给 ElSearchTablePagination 的 propsData
    tableProps: {
      type: Object,
      required: true,
      validator(props) {
        // 'el-search-table-pagination/packages/search-table-pagination/src/props.js'
        return props && props.columns && Array.isArray(props.columns)
      },
    },

    control: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      innerTableProps: null,
    }
  },

  computed: {
    columnSlots() {
      const props = this.innerTableProps
      return (props && props.columns)
        ? props.columns.filter(col => col.slotName)
        : []
    },

    internalTable() {
      return this.$refs.table
    },

    internalSearchForm() {
      return this.internalTable && this.internalTable.$refs['searchForm']
    },
  },

  watch: {
    tableProps: {
      immediate: true,
      deep: true,
      handler(props) {
        if (props && props.columns && Array.isArray(props.columns)) {
          const tableProps = _merge({}, DefaultTableProps, props)
          this.innerTableProps = tablePropsRepairer(tableProps)

          props.formOptions && this.injectSearchFormTrick()
        }
      },
    },
  },

  methods: {
    reload(resetPageIndex = false) {
      this.$refs['table'].searchHandler(resetPageIndex)
    },

    // 获取 search form 原始的值，没经过 rules 验证
    getSearchFormPlainParams() {
      const searchForm = this.internalSearchForm
      const plainParams = searchForm && searchForm.params
      return _cloneDeep(plainParams)
    },

    // 获取 search form 的值，已经过 rule validate
    // 不传入 callback ，返回 Promise
    //  callback(error, data)
    getSearchFormParams(callback) {
      let _resolve
      let _reject

      const searchForm = this.internalSearchForm
      searchForm.getParams((error, data) => {
        if (callback) {
          return callback(error, data)
        }

        if (!error) {
          _resolve(data)
        } else {
          _reject(error)
        }
      })

      if (!callback) {
        return new Promise((resolve, reject) => {
          _resolve = resolve
          _reject = reject
        })
      }
    },

    async injectSearchFormTrick() {
      await this.$nextTick()

      /** @type {Vue} */
      const searchForm = this.internalSearchForm
      if (!searchForm) {
        return
      }

      try {
        submitButtonTricker(searchForm)
      } catch (e) {
        console.warn('submitButtonTricker fail', e)
      }
    },
  },
}
</script>

<style lang="scss">
.suite-table-area {
  $lc-row-divide-border: 2px solid #dae4ff;

  .table-wrapper > .el-table {
    border: 1px solid #d3d9fd;
    border-top: none;
    border-bottom: none;

    &.el-loading-parent--relative {
      border-color: transparent;
    }
  }

  tr:nth-child(7n) {
    > td {
      border-bottom: $lc-row-divide-border;
    }
  }

  .el-pagination__rightwrapper {
    margin-left: 50px;
  }
}
</style>
