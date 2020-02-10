/*

对表单编辑 基本逻辑的封装

基本使用
  props: params, isNew

  methods: 提供 fetch, update 方法，用于获取数据，以及更新数据的逻辑处理

默认使用了 ElFormRenderer ，使用了其 getFormValue updateForm 方法
不使用时，请覆写 getFormValue updateFormValue 方法提供相应功能

ElFormRenderer doc:
https://femessage.github.io/el-form-renderer/#/Components?id=elformrenderer

 */

const LogName = 'mixin:FormEdit'

export default {
  props: {
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
  },

  data() {
    return {
      loader: {
        // initial: false,
        fetch: false,
        update: false,
      },

      // fetch 接口 返回的数据
      _fetchData: null,

      // 将 _fetchData 转换，传递给 form 的数据
      _formData: null,

      formName: 'form',
    }
  },

  computed: {
    canBeClosed() {
      return !this.loader.update
    },
  },

  mounted() {
    if (!this.isNew) {
      this.initData()
    }
  },

  methods: {
    initData() {
      this.loader.fetch = true
      this.fetchHandler()
        .finally(() => {
          this.loader.fetch = false
        })
    },

    async fetchHandler() {
      const {
        params,
      } = this

      const fetchParams = Object.assign({}, params)
      // fetch: 为 数据请求 函数，出请求网络外，不应有其他副作用
      const fetchData = this._fetchData = await this.fetch(fetchParams)

      if (this.resolveFetchData) {
        this._formData = this.resolveFetchData(fetchData)
      }
      this.updateFormValue(this._formData || fetchData)
    },

    // fetch: 获取初始编辑数据，必须提供
    // isNew 为 true ，不触发
    // fetch(params) {
    //   return api.fetch(params)
    // },

    // resolveFetchData: 处理返回的数据，可有副作用（修改数据），可选覆盖
    // resolveFetchData(data) {
    //   return data
    // },

    // update: 发送编辑后数据，必须提供
    // update(data = {}, isNew) {
    //   return api.update()
    // },

    // 更新表单值
    // 使用了 ElFormRenderer.updateForm ，可覆盖
    updateFormValue(formData) {
      this.getFormRef().updateForm(formData)
    },

    getFormRef() {
      return this.$refs[this.formName]
    },

    async submitForm() {
      this.loader.update = true

      let updateSuccess = false
      let updateResult

      try {
        await this.formValidator()
        const data = this.beforeUpdate()
        // update: 为 更新数据 函数，返回 Promise 指明是否成功
        updateResult = await this.update(data, this.isNew)
        updateSuccess = true
      } catch (thrown) {
        switch (typeof thrown) {
          case 'string':
            this.$message.error(thrown)
            break

          case 'object':
          default:
            thrown && console.error(thrown)
        }
      }
      this.loader.update = false

      updateSuccess && this.emitComplete(updateResult)
    },

    formValidator() {
      return new Promise((resolve, reject) => {
        this.getFormRef().validate(valid => {
          valid ? resolve() : reject()
        })
      })
    },

    beforeUpdate() {
      let data = null
      try {
        data = this.produceUpdateData()
      } catch (e) {
        console.error(`[${LogName}]beforeUpdate produceUpdateData error`, e)
      }
      if (!data) {
        return null
      }
      return data
    },

    // 生成 更新的数据，可覆盖
    // 存在错误，请返回 null
    produceUpdateData() {
      const formData = this.getFormValue()
      return formData
    },

    // 获取表单的值
    // 使用了 ElFormRenderer.getFormValue ，可覆盖
    getFormValue() {
      return this.getFormRef().getFormValue()
    },

    emitComplete(arg) {
      this.$emit('completed', arg)
    },

    emitCancel() {
      this.$emit('cancel')
    },
  },
}
