<template>
  <div>
    <el-form
      :ref="formName"
      v-loading="loader.fetch"
      :model="temp"
      :rules="rules"
      :disabled="loader.fetch"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="选择地区" prop="code">

            <el-input v-model="temp.code" placeholder="地区编码" type="text" style="display:none" />

            <el-row class="el-row-distance">
              <el-col :span="6">
                <el-select
                  v-model="temp.province"
                  placeholder="请选择"
                  filterable
                  @change="changeWhere('itemProvince',temp.province)"
                >
                  <el-option
                    v-for="item in provinceList"
                    :key="item.districtCode"
                    :label="item.districtName"
                    :value="item.districtCode"
                  />
                </el-select>
              </el-col>

              <el-col :span="6">
                <el-select
                  v-model="temp.city"
                  placeholder="请选择"
                  filterable
                  @change="changeWhere('itemCity',temp.city)"
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.districtCode"
                    :label="item.districtName"
                    :value="item.districtCode"
                  />
                </el-select>
              </el-col>

              <el-col :span="6">
                <el-select
                  v-model="temp.area"
                  placeholder="请选择"
                  filterable
                  @change="changeWhere('itemArea',temp.area)"
                >
                  <el-option
                    v-for="item in areaList"
                    :key="item.districtCode"
                    :label="item.districtName"
                    :value="item.districtCode"
                  />
                </el-select>
              </el-col>

              <el-col :span="6">
                <el-select
                  v-model="temp.town"
                  placeholder="请选择"
                  filterable
                  @change="changeWhere('itemTown',temp.town)"
                >
                  <el-option
                    v-for="item in townList"
                    :key="item.districtCode"
                    :label="item.districtName"
                    :value="item.districtCode"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="点位路名" prop="selfAddr1">
            <!-- <el-select
              v-model="temp.selfAddr1"
              placeholder="请选择点位路名"
              class="el-select-full"
              filterable
              @change="changeLevelAddress('itemFirstLevelAddress',temp.selfAddr1)"
            >
              <el-option
                v-for="item in firstLevelAddress"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select> -->
            <el-input v-model="temp.selfAddr1" placeholder="请输入点位路名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="点位位置" prop="selfAddr2">
            <!-- <el-select
              v-model="temp.selfAddr2"
              placeholder="请选择点位位置"
              class="el-select-full"
              filterable
              @change="changeLevelAddress('itemSecondLevelAddress',temp.selfAddr2)"
            >
              <el-option
                v-for="item in secondLevelAddress"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select> -->
            <el-input v-model="temp.selfAddr2" placeholder="请输入点位位置" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工程期数" prop="proTimesId">
            <el-select v-model="temp.proTimesId" placeholder="请选择工程期数" class="el-select-full">
              <el-option
                v-for="item in proTimesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="devName">
            <el-input v-model="temp.devName" placeholder="设备名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="点位编号" prop="selfCode">
            <el-input v-model="temp.selfCode" placeholder="点位编号" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="点位位置" prop="selfLocation">
            <el-input v-model="temp.selfLocation" placeholder="点位位置" type="textarea" />
          </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="网络IP" prop="ip">
            <el-input v-model="temp.ip" placeholder="网络IP" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网络掩码" prop="mask">
            <el-input v-model="temp.mask" placeholder="网络掩码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网络网关" prop="getway">
            <el-input v-model="temp.getway" placeholder="网络网关" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网卡地址" prop="last6Mac">
            <el-input v-model="temp.last6Mac " placeholder="网卡地址" maxlength="12" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="远程服务器IP" prop="serverIP">
            <el-input v-model="temp.serverIP" placeholder="远程服务器IP" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总包商" prop="totalManufacturerId">
            <el-select
              v-model="temp.totalManufacturerId"
              placeholder="请选择总包商"
              class="el-select-full"
            >
              <el-option
                v-for="item in totalManufacturerList"
                :key="item.manufacturerId"
                :label="item.manufacturerName"
                :value="item.manufacturerId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电力供应商" prop="electricManufacturer">
            <el-select
              v-model="temp.electricManufacturer"
              placeholder="请选择电力供应商"
              class="el-select-full"
            >
              <el-option
                v-for="item in electricityManufacturerList"
                :key="item.manufacturerId"
                :label="item.manufacturerName"
                :value="item.manufacturerId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网络供应商" prop="networkManufacturer">
            <el-select
              v-model="temp.networkManufacturer"
              placeholder="请选择网络供应商"
              class="el-select-full"
            >
              <el-option
                v-for="item in networkManufacturerList"
                :key="item.manufacturerId"
                :label="item.manufacturerName"
                :value="item.manufacturerId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="temp.longitude" placeholder="经度" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="temp.latitude" placeholder="纬度" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用设备" prop="status">
            <el-radio v-model="temp.status" label="0">启用</el-radio>
            <el-radio v-model="temp.status" label="4">不启用</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div class="text-align-right">
          <el-button :disabled="!canBeClosed" @click="emitCancel">取消</el-button>
          <el-button type="primary" :loading="loader.update" @click="submitForm">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import FormEdit from '@/mixins/form-suites/form-edit'
