// import L from 'L'
import { transform } from 'gcoord'

// @function coordsToLatLng(coords: Array): LatLng
// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
/**
 * coordsToLatLngWithTransform
 *
 * reates a `LatLng` object from an array of 2 numbers (longitude, latitude)
 * or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
 * @param {GeoJSON | Position | string} coords
 * @param {string} crsFrom
 * @param {string} crsTo
 * @return {L.LatLng}
 */
export function coordsToLatLngWithTransform(coords, crsFrom, crsTo) {
  coords = transform(coords, crsFrom, crsTo)
  return new window.L.LatLng(coords[1], coords[0], coords[2])
}

export function createPolylineMeasure(map, options = {}) {
  return window.L.control.polylineMeasure({
    position: 'topleft',
    unit: 'kilometres',
    showBearings: false,
    clearMeasurementsOnStop: false,
    showClearControl: true,
    showUnitControl: false,
    ...options,
  }).addTo(map)
}
