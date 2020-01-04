<script type="text/jsx">
import { getInstance } from '@/views/map/utils/bigemap-helper'
import { loadBoundaryData } from '@/utils/load-boundary-data'
// import BM from 'BM'
import { coordsToLatLngWithTransform } from '@/utils/map'
import { WGS84, BD09 } from 'gcoord'

const selectorConfList = [
  { name: '省份/直辖市/自治区', key: 'province' },
  { name: '城市', key: 'city' },
  { name: '区县', key: 'area' },
  { name: '乡镇/街道', key: 'town' },
]

const coordsToLatLng = (coords) => {
  return coordsToLatLngWithTransform(coords, WGS84, BD09)
}

export default {
  name: 'PanelZone',

  data() {
    return {
      selectorConfList,

      // 区划 selector 的 列表
      // item eg:
      //    {label: '省份', value: null, options: []}
      /** @type {Array} */
      selectorList: [],

      // provinces: [
      //   { 'code': '11', 'name': '北京市' },
      // ],
      overlay: {},

      boundaryCaches: new Map(),
      inUseBoundary: null,
    }
  },

  computed: {},

  mounted() {
    this.initZone()
  },

  methods: {
    async initZone() {
      const rootZone = await this.loadZoneData()
      const { selectorConfList } = this
      this.selectorList = [{
        label: selectorConfList[0].name,
        labelKey: selectorConfList[0].key,
        options: rootZone,
        value: null,
      }]
      this.refreshSelect(null, this.selectorList[0])
    },

    async loadZoneData() {
      const { default: pcasC } = await import(/* webpackChunkName: "china-division-pcas-code" */'china-division/dist/pcas-code.json')
      return pcasC
    },

    /**
     * @param {Object} value - 变化的值，此处为 selector 的 options 某一项
     * @param {Object} selector - 发生变化的 selector
     */
    handleSelectChange(value, selector) {
      this.refreshSelect(value, selector)
      console.log('handleSelectChange', value, selector)

      this.resetBoundary()
    },

    refreshSelect(value, selector) {
      // 从 conf list 生成 selector 数组

      const { selectorConfList, selectorList } = this
      const selectorIdx = selectorList.indexOf(selector)
      const selectorCount = selectorConfList.length
      const nextSelector = value

      let nextSelectorIdx = selectorIdx

      if (nextSelector && nextSelector.children && nextSelector.children.length) {
        ++nextSelectorIdx
        this.$set(selectorList, nextSelectorIdx, {
          label: selectorConfList[nextSelectorIdx].name,
          labelKey: selectorConfList[nextSelectorIdx].key,
          options: nextSelector.children,
          value: null,
        })
      }

      for (let i = ++nextSelectorIdx; i < selectorCount; i++) {
        this.$set(selectorList, i, {})
      }

      // // 将后续的 selector 清除选择状态
      // if (selectorIdx + 2 < selectorCount) {
      //   selectorList.splice(selectorIdx + 2, selectorCount - (selectorIdx + 2) + 1)
      // }
    },

    getSelectedAddress() {
      const selectorList = this.selectorList

      const addressList = []
      const codeList = []
      for (const { value, labelKey } of selectorList) {
        if (value) {
          addressList.push({ code: value.code, name: value.name, key: labelKey })
          codeList.push(value.code)
        } else {
          break
        }
      }
      // return addressList
      return {
        code: codeList.join('-'),
        list: addressList,
      }
    },

    resetBoundary() {
      const address = this.getSelectedAddress()
      const boundaryCaches = this.boundaryCaches

      const layerKey = address.code

      if (boundaryCaches.has(layerKey)) {
        this.switchBoundary(boundaryCaches.get(layerKey))
        return
      }

      loadBoundaryData(address).then(geojsonFeature => {
        const layer = window.L.geoJSON(geojsonFeature, { coordsToLatLng })
        boundaryCaches.set(layerKey, layer)

        this.switchBoundary(layer)
      }).catch(e => {
        if (e && e.resultCode === 0) {
          // 接口正常响应，只是 该行政区域kml文件不存在
          this.switchBoundary() // 清空原有的边界图层
          return
        }
        console.warn(e)
      })
    },

    switchBoundary(layer = null) {
      if (this.inUseBoundary) {
        this.inUseBoundary.remove()
      }
      if (!layer) {
        return
      }
      const map = getInstance()
      layer.addTo(map)
      map.fitBounds(layer.getBounds())
      this.inUseBoundary = layer
    },
  },

  render(h) {
    // 从 selectorList 生成 select 组件

    const { selectorList = [] } = this

    const selectorNodes = selectorList.map((selector) => {
      const { label = '', options } = selector

      const onInput = (value) => {
        selector.value = value
      }

      const onChange = (value) => {
        return this.handleSelectChange(value, selector)
      }

      return (
        <el-select
          value={selector.value}
          onInput={onInput}
          valueKey="code"
          class="zone-select"
          size="small"
          filterable={true}
          placeholder={label}
          onChange={onChange}
        >
          {
            options && options.map((region) => {
              return <el-option
                key={region.code}
                label={region.name}
                value={region}
              />
            })
          }
        </el-select>
      )
    })

    return (
      <div class="panel-zone">
        {selectorNodes}
      </div>
    )
  }
  ,
}
</script>

<style lang="scss">
.panel-zone {
  max-width: 420px; // TODO: 改成用 css 布局

  .zone-select {
    width: 200px;
    display: inline-block;

    .el-input__inner {
      /*height: 30px;*/
      /*line-height: 30px;*/
    }
  }
}
</style>
