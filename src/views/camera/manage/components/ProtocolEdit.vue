<template>
  <ElFormRenderer
    :ref="formName"
    v-loading="loader.fetch"
    label-width="100px"
    class="protocol-edit-form"
    :disabled="loader.fetch"
    :content="formContent"
  >
    <el-form-item>
      <div class="text-align-right">
        <el-button
          :disabled="!canBeClosed"
          @click="emitCancel"
        >取消
        </el-button>

        <el-button
          type="primary"
          :loading="loader.update"
          @click="submitForm"
        >确定
        </el-button>
      </div>
    </el-form-item>
  </ElFormRenderer>
</template>

<script>
import ElFormRenderer from '@femessage/el-form-renderer'
import FormEdit from '@/mixins/form-suites/form-edit'

import {
  getById,
  add as addProtocol,
  update as updateProtocol,
} from '@/api/protocol'
import { deepFreeze } from '@/utils'

const Fields = [
  {
    id: 'protocolName',
    label: '协议名称',
  },
  {
    id: 'protocolDesc',
    label: '协议描述',
  },
  {
    id: 'protocolValue',
    label: '协议字符',
    el: {
      type: 'textarea',
    },
  },
  {
    id: 'username',
    label: '用户名',
  },
  {
    id: 'password',
    label: '密码',
  },
  {
    id: 'priorityFlag',
    label: '默认协议',
    type: 'switch',
    el: {
      inactiveText: '否',
      activeText: '是',
      inactiveValue: 0,
      activeValue: 1,
    },
  },
  {
    id: 'allCamera',
    label: '协议适用于',
    type: 'switch',
    el: {
      activeText: '所有摄像头',
      inactiveValue: 0,
      activeValue: 1,
    },
    rules: [],
  },
]
deepFreeze(Fields)

export default {
  name: 'ProtocolEdit',

  components: {
    ElFormRenderer,
  },

  mixins: [FormEdit],

  data() {
    const formContentValue = () => {
      const requiredRule = {
        required: true,
        message: '必填项',
        trigger: 'blur',
      }

      return Fields
        .map(item => {
          item = Object.assign({}, {
            type: 'input',
            rules: [requiredRule],
          }, item)

          const {
            label,
            el = {},
          } = item

          item.el = Object.assign({
            placeholder: '请输入' + label,
          }, el)

          // item.label += '：'
          return item
        })
    }

    return {
      formContent: formContentValue(),
    }
  },

  methods: {
    fetch(params) {
      return getById(params)
        .then(res => res.data)
    },

    update(data, isNew) {
      data = {
        ...data,
        deviceId: this.params.deviceId,
        deviceProtocolId: this.params.id,
      }
      return isNew ? addProtocol(data) : updateProtocol(data)
    },
  },
}
</script>

<style lang="scss">

</style>
