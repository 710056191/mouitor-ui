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
        <el-col :span="12">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="temp.name" placeholder="设备名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备型号" prop="modelNumber">
            <el-input v-model="temp.modelNumber" placeholder="设备型号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="temp.deviceType" placeholder="请选择设备类型" class="el-select-full">
              <el-option
                v-for="(value,key,index) in deviceTypes"
                :key="index"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备厂家" prop="manufacturerCode">
            <el-select v-model="temp.manufacturerCode" placeholder="请选择设备厂家" class="el-select-full">
              <el-option
                v-for="item in manufacturers"
                :key="item.manufacturerCode"
                :label="item.manufacturerName"
                :value="item.manufacturerCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作电压" prop="voltage">
            <el-input v-model="temp.voltage" placeholder="工作电压" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准功率" prop="standardPower">
            <el-input v-model="temp.standardPower" placeholder="标准功率" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '5'" :span="12">
          <el-form-item label="转速上限" prop="fanSpeedMax">
            <el-input v-model="temp.fanSpeedMax" placeholder="风扇转速上限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '5'" :span="12">
          <el-form-item label="转速下限" prop="fanSpeedMin">
            <el-input v-model="temp.fanSpeedMin" placeholder="风扇转速下限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '1' || temp.deviceType === '2' || temp.deviceType === '8' || temp.deviceType === '3' || temp.deviceType === '6'" :span="12">
          <el-form-item label="电压下限" prop="voltageMin">
            <el-input v-model="temp.voltageMin" placeholder="电压下限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '1' || temp.deviceType === '2' || temp.deviceType === '8' || temp.deviceType === '3' || temp.deviceType === '6'" :span="12">
          <el-form-item label="电压上限" prop="voltageMax">
            <el-input v-model="temp.voltageMax" placeholder="电压上限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '1'" :span="12">
          <el-form-item label="220v电压下限" prop="voltage220Min">
            <el-input v-model="temp.voltage220Min" placeholder="220v电压下限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '1'" :span="12">
          <el-form-item label="220v电压上限" prop="voltage220Max">
            <el-input v-model="temp.voltage220Max" placeholder="220v电压上限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '2' || temp.deviceType === '5' || temp.deviceType === '7' || temp.deviceType === '3' || temp.deviceType === '6'" :span="12">
          <el-form-item label="电流下限" prop="electricityMin">
            <el-input v-model="temp.electricityMin" placeholder="电流下限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '2' || temp.deviceType === '5' || temp.deviceType === '7' || temp.deviceType === '3' || temp.deviceType === '6'" :span="12">
          <el-form-item label="电流上限" prop="electricityMax">
            <el-input v-model="temp.electricityMax" placeholder="电流上限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '1'" :span="12">
          <el-form-item label="温度下限" prop="temperatureMin">
            <el-input v-model="temp.temperatureMin" placeholder="温度下限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '1'" :span="12">
          <el-form-item label="温度上限" prop="temperatureMax">
            <el-input v-model="temp.temperatureMax" placeholder="温度上限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '1'" :span="12">
          <el-form-item label="湿度下限" prop="humidityMin">
            <el-input v-model="temp.humidityMin" placeholder="湿度下限" />
          </el-form-item>
        </el-col>
        <el-col v-if="temp.deviceType === '1'" :span="12">
          <el-form-item label="湿度上限" prop="humidityMax">
            <el-input v-model="temp.humidityMax" placeholder="湿度上限" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交直流(AC/DC)" prop="voltageType">
            <el-radio v-model="temp.voltageType" label="1">交流</el-radio>
            <el-radio v-model="temp.voltageType" label="2">直流</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件证书" prop="technicalDataFiles_temp">
            <uploadComponent v-model="temp.technicalDataFiles_temp" :url="url" param="technicalData" />
          </el-form-item>
        </el-col>
      </el-row>
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
    </el-form>
  </div>
</template>

