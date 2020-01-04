import LPolylineMeasure from 'leaflet.polylinemeasure'
import Leaflet from 'leaflet'

const newOptions = {
  tooltipTextDraganddelete: `点击并拖动可<b>移动点</b><br>按住 Shift 键，同时单击<b>删除点</b>`,
  tooltipTextResume: `<br>按住 Ctrl 键同时单击<b>可继续连线</b>`,
  tooltipTextAdd: `按住 Ctrl 键同时单击<b>添加点</b>`,

  measureControlTitleOn: '打开测距',
  measureControlTitleOff: '关闭测距',
  clearControlTitle: '清除',
}

const newUnitControlLabel = {
  metres: '米',
  kilometres: '公里',
  feet: '英尺',
  landmiles: '英里',
  nauticalmiles: '海里',
}
class PolylineMeasure extends LPolylineMeasure {
  constructor(...args) {
    let argOptions = args[0] || {}
    argOptions = {
      ...newOptions,
      ...argOptions,
      unitControlLabel: {
        ...newUnitControlLabel,
        ...argOptions.unitControlLabel || {},
      },
    }
    args[0] = argOptions

    super(...args)
  }

  onAdd(...args) {
    const returnVal = super.onAdd(...args)
    this._container.classList.add('bigemap-bar')
    return returnVal
  }
}

Leaflet.Control.PolylineMeasure = PolylineMeasure

export default PolylineMeasure
