<template>
  <VideoPlayer
    ref="playerContain"
    :options="innerOptions"
    class="benchmark-pic-live-view"
    @play="handlePlay"
  />
</template>

<script>
import 'video.js/dist/video-js.css'
import VideoPlayer from '@/components/VideoPlayer'
import { delay } from '@/utils'

export default {
  name: 'BenchmarkPicLive',

  components: {
    VideoPlayer,
  },

  props: {
    url: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      defaultOptions: {
        height: '300',
        // sources: [],
        techOrder: ['flash'],
        autoplay: true,
        notSupportedMessage: '当前浏览器不支持',
        bigPlayButton: false,
        controls: true,
        controlBar: {
          pictureInPictureToggle: false,
        },
      },
    }
  },

  computed: {
    innerOptions() {
      const url = this.url
      const defaultOptions = this.defaultOptions

      const sources = url
        ? [{
          type: 'rtmp/flv',
          src: url,
        }]
        : undefined
      return {
        ...defaultOptions,
        sources,
      }
    },

    player() {
      const playerContain = this.$refs.playerContain
      return playerContain && playerContain.player
    },
  },

  mounted() {

  },

  methods: {
    handlePlay() {
      delay(30 * 1e3)
        .then(() => {
          const player = this.player
          if (player && player.paused && !player.paused()) {
            player.pause && player.pause()
            console.log('Actively pause the player')
          }
        })
    },
  },
}
</script>

<style>
.benchmark-pic-live-view.video-player .video-js {
  width: 100%;
  height: 100%;
}
</style>
