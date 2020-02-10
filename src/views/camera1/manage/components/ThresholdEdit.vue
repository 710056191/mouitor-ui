<template>
  <div>
    <ElFormRenderer
      :ref="formName"
      v-loading="loader.fetch"
      label-width="100px"
      class="threshold-edit-form"
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

      <!--      <p-->
      <!--        v-for="remark in Remarks"-->
      <!--        :slot="'id:' + remark.id"-->
      <!--        :key="remark.id"-->
      <!--      >{{ remark.txt }}</p>-->

    </ElFormRenderer>
  </div>
</template>

<script>
import ElFormRenderer from '@femessage/el-form-renderer'
import FormEdit from '@/mixins/form-suites/form-edit'
import ThresholdEditRemark from './ThresholdEditRemark'

import { getById, update as updateThreshold } from '@/api/threshold'
import { deepFreeze } from '@/utils'

let Fields = [
  {
    id: 'threshold',
    label: '阈值',
  },
  {
    id: 'hamming',
    label: '图片相似度',
  },
  {
    id: 'binaryThreshold',
    label: '二值化阈值',
  },
  {
    id: 'binaryPercent',
    label: '二值化比值',
  },
]
Fields = deepFreeze(Fields)

let RemarkMap = {
  'threshold': {
    txt: '备注：阀值越大趋向判断图像被遮挡的概率越大，可设置为200，由实际情况改变。',
  },
  'hamming': {
    txt: '备注：摄像头移动前和移动后的图像相似度，可设置为10，由实际情况改变。',
  },
  'binaryThreshold': {
    txt: '备注：二值化图像（黑白图像）的阈值，可设置为50，由实际情况改变。',
  },
  'binaryPercent': {
    txt: '备注：两张二值化图像的轮廓数比值，近似为摄像头遮挡面积比值，可设置为0.5，由实际情况改变。',
  },
}
RemarkMap = deepFreeze(RemarkMap)

let RemarkData = Fields.reduce((obj, { id }) => {
  obj['remark-' + id] = RemarkMap[id].txt
  return obj
}, {})
RemarkData = deepFreeze(RemarkData)

export default {
  name: 'ThresholdEdit',

  components: {
    ElFormRenderer,
  },

  mixins: [FormEdit],

  data() {
    const formContentValue = () => {
      // const FloatReg = /^[0-9]+(\.[0-9]{1,4})?$/

      const requiredRule = {
        required: true,
        message: '必填项',
        trigger: 'blur',
      }

      const numberRule = {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const num = +value
          if (Number.isNaN(num)) {
            callback(new Error('请输入数字'))
          } else if (num < 0) {
            callback(new Error('不能为负数'))
          } else {
            callback()
          }
        },
      }

      return Fields
        .map(item => {
          item = Object.assign({}, item)
          const label = item.label

          item.type = 'input'

          item.el = {
            placeholder: '请输入' + label,
          }

          // item.label += '：'
          item.rules = [requiredRule, numberRule]

          return item
        })
        .reduce((list, field) => {
          list.push(field)
          list.push({
            id: 'remark-' + field.id,
            component: ThresholdEditRemark,
          })
          return list
        }, [])
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

    resolveFetchData(response) {
      return {
        ...response,
        ...RemarkData,
      }
    },

    update(data) {
      data = {
        ...data,
        thresholdId: this.params.id,
      }
      return updateThreshold(data)
    },
  },
}
</script>

<style lang="scss">

</style>
