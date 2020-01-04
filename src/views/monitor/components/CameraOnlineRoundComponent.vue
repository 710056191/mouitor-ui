<template>
  <div class="CameraRound-container">
    <!-- 在线率 -->
    <div>
      <div v-for="(item, index) in winner" :key="index">
        <span>{{ index + 1 }}</span>
        <span>{{ item.location }}</span>
        <span>{{ (1 - item.rate)*100 }}%</span>
      </div>
    </div>

    <!-- 在线率 -->
    <div>
      <div v-for="(item, index) in loser" :key="index">
        <span>{{ index + 1 }}</span>
        <span>{{ item.location }}</span>
        <span>{{ item.rate * 100 }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CameraOnlineRound',
  props: {
    dataList: { type: Array, default: Array },
  },
  data() {
    return {
      winner: [],
      loser: [],
    }
  },
  watch: {
    dataList(cur, old) {
      this.init()
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const length = this.dataList.length
      const winner = []
      const loser = []
      if (length >= 3) {
        for (let i = 0; i < 3; i++) {
          winner.push(this.dataList[i])
          loser.push(this.dataList[length - i - 1])
        }
      } else {
        for (let i = 0; i < length; i++) {
          winner.push(this.dataList[i])
          loser.push(this.dataList[length - i - 1])
        }
      }

      this.winner = winner
      this.loser = loser
    },
  },
}
</script>

<style scoped>
.CameraRound-container{
  height: 300px;
  width: 200px;
}
</style>