import deviceApi from '@/api/device'
import manufacturerApi from '@/api/manufacturer'
import protimesApi from '@/api/protimes'
import addressApi from '@/api/address'

export default {
  name: 'DeviceEdit',
  mixins: [FormEdit],
  props: ['params'],
  data() {
    return {
      id: undefined,

      provinceList: [],
      cityList: [],
      areaList: [],
      townList: [],

      temp: {
        status: '0',
        code: '',
        selfAddr1: '',
        selfAddr2: '',
      },

      url: '/deviceLibrary/devLibUpload.do',

      rules: {
        code: [
          {
            required: true,
            message: '请选择地区',
            trigger: 'blur',
          },
        ],
        selfAddr1: [
          {
            required: true,
            message: '请输入：地区 - 点位路名',
            trigger: 'change',
          },
        ],
        selfAddr2: [
          {
            required: true,
            message: '请输入：地区 - 点位路名 - 点位位置',
            trigger: 'change',
          },
        ],
        proTimesId: [
          {
            required: true,
            message: '请选择工程期数',
            trigger: 'blur',
          },
        ],
        selfCode: [
          {
            required: true,
            message: '请输入点位编号',
            trigger: 'change',
          },
        ],
        devName: [
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
        last6Mac: [
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
        longitude: [
          {
            message: '请输入经度',
            trigger: 'change',
          },
          {
            message: '如：180.0（整数部分为0～180，必须输入1到5位小数）',
            trigger: 'change',
            pattern: /^[-\+]?((1[0-7]\d{1}|0?\d{1,2})\.\d{1,5}|180\.0{1,5})$/,
          },
        ],
        latitude: [
          {
            message: '请输入纬度',
            trigger: 'change',
          },
          {
            message: '如：90.0（整数部分为0～90，必须输入1到5位小数）',
            trigger: 'change',
            pattern: /^[-\+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/,
          },
        ],
      },

      electricityManufacturerList: [],
      networkManufacturerList: [],
      totalManufacturerList: [],

      proTimesList: [],

      firstLevelAddress: [],
      secondLevelAddress: [],
    }
  },

  watch: {
    params: {
      handler(newdata, olddata) {
        // 监听父组件的传值，当在树形控件中的某一节点点击添加时使用
        if (newdata.level === 1) {
          this.temp = {
            province: newdata.data.label,
            provinceCode: newdata.data.code,
          }
        } else if (newdata.level === 2) {
          this.temp = {
            province: newdata.parent.data.label,
            city: newdata.data.label,
            provinceCode: newdata.parent.data.code,
            cityCode: newdata.data.code,
          }
        } else if (newdata.level === 3) {
          this.temp = {
            province: newdata.parent.parent.data.label,
            city: newdata.parent.data.label,
            area: newdata.data.label,
            provinceCode: newdata.parent.parent.data.code,
            cityCode: newdata.parent.data.code,
            areaCode: newdata.data.code,
          }
        } else if (newdata.level === 4) {
          this.temp = {
            province: newdata.parent.parent.parent.data.label,
            city: newdata.parent.parent.data.label,
            area: newdata.parent.data.label,
            town: newdata.data.label,
            provinceCode: newdata.parent.parent.parent.data.code,
            cityCode: newdata.parent.parent.data.code,
            areaCode: newdata.parent.data.code,
            townCode: newdata.data.code,
          }
        } else if (newdata.level === 5) {
          this.temp = {
            province: newdata.parent.parent.parent.parent.data.label,
            city: newdata.parent.parent.parent.data.label,
            area: newdata.parent.parent.data.label,
            town: newdata.parent.data.label,
            selfAddr1: newdata.data.label,
            provinceCode: newdata.parent.parent.parent.parent.data.code,
            cityCode: newdata.parent.parent.parent.data.code,
            areaCode: newdata.parent.parent.data.code,
            townCode: newdata.parent.data.code,
          }
        } else if (newdata.level === 6) {
          this.temp = {
            province: newdata.parent.parent.parent.parent.parent.data.label,
            city: newdata.parent.parent.parent.parent.data.label,
            area: newdata.parent.parent.parent.data.label,
            town: newdata.parent.parent.data.label,
            selfAddr1: newdata.parent.data.label,
            selfAddr2: newdata.data.label,
            provinceCode: newdata.parent.parent.parent.parent.parent.data.code,
            cityCode: newdata.parent.parent.parent.parent.data.code,
            areaCode: newdata.parent.parent.parent.data.code,
            townCode: newdata.parent.parent.data.code,
          }
        }
        if (this.temp.provinceCode) {
          this.changeWhere('itemProvince', this.temp.provinceCode)
          this.temp.province = this.temp.provinceCode
        }
        if (this.temp.cityCode) {
          this.changeWhere('itemCity', this.temp.cityCode)
          this.temp.city = this.temp.cityCode
        }
        if (this.temp.areaCode) {
          this.changeWhere('itemArea', this.temp.areaCode)
          this.temp.area = this.temp.areaCode
        }
        if (this.temp.townCode) {
          this.changeWhere('itemTown', this.temp.townCode)
          this.temp.town = this.temp.townCode
        }
      },
      deep: true,
    },
  },

  mounted() {
    manufacturerApi.listElectricManufacturer().then(ret => {
      this.electricityManufacturerList = ret.data
    })

    manufacturerApi.listNetManufacturer().then(ret => {
      this.networkManufacturerList = ret.data
    })

    manufacturerApi.listTotalManufacturer().then(ret => {
      this.totalManufacturerList = ret.data
    })

    // 工程期数
    protimesApi.getProTimesList().then(ret => {
      this.proTimesList = ret.data
    })

    addressApi.getDistrict({ code: '' }).then(ret => {
      this.provinceList = ret.data
    })
  },

  methods: {
    fetch(params) {
      return deviceApi.findById(params.id).then(ret => {
        const {
          devid, province, city, area, town, code, selfAddr1, selfAddr2, proTimesId, devName, selfCode,
          ip, mask, getway, last6Mac, serverIP,
          totalManufacturerId, electricManufacturer, networkManufacturer, longitude, latitude, status,
        } = ret.data
        return {
          province: province,
          city: city,
          area: area,
          town: town,
          devid: devid,
          code: code,
          selfAddr1: selfAddr1,
          selfAddr2: selfAddr2,
          proTimesId: proTimesId,
          devName: devName,
          selfCode: selfCode,
          ip: ip,
          mask: mask,
          getway: getway,
          last6Mac: last6Mac,
          serverIP: serverIP,
          totalManufacturerId: totalManufacturerId,
          electricManufacturer: electricManufacturer,
          networkManufacturer: networkManufacturer,
          longitude: longitude,
          latitude: latitude,
          status: status,
        }
      })
    },

    updateFormValue(formData) {
      this.temp = formData
      if (this.temp.status !== '4') {
        this.temp.status = '0'
      }
    },

    getFormValue() {
      return this.temp
    },

    changeWhere(params, val,) {
      if (!(params && val)) {
        console.warn(
          'changeLocation: params val should be required',
          params,
          val
        )
        return
      }

      const LocationKeys = ['itemProvince', 'itemCity', 'itemArea', 'itemTown']
      const currentLocationIdx = LocationKeys.indexOf(params)

      if (currentLocationIdx === -1) {
        console.warn('changeLocation: params not found', params)
        return
      }

      const clearupNextSelector = currentIdx => {
        /* eslint-disable no-fallthrough */

        const location = this.temp
        const netxtIdx = currentIdx + 1

        switch (netxtIdx) {
          // province
          case 0:

          // city
          case 1:
            location.city = ''
            this.cityList = []

          case 2:
            location.area = ''
            this.areaList = []

          case 3:
            location.town = ''
            this.townList = []
            break

          default:
            break
        }

        /* eslint-enable no-fallthrough*/
      }

      const clearupRelatedAddress = () => {
        this.temp.selfAddress1 = ''
        this.temp.selfAddress2 = ''
        this.firstLevelAddress = ''
        this.secondLevelAddress = ''
      }

      const setNextLocationList = (index, list) => {
        switch (index) {
          case 0:
            this.provinceList = list
            break

          case 1:
            this.cityList = list
            break

          case 2:
            this.areaList = list
            break

          case 3:
            this.townList = list
            break
        }
      }

      const currentCode = val

      clearupNextSelector(currentLocationIdx)

      // let nextLocationList
      addressApi.getDistrict({ code: currentCode }).then(ret => {
        const nextLocationList = ret.data

        if (!nextLocationList || nextLocationList.length <= 0) {
          // console.log('改变地区'+currentCode)

          this.temp.code = currentCode

          this.getFirstLevelAddressList()
        } else {
          setNextLocationList(currentLocationIdx + 1, nextLocationList)
          clearupRelatedAddress()
        }
      })
    },

    // changeLevelAddress(params, val) {
    //   // console.log('地址标签:' + params)
    //   // console.log('地址值:' + val)
    //   if (params === 'itemFirstLevelAddress') {
    //     this.temp.selfAddress2 = ''
    //     this.secondLevelAddress = ''
    //     this.getSecondLevelAddressList(val)
    //   } else if (params === 'itemSecondLevelAddress') {
    //     this.temp.selfAddress2 = val
    //   }
    // },

    // 获取点位路名
    getFirstLevelAddressList() {
      var code = this.temp.code
      // console.log('区域代码一级地址：' + code)
      if (code && code !== '') {
        addressApi.getSelfAddr({ code: code }).then(ret => {
          this.firstLevelAddress = ret.data
        })
      }
    },

    // 获取点位位置
    getSecondLevelAddressList() {
      var code = this.temp.code
      var selfAddress1 = this.temp.selfAddr1
      // console.log('二级地址区域代码是：' + code + '一级地址是：' + selfAddress1)
      if (code && code !== '' && selfAddress1 && selfAddress1 !== '') {
        addressApi.getSelfAddr({ code: code, selfAddress1: selfAddress1 }).then(ret => {
          this.secondLevelAddress = ret.data
        })
      }
    },

    resolveFetchData(data) {
      this.changeWhere('itemProvince', data.province)
      this.changeWhere('itemCity', data.city)
      this.changeWhere('itemArea', data.area)
      this.changeWhere('itemTown', data.town)
      // this.changeLevelAddress('itemFirstLevelAddress', data.selfAddress1)
      // this.changeLevelAddress('itemSecondLevelAddress', data.selfAddress2)
    },

    update(data, isNew) {
      console.log(data)
      const updateApi = isNew ? deviceApi.add : deviceApi.update

      return updateApi(data).then(ret => {
        console.log(data)
        this.$message({
          message: ret.message,
          type: 'success',
        })
      })
    },

  },
}
</script>

<style lang="scss">
</style>
