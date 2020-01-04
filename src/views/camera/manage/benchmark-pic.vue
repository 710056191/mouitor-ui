<template>
  <div class="benchmark-pic-view">
    <el-row
      type="flex"
    >
      <el-col :span="12">
        <div class="display-box video-box">
          <div class="box-header">实时摄像头图像（20秒）</div>
          <div class="box-wrap">
            <div
              v-loading="loader.config"
              class="camera-video-area"
            >
              <BenchmarkPicLive
                :url="rtmpPath"
                class="camera-video"
              />
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="display-box picture-box">
          <div class="box-header">预览基准图片</div>
          <div class="box-wrap">
            <el-image
              v-loading="loader.config"
              fit="contain"
              :src="previewPic"
              class="preview-pic"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="slider-box">
      <div class="tip-area">
        <span>请选择一张图片作为基准图片并保存</span>
        <el-button
          v-if="progress.firstLoaded"
          :loading="loader.screenshots"
          @click="refreshPicBtnOnClick"
        >刷新图片
        </el-button>
      </div>

      <BenchmarkPicSlider
        ref="imgSlider"
        v-loading="loader.screenshots"
        :images="screenshots"
        @image-click="sliderImageClick"
      />
    </div>

    <div class="button-bar">
      <el-button
        :loading="loader.save"
        type="primary"
        @click="updateBenchmarkPic"
      >保存
      </el-button>
      <!--      <el-button>取消</el-button>-->
    </div>
  </div>
</template>

<script>
import {
  getBenchmarkPictureConfig,
  getCameraScreenshots,
  setBenchmarkPic,
} from '@/api/camera'

import BenchmarkPicSlider from '@/views/camera/manage/components/BenchmarkPicSlider'
import BenchmarkPicLive from '@/views/camera/manage/components/BenchmarkPicLive'

export default {
  name: 'CameraManageBenchmarkPic',
  components: { BenchmarkPicLive, BenchmarkPicSlider },

  data() {
    return {
      cameraId: null,

      rtmpPath: '',

      imgBase: '',

      screenshots: [],

      // 默认 基准图片 url
      defaultBenchmarkPic: '',

      // 选择的 基准图片 url
      selectedBenchmarkPic: '',

      loader: {
        config: true,
        init: true,
        screenshots: true,
        save: false,
      },

      progress: {
        firstLoaded: false,
      },
    }
  },

  computed: {
    defaultBenchmarkPicBaseUrl() {
      const imgUrlBase = this.imgBase || ''
      const id = this.cameraId
      return imgUrlBase
        ? `${imgUrlBase}/imgBaseDir/${id}.jpg`
        : ''
    },

    previewPic() {
      if (this.selectedBenchmarkPic) {
        return this.selectedBenchmarkPic
      } else {
        return this.defaultBenchmarkPic
      }
    },
  },

  mounted() {
    const { id } = this.$route.params
    this.cameraId = id

    this.init()
      .then(() => {
        this.progress.firstLoaded = true
      })
  },

  methods: {
    init() {
      const loader = this.loader
      loader.init = true
      loader.config = true
      return this.loadConfig()
        .then(() => {
          this.refreshDefaultBenchmarkPic()
          loader.config = false

          return this.loadScreenshots()
        })
        .finally(() => {
          this.loader.init = false
        })
    },

    loadConfig() {
      return getBenchmarkPictureConfig(this.cameraId)
        .then(res => {
          this.rtmpPath = res.data.rtmpPath
          this.imgBase = res.data.imgBase
        })
    },

    refreshDefaultBenchmarkPic() {
      this.defaultBenchmarkPic = this.defaultBenchmarkPicBaseUrl + '?_random' + Math.random()
    },

    loadScreenshots() {
      this.loader.screenshots = true
      return getCameraScreenshots(this.cameraId)
        .then(res => {
          const list = res.data
          if (!Array.isArray(list)) {
            return console.warn('fetchScreenshots, returned data error', res)
          }
          this.updateScreenshots(list)
        })
        .catch(error => {
          console.error('请检查是否设置了正确的协议或网络是否在问题', error)
        })
        .finally(() => {
          this.loader.screenshots = false
        })
    },

    updateScreenshots(images) {
      if (!Array.isArray(images)) {
        console.warn('updateScreenshots error: images should be array')
        return
      }

      this.screenshots = images
      this.refreshImgSlider()
    },

    refreshImgSlider() {
      this.$refs.imgSlider && this.$refs.imgSlider.refresh()
    },

    sliderImageClick(imgUrl) {
      if (imgUrl) {
        this.selectedBenchmarkPic = imgUrl
      }
    },

    updateBenchmarkPic() {
      const url = this.selectedBenchmarkPic
      if (!url) {
        this.$message.warning('请选择一张基准图片')
        return
      }

      this.loader.save = true
      setBenchmarkPic(this.cameraId, url)
        .then(() => {
          this.$message.success('设置基准图片成功')

          // 清除选择的图片 & 刷新默认基准图的链接
          this.$refs.imgSlider.clearSelection()
          this.selectedBenchmarkPic = ''
          this.refreshDefaultBenchmarkPic()
        })
        .finally(() => {
          this.loader.save = false
        })
    },

    refreshPicBtnOnClick() {
      this.loadScreenshots()
        .then(() => {
          // 清除选择的图片，恢复显示默认基准图
          this.$refs.imgSlider.clearSelection()
          this.selectedBenchmarkPic = ''
        })
    },
  },
}
</script>

<style lang="scss">
.benchmark-pic-view {
  padding: 20px;

  .display-box {
    .box-header {
      padding-bottom: 10px;
    }

    .camera-video-area,
    .preview-pic {
      width: 400px;
      height: 300px;
    }

    .camera-video {
      width: 100%;
      height: 100%;
    }
  }

  .slider-box {
    max-width: 800px;
    margin: 20px 0;

    .tip-area {
      line-height: 40px;

      > span {
        padding-right: 10px;
      }
    }
  }

  .button-bar {
    text-align: center;
  }
}

</style>
