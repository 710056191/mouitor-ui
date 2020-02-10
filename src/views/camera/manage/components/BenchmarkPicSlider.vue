<template>
  <div class="benchmark-pic-slider">
    <div class="glider-contain">
      <div ref="glider" class="glider">
        <div class="slider-img-track">
          <el-image
            v-for="img in images"
            :key="img"
            :src="img"
            :class="['slider-img-item', {selected: img === selectedImg}]"
            fit="contain"
            @click.native="handleImageClick(img)"
          />
        </div>
      </div>

      <button role="button" aria-label="Previous" class="glider-prev">«</button>
      <button role="button" aria-label="Next" class="glider-next">»</button>
    </div>
  </div>
</template>

<script>
import Glider from 'glider-js'
import 'glider-js/glider.css'

export default {
  name: 'BenchmarkPicSlider',

  props: {
    images: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      destroyed: false,

      slider: null,

      selectedImg: null,
    }
  },

  watch: {
    images() {
      this.clearSelection()
    },
  },

  methods: {
    refresh() {
      this.$nextTick(() => {
        if (this.destroyed) {
          return
        }

        if (!this.slider) {
          this.initSlider()
        }
        this.slider.refresh()
      })
    },

    initSlider() {
      if (this.slider) {
        return
      }

      const slider = this.$refs['glider']
      this.slider = new Glider(slider, {
        itemWidth: 160,
        slidesToShow: 'auto',
        slidesToScroll: 'auto',
        draggable: true,
        dragVelocity: 1.5,
        skipTrack: true,
        arrows: {
          prev: '.glider-prev',
          next: '.glider-next',
        },
      })

      this.$once('hook:beforeDestroy', () => {
        this.slider.destroy()
        this.slider = null
        this.destroyed = true
      })
    },

    handleImageClick(img) {
      if (!img) {
        return
      }
      this.selectedImg = img
      this.emitImageClick(img)
    },

    emitImageClick(data) {
      this.$emit('image-click', data)
    },

    clearSelection() {
      this.selectedImg = null
    },
  },
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";

.benchmark-pic-slider {
  padding: 10px 30px;

  .glider-contain {

  }

  .slider-img-track {
    height: 100px;
    padding: 0 10px;
  }

  .slider-img-item + .slider-img-item {
    margin-left: 20px;
  }

  .slider-img-item.selected {
    border: 2px solid $page-color-text-primary;
  }
}
</style>
