<template>
  <div>
    <el-form
      :ref="formName"
      v-loading="loader.fetch"
      label-width="120px"
      :model="temp"
      :rules="rules"
      :disables="loader.fetch"
    >
      <el-form-item label="网络IP:" prop="ip">
        <el-input v-model="temp.ip" placeholder="请输入网络IP" />
      </el-form-item>
      <el-form-item label="网络掩码:" prop="mask">
        <el-input v-model="temp.mask" placeholder="请输入网络掩码" />
      </el-form-item>
      <el-form-item label="网络网关:" prop="getway">
        <el-input v-model="temp.gateway" placeholder="请输入网络网关" />
      </el-form-item>
      <el-form-item label="网卡地址:" prop="mac">
        <el-input v-model="temp.mac" placeholder="请输入网卡地址" />
      </el-form-item>
      <el-form-item label="远程服务器IP:" prop="serverIP">
        <el-input v-model="temp.serverIp" placeholder="请输入远程服务器IP" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="emitCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import FormEdit from '@/mixins/form-suites/form-edit'
import ipInfoApi from '@/api/ipInfo'

export default {
  name: 'TempDeviceEditInfo',

  mixins: [FormEdit],

  data() {
    return {
      temp: {},
      rules: {
        ip: [
          {
            required: true,
            message: '请输入网络IP',
            trigger: 'change',
          },
          {
            message: '请输入正确的网络IP',
            trigger: 'change',
            pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
          },
        ],
        mask: [
          {
            required: true,
            message: '请输入网络掩码',
            trigger: 'change',
          },
          {
            message: '请输入正确的网络掩码',
            trigger: 'change',
            pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
          },
        ],
        mac: [
          {
            required: true,
            message: '请输入网卡地址',
            trigger: 'change',
          },
          {
            message: '仅支持12位的英文和数字组合',
            trigger: 'change',
            pattern: /^(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{12}$/,
          },
        ],
        serverIp: [
          {
            required: true,
            message: '请输入远程服务器IP',
            trigger: 'change',
          },
          {
            message: '请输入正确的远程服务器IP',
            trigger: 'change',
            pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
          },
        ],
      },
    }
  },
  methods: {
    fetch(params) {
      return ipInfoApi.getTempDeviceListById(params).then(res => {
        const { id, ip, mask, gateway, mac, serverIp } = res.data
        return {
          id: id,
          ip: ip,
          mask: mask,
          gateway: gateway,
          mac: mac,
          serverIp: serverIp,
        }
      })
    },
    updateFormValue(formData) {
      this.temp = formData
    },
    getFormValue() {
      return this.temp
    },
    update(data, isNew) {
      return ipInfoApi.editTempDevice(data).then(res => {
        this.$message({
          message: res.message,
          type: 'success',
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
