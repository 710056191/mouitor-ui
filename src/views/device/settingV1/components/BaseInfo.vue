<!-- 基础信息组件 -->
<template>
  <div class="content">
    <el-row :class="type==='camera' ? 'nobutton' : ''">
      <el-col :span="14">基础信息</el-col>
      <el-col :span="10" style="text-align: right;">
        <el-button v-if="type==='setting'" type="primary" size="mini" @click="handleThreshold(data.devid,data.ip)">设备箱阈值设置</el-button>
      </el-col>
    </el-row>
    <div style="border:1px solid #ccc" class="basecontent" :loading="loading">
      <!-- 若选中某一设备箱，编辑icon出现 -->
      <el-row v-if="iconvisibel">
        <el-col :offset="23" :span="1">
          <span style="cursor: pointer;" @click="handleEdit">
            <el-icon class="el-icon-edit-outline" />
          </span>

        </el-col>

      </el-row>
      <!-- 若未选中设备箱，编辑icon不出现，但需占位 -->
      <el-row v-if="!iconvisibel">
        <el-col style="height:13px;padding-right:5px" />
      </el-row>
      <el-row>
        <el-col :span="10">
          点位编号
        </el-col>
        <el-col :span="14">
          {{ data.selfCode }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          点位位置
        </el-col>
        <el-col :span="14">
          {{ data.selfAddr2 }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          设备名称
        </el-col>
        <el-col :span="14">
          {{ data.devName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          网络IP
        </el-col>
        <el-col :span="14">
          {{ data.ip }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          网络掩码
        </el-col>
        <el-col :span="14">
          {{ data.mask }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          网络网关
        </el-col>
        <el-col :span="14">
          {{ data.getway }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          网卡地址
        </el-col>
        <el-col :span="14">
          {{ data.last6Mac }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          总包商
        </el-col>
        <el-col :span="14">
          {{ data.totalManufacturerName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          网络供应商
        </el-col>
        <el-col :span="14">
          {{ data.networkManufacturerName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          电力供应商
        </el-col>
        <el-col :span="14">
          {{ data.electricManufacturerName }}
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>

import manufacturerApi from '@/api/manufacturer'

export default {
  name: 'BaseInfo',
  props: ['data', 'type'],
  data() {
    return {
      loading: false,
      editvisibel: false,
      iconvisibel: false,
      id: null,
      ip: null,
    }
  },
  watch: {
    data: function(newdata, olddata) {
      if (newdata) {
        const networkId = newdata.networkManufacturer
        const electricId = newdata.electricManufacturer
        const totalId = newdata.totalManufacturerId
        this.iconvisibel = true
        this.id = newdata.devid
        this.ip = newdata.ip
        if (!newdata.type) {
          if (!newdata.networkManufacturerName && networkId) {
          // console.log(newdata.networkManufacturer)
            manufacturerApi.findManufacturerById(networkId)
              .then(res => {
                newdata.networkManufacturerName = res.data.manufacturerName
              })
              .catch(err => {
                console.log(err)
              })
          }
          if (!newdata.electricManufacturerName && electricId) {
            manufacturerApi.findManufacturerById(electricId)
              .then(res => {
                newdata.electricManufacturerName = res.data.manufacturerName
              })
              .catch(err => {
                console.log(err)
              })
          }
          if (!newdata.totalManufacturerName && totalId) {
            manufacturerApi.findManufacturerById(totalId)
              .then(res => {
                newdata.totalManufacturerName = res.data.manufacturerName
                this.loading = false
              })
              .catch(err => {
                console.log(err)
              })
          }
        }

        if (!newdata.selfLocation) {
          newdata.selfLocation = newdata.province + newdata.city + newdata.area + newdata.town + newdata.selfAddr1 + newdata.selfAddr2
        }
      }
    },
  },

  methods: {
    handleEdit() {
      this.editvisibel = true
      this.$emit('listenhandleEdit', this.editvisibel, this.data)
    },
    handleThreshold(id, ip) {
      if (id && ip) {
        this.$router.push({ name: 'DeviceSettingThreshold', query: { tsId: id, tsIp: ip, isThirdDev: 0 }})
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
    margin-bottom: 5px;
    .nobutton{
      margin-bottom: 20px;
    }
    .basecontent{
        margin-top: 5px;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 4px;
        .el-row:nth-child(2n){
            background: #eee;
        }
        .el-row{
            padding: 3px;
            .el-col-10{
                padding-left: 15px;
                box-sizing: border-box;
            }
            .el-col-14{
                text-align: right;
                padding-right: 10px;
                box-sizing: border-box;
            }
            .el-col{

                font-size: 12px;
            }
        }
    }
}

</style>
