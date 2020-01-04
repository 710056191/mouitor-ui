<template>
  <section>
    <el-upload
      :before-upload="beforeUpload"
      :on-change="onChange"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      v-bind="innerAttrs"
      v-on="$listeners"
    >
      <el-button v-show="allowedUpload" slot="trigger" type="primary" :disabled="!allowedUpload">点击上传</el-button>

      <div
        v-show="allowedUpload"
        slot="tip"
        class="el-upload__tip"
      >只能上传 .bin 文件
      </div>
    </el-upload>

    <div></div>
  </section>
</template>

<script>
import { isSupportFile } from '@/utils/validate'

const supportFileExtNames = ['.bin']

export default {
  name: 'FirmwareEditUpload',

  props: {
    value: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      config: {
        action: '',
        autoUpload: false,
        limit: 1,
        accept: supportFileExtNames.join(', '),
      },

      innerFiles: [],
    }
  },

  computed: {
    // 是否允许上传
    //  如果文件数小于限制数 -> 是
    //  如果文件数等于或大于限制数 -> 否emitFile
    allowedUpload() {
      const limit = this.config.limit
      const files = this.innerFiles || []
      return files.length < limit
    },

    innerAttrs() {
      return {
        ...this.config,
        ...this.$attrs,
      }
    },
  },

  methods: {
    beforeUpload(file) {
    },

    onChange(file, fileList) {
      console.log('FirmwareEditUpload onChange', file, fileList)

      const isSupport = isSupportFile(file.name, supportFileExtNames)
      if (!isSupport) {
        console.log('beforeUpload nonsupport file:', file)

        const postfixStr = supportFileExtNames.join(', ')
        this.$message.error(`上传格式只支持 ${postfixStr}`)

        this.removeFileFromList(file, fileList)
      }

      this.emitFile(fileList)
    },

    onRemove(file, fileList) {
      console.log('FirmwareEditUpload onRemove', file, fileList)
      this.emitFile(fileList)
    },

    onExceed(file, fileList) {
      const limit = this.config.limit
      this.$message.error(`最多只能选择 ${limit} 个`)
    },

    /**
     * 移除文件
     * @param file - <el-upload /> 的 file, {uid, name, url,}
     * @param fileList - 文件列表，会直接修改这个数组！
     *                    现在一般将 el-upload 组件钩子传递的 fileList 直接传递进来，注意不要乱操作
     */
    removeFileFromList(file, fileList) {
      if (!file) {
        return
      }

      const list = fileList

      const idx = list.findIndex(item => {
        return item.uid === file.uid
      })
      if (idx === -1) {
        return
      }

      list.splice(idx, 1)
    },

    // 将 el-upload 的 fileList 派发出来
    emitFile(fileList) {
      const limit = this.config.limit
      if (fileList.length > this.config.limit) {
        // 因为 limit 有限制，理论上正确情况下 fileList 的长度不会超过，若超过报警告
        console.warn(`FirmwareEditUpload emitFile: fileList 长度超过 ${limit} 个`, fileList)
      }
      this.innerFiles = fileList

      this.$emit('input', fileList)
    },
  },
}
</script>

<style lang="scss">

</style>
