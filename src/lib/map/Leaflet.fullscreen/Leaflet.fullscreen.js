import Leaflet from 'leaflet'
import screenfull from 'screenfull'

const L = Leaflet

if (typeof L === 'undefined') {
  throw new Error('Leaflet must be loaded first')
}

L.Control.Fullscreen = L.Control.extend({
  options: {
    position: 'bottomright',
    title: {
      'false': '全屏查看',
      'true': '退出全屏',
    },
  },

  onAdd: function(map) {
    const container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control')

    this.link = L.DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container)
    this.link.href = '#'

    this._map = map
    this._map.on('fullscreenchange', this._toggleTitle, this)
    this._toggleTitle()

    L.DomEvent.on(this.link, 'click', this._click, this)

    _initFullscreenCommonEvent.call(this._map)
    return container
  },

  _click: function(e) {
    L.DomEvent.stopPropagation(e)
    L.DomEvent.preventDefault(e)
    this._map.toggleFullscreen(this.options)
  },

  _toggleTitle: function() {
    this.link.title = this.options.title[this._map.isFullscreen()]
  },
})

L.Map.include({
  isFullscreen: function() {
    return this._isFullscreen || false
  },

  toggleFullscreen: function(options) {
    if (options && options.pseudoFullscreen) {
      const container = this.getContainer()
      return this.isFullscreen()
        ? this._disablePseudoFullscreen(container)
        : this._enablePseudoFullscreen(container)
    }
    return screenfull.toggle()
  },

  _enablePseudoFullscreen: function(container) {
    L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen')
    this._setFullscreen(true)
    this.fire('fullscreenchange')
  },

  _disablePseudoFullscreen: function(container) {
    L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen')
    this._setFullscreen(false)
    this.fire('fullscreenchange')
  },

  _setFullscreen: function(fullscreen) {
    this._isFullscreen = fullscreen
    const container = this.getContainer()
    if (fullscreen) {
      L.DomUtil.addClass(container, 'leaflet-fullscreen-on')
    } else {
      L.DomUtil.removeClass(container, 'leaflet-fullscreen-on')
    }
    this.invalidateSize()
  },

  _onFullscreenChange: function(e) {
    this._setFullscreen(screenfull.isFullscreen)
    this.fire('fullscreenchange')
  },
})

L.Map.mergeOptions({
  fullscreenControl: false,
})

L.Map.addInitHook(function() {
  if (this.options.fullscreenControl) {
    this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl)
    this.addControl(this.fullscreenControl)
  }
})

function _initFullscreenCommonEvent() {
  if (this._fullscreenCommonEventInitCalled) {
    return
  }
  this._fullscreenCommonEventInitCalled = true

  const onFullscreenChange = L.bind(this._onFullscreenChange, this)

  this.whenReady(function() {
    if (screenfull.enabled) {
      screenfull.onchange(onFullscreenChange)
    }
  })

  this.on('unload', function() {
    if (screenfull.enabled) {
      screenfull.off('change', onFullscreenChange)
    }
  })
}

L.control.fullscreen = function(options) {
  return new L.Control.Fullscreen(options)
}

export default L.Control.Fullscreen
