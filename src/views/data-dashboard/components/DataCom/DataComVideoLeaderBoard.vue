<template>
  <DataComWrapper
    title="视频数据排行表"
  >
    <div class="DataComVideoLeaderBoard">
      <div
        v-for="(table, tableIdx) in tableData"
        :key="tableIdx"
        class="board-box"
      >
        <p class="board-title">{{ table.title }}</p>

        <ol v-if="table.list && table.list.length" class="board-list">
          <li
            v-for="(line, lineIdx) in table.list"
            :key="lineIdx"
            class="board-list-item"
          >
            <div class="line-box">
              <span class="line-num">{{ lineIdx + 1 }}</span>

              <div class="line-name">{{ line.name }}</div>

              <div class="line-value">
                <span>{{ table.rateName }}</span>
                <span :style="{color: line.color}">{{ line.value | percentage }}</span>
              </div>
            </div>
          </li>
        </ol>

        <div v-else class="empty-tip">暂无数据</div>
      </div>
    </div>
  </DataComWrapper>

</template>

<script>
import DataComponent from './mixins/data-component'
import mockData from './utils/mock-data/video-leader-board'
import DataComWrapper from './common/DataComWrapper'

export default {
  name: 'DataComVideoLeaderBoard',

  components: {
    DataComWrapper,
  },
  mixins: [DataComponent],

  data() {
    return {
      ctrl: {
        color: ['#ffd52b', '#08b9ad', '#288dff'],
      },

      tableData: [
        {
          title: '视频在线率排行表',
          rateName: '在线率',
          list: [],
        },
        {
          title: '视频离线率排行表',
          rateName: '离线率',

          // list item e.g.
          // {name, value: 0.98, color: '#fff'}
          list: [],
        },
      ],
    }
  },

  methods: {
    setMockData() {
      if (process.env.NODE_ENV === 'production') {
        return
      }
      const tableData = this.tableData
      tableData[0].list = mockData.list.slice(0, 3)
      tableData[1].list = mockData.list.slice(4, 4 + 3)

      this.setupTableColor()
    },

    handleChartInfo() {
      const info = this.info || {}

      const dataList = info.list || []

      // 逻辑来自 CameraOnlineRound
      const length = dataList.length
      const winner = []
      const loser = []
      if (length >= 3) {
        for (let i = 0; i < 3; i++) {
          winner.push(dataList[i])
          loser.push(dataList[length - i - 1])
        }
      } else {
        for (let i = 0; i < length; i++) {
          winner.push(dataList[i])
          loser.push(dataList[length - i - 1])
        }
      }

      const tableData = this.tableData
      tableData[0].list = winner.map(item => {
        return {
          name: item.location,
          value: 1 - item.rate,
        }
      })
      tableData[1].list = loser.map(item => {
        return {
          name: item.location,
          value: item.rate,
        }
      })

      this.setupTableColor()
    },

    setupTableColor() {
      const colorList = this.ctrl.color
      const colorLength = colorList.length

      const tableData = this.tableData
      tableData.forEach(table =>
        table.list.forEach((line, idx) => {
          line.color = colorList[idx % colorLength]
        }))
    },
  },
}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.DataComVideoLeaderBoard {
  min-height: 250px;

  .empty-tip {
    text-align: center;
    padding-top: 20px;
    color: #ccc;
  }

  .board-box {
    padding: 10px 0;
    height: 170px;
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
    padding: 15px 40px;
  }

  .board-list-item {
    list-style: none;

    border-bottom: 1px dashed #288dff;

    .line-box {
      height: 36px;
      line-height: 36px;

      display: flex;
      flex-wrap: nowrap;
    }

    .line-num {
      width: 45px;
      flex: none;
    }

    .line-name {
      @include utils-ellipsis;
      flex: auto;
      padding-right: 1em;
    }

    .line-value {
      flex: none;
      width: 120px;
    }
  }
}
</style>
