<!--
数据报表 - 统计分析
-->

<template>
  <div class="report-analyze-view  module-content-box">
    <div class="sf-filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <el-date-picker
            v-model="filterModel.dateRange"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>

        <el-form-item
          v-for="text in filterBarConf.texts"
          :key="text.prop"
          class="filter-item-wrap"
        >
          <el-select
            v-if="text.type === 'select'"
            v-model="listQuery[text.prop]"
            :placeholder="text.placeholder || text.name"
            clearable
          >
            <el-option
              v-for="(item, index) in text.list"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-else
            v-model="listQuery[text.prop]"
            :placeholder="text.placeholder || text.name"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            :loading="listLoading"
            @click="handleFilter"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="sf-table-top-toolbar">
      <div class="inner">
        <el-button
          type="primary"
          class="filter-item"
          @click="alarmCount"
        >
          下载报警次数明细数据
        </el-button>
        <el-button
          type="primary"
          class="filter-item"
          @click="alarmDetail"
        >
          下载报警时长明细数据
        </el-button>
      </div>
    </div>

    <div class="charts-main">
      <analyze-chart
        v-for="(c, index) in chartsConfig"
        :key="index"
        :config="c"
        :data="chartsDataList[index]"
      />
    </div>

  </div>
</template>

<script>
import configApi from '@/api/config'
import firmwareApi from '@/api/firmware'
import { alarmCountExcel, alarmDetailExcel } from '@/api/report'
import { chartsConfig, generatePickerShortcutsOptions, loadChartDataByConfig } from './utils'
import AnalyzeChart from './components/AnalyzeChart'
import { format as dateFormat } from 'date-fns'

const pickerDefaultOptions = {
  shortcuts: generatePickerShortcutsOptions(),
}

export default {
  name: 'ReportAnalyze',
  components: { AnalyzeChart },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        // pageNumber: 1,
        // pageSize: 10,
        // --
        selfCode: '',
        ipStart: '',
        ipEnd: '',
        // ----
        startDate: '',
        endDate: '',
      },

      filterModel: {
        dateRange: '',
      },

      filterBarConf: {
        texts: [
          // { name: '快速选择', prop: '' },
          // { name: '开始日期', prop: 'startDate', type: 'select', list: null, placeholder: '请选择开始日期' },
          // { name: '结束日期', prop: 'endDate', type: 'select', list: null, placeholder: '请选择结束日期' },
          { name: '设备编号', prop: 'selfCode' },
          { name: '开始 IP', prop: 'ipStart', placeholder: '网络开始 IP 地址' },
          { name: '结束 IP', prop: 'ipEnd', placeholder: '网络结束 IP 地址' },
        ],
      },

      pickerOptions: pickerDefaultOptions,

      chartsConfig,

      chartsDataList: [],
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      // sysLogApi.fetchList(this.listQuery).then(res => {
      //   this.list = res.data.result
      //   this.total = res.data.total
      //
      //   this.listLoading = false
      // })
      this.loadChartData().finally(() => {
        this.listLoading = false
      })
    },

    async loadChartData() {
      const params = {
        ...this.listQuery,
      }

      /** @type {Array} */
      const pendingList = this.chartsConfig.map(conf => {
        return loadChartDataByConfig(conf, params)
      })
      const resultList = await Promise.all(pendingList)
      this.chartsDataList = resultList
      console.log('[Analyze] loadChartData', resultList)
    },

    handleFilter() {
      // this.listQuery.pageNumber = 1

      // handle datePick data
      const dateRange = this.filterModel.dateRange || []
      const [startDate, endDate] = dateRange

      this.listQuery.startDate = startDate ? dateFormat(startDate, 'YYYY-MM-DD') : ''
      this.listQuery.endDate = endDate ? dateFormat(endDate, 'YYYY-MM-DD') : ''

      this.getList()
    },

    handleEdit(target) {
      if (!target || !target.firmwareId) {
        return
      }
      this.dialogEdit.id = target.firmwareId
      this.openEditDialog()
    },

    async handleActivation(target) {
      if (!target || !target.firmwareId) {
        return
      }
      const currentValid = target.configStatus === 1
      const toValid = !currentValid
      const toValidText = toValid ? '激活' : '禁用'

      const confirmTask = () => {
        const type = toValid ? 'warning' : 'error'
        return this.$confirm(`确定要${toValidText}`, '更新状态', { type })
          .catch(() => Promise.reject(null))
      }

      const updateTask = async() => {
        await configApi.updateItmStatusById(target.firmwareId, toValid)
          .catch(() => Promise.reject(null))

        this.$message.success(`${target.firmwareName} 已${toValidText}`)
      }

      try {
        await confirmTask()
        await updateTask()
        this.getList()
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
    },

    // EditDialog start

    async openEditDialog() {
      // open dialog
      // load detail data

      const dialog = this.dialogEdit
      dialog.visible = true
      dialog.loading = true

      let data
      try {
        const res = await firmwareApi.getById({ id: dialog.id })
        data = res.data
      } catch (e) {
        console.error(e)
      }
      dialog.loading = false

      if (!data) {
        dialog.visible = false
        return
      }
      dialog.form.backupId = data.backupId || ''
      dialog.form.backupName = data.backupName || ''
    },

    editDialogCancelBtnOnclick() {
      if (this.editDialogDetermineClose()) {
        this.dialogEdit.visible = false
      }
    },

    async editDialogOnSubmit() {
      // set commit button loading
      // validate form
      // commit
      // close and reload list

      const dialog = this.dialogEdit
      dialog.committing = true

      try {
        await this.editDialogFormValidate()
      } catch (e) {
        console.log('editDialogFormValidate error', e)
        dialog.committing = false
        return
      }

      try {
        await firmwareApi.update({ ...dialog.form })
        dialog.visible = false
        this.getList()

        // eslint-disable-next-line no-empty
      } catch (e) {
      }
      dialog.committing = false
    },

    editDialogFormValidate() {
      return new Promise((resolve, reject) => {
        this.$refs['editDialogForm'].validate(valid => {
          valid ? resolve() : reject()
        })
      })
    },

    editDialogBeforeClose(done) {
      this.editDialogDetermineClose() && done()
    },

    // 确认弹框能否关闭
    editDialogDetermineClose() {
      if (this.dialogEdit.committing) {
        this.$message.warning('正在提交，请稍等')
        return false
      }
      return true
    },

    // EditDialog end

    // datePicker start

    initDatePicker() {

    },

    // datePicker end

    alarmCount() {
      alert('sss')
      const dateRange = this.filterModel.dateRange || []
      const [startDate, endDate] = dateRange
      this.listQuery.startDate = startDate ? dateFormat(startDate, 'YYYY-MM-DD') : ''
      this.listQuery.endDate = endDate ? dateFormat(endDate, 'YYYY-MM-DD') : ''
      alarmCountExcel(this.listQuery)
    },

    alarmDetail() {
      const dateRange = this.filterModel.dateRange || []
      const [startDate, endDate] = dateRange
      this.listQuery.startDate = startDate ? dateFormat(startDate, 'YYYY-MM-DD') : ''
      this.listQuery.endDate = endDate ? dateFormat(endDate, 'YYYY-MM-DD') : ''
      alarmDetailExcel(this.listQuery)
    },
  },
}
</script>

<style lang="scss">
.charts-main{
  margin-top:50px;
}
</style>