<script>
import FormEdit from '@/mixins/form-suites/form-edit'
import deviceLibraryApi from '@/api/deviceLibrary'
import uploadComponent from '@/components/UploadComponents/index'
import manufacturerApi from '@/api/manufacturer'
export default {
  name: 'DeviceLibraryEdit',
  components: {
    uploadComponent,
  },
  mixins: [FormEdit],
  data() {
    return {
      id: undefined,
      temp: {
        name: '',
        modelNumber: '',
        deviceType: '',
        manufacturerName: '',
        manufacturerCode: '',
        voltage: '',
        standardPower: '',
        voltageMax: '',
        voltageMin: '',
        electricityMax: '',
        electricityMin: '',
        temperatureMax: '',
        temperatureMin: '',
        humidityMax: '',
        humidityMin: '',
        voltage220Min: '',
        voltage220Max: '',
        voltageType: '',
        technicalDataFiles_temp: [],
      },
      url: '/deviceLibrary/devLibUpload.do',
      deviceTypes: {
        1: '监控终端',
        2: '摄像头',
        3: '补光灯',
        4: '机箱',
        5: '风扇',
        6: '爆光灯',
        7: '光猫',
        8: '加热器',
      },
      rules: {
        name: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        modelNumber: [{ required: true, message: '请输入设备型号', trigger: 'change' }],
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        manufacturerCode: [{ required: true, message: '请选择设备厂家', trigger: 'change' }],
        voltage: [{ required: true, message: '请输入工作电压', trigger: 'change' }],
        standardPower: [{ required: true, message: '请输入标准功率', trigger: 'change' }],
        fanSpeedMax: [{ required: true, message: '请输入风扇转速上限', trigger: 'change' }],
        fanSpeedMin: [{ required: true, message: '请输入风扇转速下限', trigger: 'change' }],
        voltageMin: [{ required: true, message: '请输入电压下限', trigger: 'change' }],
        voltageMax: [{ required: true, message: '请输入电压上限', trigger: 'change' }],
        electricityMin: [{ required: true, message: '请输入电流下限', trigger: 'change' }],
        electricityMax: [{ required: true, message: '请输入电流上限', trigger: 'change' }],
        temperatureMin: [{ required: true, message: '请输入温度下限', trigger: 'change' }],
        temperatureMax: [{ required: true, message: '请输入温度下限', trigger: 'change' }],
        humidityMin: [{ required: true, message: '请输入湿度下限', trigger: 'change' }],
        humidityMax: [{ required: true, message: '请输入湿度上限', trigger: 'change' }],
        voltage220Max: [{ required: true, message: '请输入220v电压上限', trigger: 'change' }],
        voltage220Min: [{ required: true, message: '请输入220v电压下限', trigger: 'change' }],
      },
      manufacturers: [],
    }
  },
  // created() {
  //   if (this.$route.query.id) {
  //     this.id = this.$route.query.id
  //     this.getData()
  //   } else {
  //     this.cancle()
  //   }
  //   manufacturerApi.findManufacturer().then(ret => {
  //     this.manufacturers = ret.data
  //   })
  // },
  mounted() {
    manufacturerApi.findManufacturer().then(ret => {
      this.manufacturers = ret.data
    })
  },
  methods: {
    fetch(params) {
      return deviceLibraryApi.findDeviceLibraryById(params.id).then(ret => {
        const { id, name, modelNumber, deviceType, manufacturerName, manufacturerCode, voltage,
          standardPower, voltageMax, voltageMin, electricityMax, electricityMin,
          temperatureMax, temperatureMin, humidityMax, humidityMin, voltageType, technicalDataFiles, fanSpeedMax, fanSpeedMin,
          voltage220Min, voltage220Max } = ret.data
        return {
          id: id,
          name: name,
          modelNumber: modelNumber,
          deviceType: deviceType + '',
          manufacturerName: manufacturerName,
          manufacturerCode: manufacturerCode,
          voltage: voltage,
          standardPower: standardPower,
          voltageMax: voltageMax,
          voltageMin: voltageMin,
          fanSpeedMax: fanSpeedMax,
          fanSpeedMin: fanSpeedMin,
          electricityMax: electricityMax,
          electricityMin: electricityMin,
          temperatureMax: temperatureMax,
          temperatureMin: temperatureMin,
          humidityMax: humidityMax,
          humidityMin: humidityMin,
          voltage220Min: voltage220Min,
          voltage220Max: voltage220Max,
          voltageType: voltageType,
          technicalDataFiles_temp: technicalDataFiles,
        }
      })
    },
    updateFormValue(formData) {
      this.temp = formData
    },
    getFormValue() {
      if (this.temp.technicalDataFiles_temp) {
        this.temp.fileNames = this.temp.technicalDataFiles_temp.map(item => { return item.name }).join(',')
        this.temp.fileName = this.temp.fileNames
        this.temp.technicalDatas = this.temp.technicalDataFiles_temp.map(item => { return item.url }).join(',')
        this.temp.technicalDataUrl = this.temp.technicalDatas
      }
      return this.temp
    },
    update(data, isNew) {
      const updateApi = isNew ? deviceLibraryApi.addDeviceLibrary : deviceLibraryApi.updateDeviceLibrary
      return updateApi(data).then(ret => {
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
