<!--设置关联地址-->
<template>
  <div>
    <el-form
      ref="createForm"
      :model="temp"
      :rules="rules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="选择地区" prop="code">
            <el-input v-model="temp.code" placeholder="编码" type="text" style="display:none" />
            <el-row class="el-row-distance">

              <el-col :span="6">
                <el-select
                  v-model="temp.province"
                  placeholder="请选择"
                  filterable
                  @change="change('itemProvince',temp.province)"
                >
                  <el-option
                    v-for="item in firstList"
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
                  @change="change('itemCity',temp.city)"
                >
                  <el-option
                    v-for="item in secondList"
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
                  @change="change('itemArea',temp.area)"
                >
                  <el-option
                    v-for="item in thirdList"
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
                  @change="change('itemTown',temp.town)"
                >
                  <el-option
                    v-for="item in forthList"
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
          <el-form-item label="点位路名" prop="selfAddress1">
            <el-input v-model="temp.selfAddress1" placeholder="点位路名" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="点位位置" prop="selfAddress2">
            <el-input v-model="temp.selfAddress2" placeholder="点位位置" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div class="text-align-right">
          <!-- <el-button @click="createDialog = false">取消</el-button> -->
          <el-button type="primary" @click="addData">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import addressApi from '@/api/address'
import FormEdit from '@/mixins/form-suites/form-edit'

export default {
  name: 'LinkAddress',
  mixins: [FormEdit],

  data() {
    return {

      firstList: {},
      secondList: {},
      thirdList: {},
      forthList: {},

      temp: {
        code: '',
      },

      rules: {
        code: [{ required: true, message: '请选择地区', trigger: 'change' }],
        selfAddress1: [{ required: true, message: '请输入点位路名', trigger: 'change' }],
        selfAddress2: [{ required: true, message: '请输入点位位置', trigger: 'change' }],
      },

      createDialog: false,
    }
  },
  mounted() {
    addressApi.getDistrict({ code: '' }).then(ret => {
      this.firstList = ret.data
    })
  },
  methods: {
    change(params, val) {
      if ((params === 'itemProvince') && (val !== '')) {
        var codeFirst = this.temp.province
        this.temp.code = ''

        this.temp.city = ''
        this.temp.area = ''
        this.temp.town = ''

        this.secondList = ''
        this.thirdList = ''
        this.forthList = ''

        addressApi.getDistrict({ code: codeFirst }).then(ret => {
          this.secondList = ret.data
          // console.log('1级地址：' + ret.data)
        })
      }

      if ((params === 'itemCity') && (val !== '')) {
        var codeSecond = this.temp.city
        this.temp.code = ''

        this.temp.area = ''
        this.temp.town = ''

        this.thirdList = ''
        this.forthList = ''

        addressApi.getDistrict({ code: codeSecond }).then(ret => {
          if (ret.data.length <= 0) {
            this.temp.code = this.temp.city
          } else {
            this.thirdList = ret.data
            // console.log('2级地址：' + ret.data)
          }
        })
      }

      if ((params === 'itemArea') && (val !== '')) {
        var codeThird = this.temp.area
        this.temp.code = ''

        this.temp.town = ''

        this.forthList = ''

        addressApi.getDistrict({ code: codeThird }).then(ret => {
          if (ret.data.length <= 0) {
            this.temp.code = this.temp.city
          } else {
            this.forthList = ret.data
            // console.log('3级地址：' + ret.data)
          }
        })
      }

      if ((params === 'itemTown')) {
        this.temp.town = val
        this.temp.code = this.temp.town
        // console.log('4级地址：'' + val)
        this.$forceUpdate()
      }
    },

    resolveFetchData(data) {
      this.change('itemProvince', data.province)
      this.change('itemCity', data.city)
      this.change('itemArea', data.area)
      this.change('itemTown', data.town)
    },

    addData() {
      this.$refs['createForm'].validate((validate) => {
        if (validate) {
          this.$forceUpdate()
          var code = this.temp.code
          var selfAddress1 = this.temp.selfAddress1
          var selfAddress2 = this.temp.selfAddress2
          addressApi.addressAdd({ code: code, selfAddress1: selfAddress1, selfAddress2: selfAddress2 }).then(ret => {
            if (ret.success) {
              this.$message({
                message: ret.message,
                type: 'success',
              })
              this.createDialog = false
            }
          })
        }
      })
    },

  },
}
</script>

<style lang="scss">

</style>
