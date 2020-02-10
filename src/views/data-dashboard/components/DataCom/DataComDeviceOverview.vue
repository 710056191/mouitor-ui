<template>
  <DataComWrapper
    title="设备实时数据"
  >
    <div class="data-com-device-overview">
      <div
        v-for="(item, idx) in list"
        :key="idx"
        class="info-box"
      >
        <p class="info-title">{{ item.name }}</p>

        <p class="info-value">{{ item.value }}</p>

        <p class="info-extra">{{ item.extra }}</p>
      </div>
    </div>
  </DataComWrapper>
</template>

<script>
import DataComWrapper from './common/DataComWrapper'
import DataComponent from './mixins/data-component'

export default {
  name: 'DataComDeviceOverview',

  components: { DataComWrapper },
  mixins: [DataComponent],

  data() {
    return {
      list: [
        {
          name: '设备箱总数',
          value: '325',
          extra: '台',
        },
        {
          name: '守护设备总数',
          value: '312',
          extra: '台',
        },
        {
          name: '当前设备异常数',
          value: '13',
          extra: '台',
        },
      ],
    }
  },

  methods: {
    handleChartInfo() {
      // console.log('handleChartInfo', this.info)

      const info = this.info || {}
      const list = this.list
      list[0].value = info.boxTotal
      list[1].value = info.boxOnline
      list[2].value = info.boxErr
    },
  },
}
</script>

<style lang="scss">
.data-com-device-overview {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;

  padding: 10px 0;

  .info-box {
    $lc-color-yellow: #ffd42b;
    $lc-color-green: #08d5c1;
    $lc-color-blue: #07b6ff;

    position: relative;
    width: 154px;
    height: 160px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    p {
      margin: 0;
      text-align: center;
    }

    .info-title {
      line-height: 20px;
      font-size: 13px;
      color: white;
      font-weight: bold;
      font-style: italic;
    }

    .info-value {
      font-size: 52px;
      font-weight: bold;
      font-style: italic;
    }

    .info-extra {
      font-size: 16px;
      font-weight: bold;
      font-style: italic;

      text-align: right;
      padding-right: 14px;
      padding-bottom: 13px;
    }

    &:nth-child(1) {
      background: url('~@/assets/data-dashboard/device-overview/yellow.png');
      background-position-x: -11px;
      background-position-y: -13px;

      color: $lc-color-yellow;
    }

    &:nth-child(2) {
      background: url('~@/assets/data-dashboard/device-overview/green.png');

      color: $lc-color-green;
    }

    &:nth-child(3) {
      background: url('~@/assets/data-dashboard/device-overview/blue.png');
      background-position-y: -13px;

      color: $lc-color-blue;
    }
  }
}
</style>
