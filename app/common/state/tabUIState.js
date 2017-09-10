/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Constants
const settings = require('../../../js/constants/settings')

// state
const frameStateUtil = require('../../../js/state/frameStateUtil')
const privateState = require('../../common/state/tabContentState/privateState')
const tabCloseState = require('../../common/state/tabContentState/tabCloseState')
const partitionState = require('../../common/state/tabContentState/partitionState')

// Utis
const {getTextColorForBackground} = require('../../../js/lib/color')
const {isEntryIntersected} = require('../../../app/renderer/lib/observerUtil')

// settings
const {getSetting} = require('../../../js/settings')

// Styles
const {intersection} = require('../../renderer/components/styles/global')
const {theme} = require('../../renderer/components/styles/theme')

module.exports.getThemeColor = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for getThemeColor method')
    }
    return false
  }

  return (
    getSetting(settings.PAINT_TABS) &&
    (frame.get('themeColor') || frame.get('computedThemeColor'))
  )
}

module.exports.getTabIconColor = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for getTabIconColor method')
    }
    return ''
  }

  const isActive = frameStateUtil.isFrameKeyActive(state, frameKey)
  const hoverState = frameStateUtil.getTabHoverState(state, frameKey)
  const themeColor = frame.get('themeColor') || frame.get('computedThemeColor')
  const activeNonPrivateTab = !frame.get('isPrivate') && isActive
  const isPrivateTab = frame.get('isPrivate') && (isActive || hoverState)
  const defaultColor = isPrivateTab ? 'white' : 'black'
  const isPaintTabs = getSetting(settings.PAINT_TABS)

  return activeNonPrivateTab && isPaintTabs && !!themeColor
    ? getTextColorForBackground(themeColor)
    : defaultColor
}

module.exports.checkIfTextColorBlackOrWhite = (state, frameKey, color) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for checkIfTextColorBlackOrWhite method')
    }
    return false
  }

  return module.exports.getTabIconColor(state, frameKey) === color
}

module.exports.showTabEndIcon = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for showTabEndIcon method')
    }
    return false
  }

  const isPrivate = privateState.isPrivateTab(state, frameKey)
  const isPartition = partitionState.isPartitionTab(state, frameKey)

  return (
    (isPrivate || isPartition) &&
    !tabCloseState.hasFixedCloseIcon(state, frameKey) &&
    !tabCloseState.hasRelativeCloseIcon(state, frameKey) &&
    !isEntryIntersected(state, 'tabs', intersection.at35)
  )
}

module.exports.centerTabIdentity = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for centerTabIdentity method')
    }
    return false
  }

  return (
    isEntryIntersected(state, 'tabs', intersection.at35) &&
    !frameStateUtil.isFrameKeyActive(state, frameKey)
  )
}

module.exports.centerEndIcons = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for centerEndIcons method')
    }
    return false
  }

  return (
    isEntryIntersected(state, 'tabs', intersection.at35) &&
    frameStateUtil.isFrameKeyActive(state, frameKey)
  )
}

module.exports.addExtraGutterToTitle = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for addExtraGutterToTitle method')
    }
    return false
  }

  return frame.get('location') === 'about:newtab'
}

module.exports.centralizeTabIcons = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for centralizeTabIcons method')
    }
    return false
  }

  return isEntryIntersected(state, 'tabs', intersection.at15)
}

module.exports.getTabEndIconBackgroundColor = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to find frame for getTabEndIconColor method')
    }
    return false
  }

  const isPrivateTab = privateState.isPrivateTab(state, frameKey)
  const themeColor = module.exports.getThemeColor(state, frameKey)
  const isActive = frameStateUtil.isFrameKeyActive(state, frameKey)
  const isSessionTab = partitionState.isPartitionTab(state, frameKey)
  const isIntersecting = isEntryIntersected(state, 'tabs', intersection.at35)

  let backgroundColor = theme.tab.background

  if (isActive && themeColor) {
    backgroundColor = themeColor
  }
  if (isActive && !themeColor) {
    backgroundColor = theme.tab.active.background
  }
  if (isIntersecting || isSessionTab || isPrivateTab) {
    backgroundColor = 'transparent'
  }

  return backgroundColor
}
