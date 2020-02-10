<template>
  <DataComWrapper
    title="报警数据详情"
  >
    <div class="MapDataView">
      <div
        class="board-box"
      >
        <ol v-if="info.length && info" class="board-list">
          <li
            v-for="(item,i) in info"
            :key="item.deviceId"
            class="board-list-item"
          >
            <div :class="item.status ==='1'?'line-box':'line-box line-box-color'">
              <span class="line-num">{{ i+1 }}</span>

              <div class="line-name">{{ item.devName }}</div>

              <div class="line-value">
                <span>{{ item.alarmDesc }}</span>
              </div>
            </div>
            <p class="border"></p>
          </li>
        </ol>
        <div v-else class="empty-tip">暂无数据</div>
      </div>
    </div>
  </DataComWrapper>
</template>

<script>

import DataComWrapper from './common/DataComWrapper'

export default {
  name: 'MapData',
  components: {
    DataComWrapper,
  },
  props: ['info'],
  data() {
    return {

    }
  },
}
</script>

<style lang="scss">

.MapDataView{
  min-height: 350px;
  height: 100%;
  width: 300px;
  overflow: auto;
  .empty-tip {
    text-align: center;
    padding-top: 20px;
    color: #ccc;
  }

  .board-box {
    padding: 10px 0;
    // height: 170px;
  }

  .board-box + .board-box {
    padding-top: 20px;
    border-top: 1px solid #288dff;
  }

  .board-title {
    font-size: 14px;
    color: white;
    font-weight: bold;
    font-style: italic;
    text-align: center;
    margin: 0;
  }

  .board-list {
    margin: 0;
    padding: 10px;
  }

  .board-list-item {
    list-style: none;

    .line-box {
      height: 28px;
      line-height: 28px;

      display: flex;
      flex-wrap: nowrap;
      color:#f00;
    }

    .line-box-color{
      color: #288dff;
    }

    .line-num {
      width: 45px;
      flex: none;
    }

    .line-name {
    //   @include utils-ellipsis;
      flex: auto;
      padding-right: 1em;
    }

    .line-value {
      flex: none;
      width: 120px;
    }
  }
}

.border{
  margin: 5px 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(
    to right,
    rgba(40,141,255,0.3) 0%,
    rgba(40,141,255,0.3) 10%,
    rgba(40,141,255,0.3) 20%,
    rgba(40,141,255,0.4) 30%,
    rgba(40,141,255,0.5) 40%,
    rgba(40,141,255,0.8) 50%,
    rgba(40,141,255,0.5) 60%,
    rgba(40,141,255,0.4) 70%,
    rgba(40,141,255,0.3) 80%,
    rgba(40,141,255,0.3) 90%,
    rgba(40,141,255,0.3) 100%)
}

</style>
