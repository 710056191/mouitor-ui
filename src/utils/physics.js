/**
 * 获取 element 在 bound 中不超出的位置
 * @param elementRect
 * @param boundingRect
 * @param left
 * @param top
 * @param [boundingRectMargin]
 * @return {{top: number, left: number}}
 */
export function getPosWithBoundaries(elementRect, boundingRect, left, top, boundingRectMargin) {
  if (boundingRectMargin === void 0) {
    boundingRectMargin = {}
  }
  const adjustedPos = { left: left, top: top }
  const height = elementRect.height
  const width = elementRect.width
  const topRect = top
  const bottomRect = top + height
  const leftRect = left
  const rightRect = left + width
  const marginTop = boundingRectMargin.top || 0
  const marginBottom = boundingRectMargin.bottom || 0
  const marginLeft = boundingRectMargin.left || 0
  const marginRight = boundingRectMargin.right || 0
  const topBoundary = boundingRect.top + marginTop
  const bottomBoundary = boundingRect.bottom - marginBottom
  const leftBoundary = boundingRect.left + marginLeft
  const rightBoundary = boundingRect.right - marginRight
  if (topRect < topBoundary) {
    adjustedPos.top = topBoundary
  } else if (bottomRect > bottomBoundary) {
    adjustedPos.top = bottomBoundary - height
  }
  if (leftRect < leftBoundary) {
    adjustedPos.left = leftBoundary
  } else if (rightRect > rightBoundary) {
    adjustedPos.left = rightBoundary - width
  }
  return adjustedPos
}
