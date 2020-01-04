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
      <el-form-item label="点位编号:" prop="selfCode">
        <el-input v-model="temp.selfCode" placeholder="请输入点位编号" />
      </el-form-item>
      <el-form-item label="点位位置:" prop="selfLocation">
        <el-input v-model="temp.selfLocation" placeholder="请输入点位位置" />
      </el-form-item>
      <el-form-item label="设备名称:" prop="selfName">
        <el-input v-model="temp.selfName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="网络IP:" prop="ip">
        <el-input v-model="temp.ip" placeholder="请输入网络IP" />
      </el-form-item>
      <el-form-item label="网络掩码:" prop="mask">
        <el-input v-model="temp.mask" placeholder="请输入网络掩码" />
      </el-form-item>
      <el-form-item label="网络网关:" prop="getway">
        <el-input v-model="temp.getway" placeholder="请输入网络网关" />
      </el-form-item>
      <el-form-item label="网卡地址:" prop="mac">
        <el-input v-model="temp.mac" placeholder="请输入网卡地址" />
      </el-form-item>
      <el-form-item label="远程服务器IP:" prop="serverIP">
        <el-input v-model="temp.serverIP" placeholder="请输入远程服务器IP" />
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
import TempDeviceApi from '@/api/temp-device'

export default {
  name: 'TempDeviceEdit',

  mixins: [FormEdit],

  data() {
    return {
      temp: {},
      rules: {
        selfCode: [
          {
            required: true,
            message: '请输入点位编号',
            trigger: 'change',
          },
        ],
        selfLocation: [
          {
            required: true,
            message: '请输入点位位置',
            trigger: 'change',
          },
        ],
        selfName: [
          {
            required: true,
            message: '请输入设备名称',
            trigger: 'change',
          },
        ],
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
        getway: [
          {
            required: true,
            message: '请输入网络网关',
            trigger: 'change',
          },
          {
            message: '请输入正确的网络网关',
            trigger: 'change',
            pattern: /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/,
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
        serverIP: [
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
      return TempDeviceApi.getTempDeviceListById(params).then(res => {
        const { deviceId, selfCode, selfLocation, selfName, ip, mask, getway, mac, serverIP } = res.data
        return {
          deviceId: deviceId,
          selfCode: selfCode,
          selfLocation: selfLocation,
          selfName: selfName,
          ip: ip,
          mask: mask,
          getway: getway,
          mac: mac,
          serverIP: serverIP,
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
      return TempDeviceApi.editTempDevice(data).then(res => {
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
