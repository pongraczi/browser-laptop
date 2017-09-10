/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// State
const frameStateUtil = require('../../../../js/state/frameStateUtil')

// Constants
const {tabs} = require('../../../../js/constants/config')

module.exports.isPartitionTab = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    return false
  }

  return frame.get('partitionNumber')
}

module.exports.getPartitionNumber = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    console.error('Unable to find frame for getPartitionNumber method')
    return 0
  }

  if (typeof frame.get('partitionNumber') === 'string') {
    return frame.get('partitionNumber').replace(/^partition-/i, '')
  }
  return frame.get('partitionNumber')
}

module.exports.getMaxAllowedPartitionNumber = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    console.error('Unable to find frame for getMaxAllowedPartitionNumber method')
    return 0
  }

  const partitionNumber = module.exports.getPartitionNumber(state, frameKey)

  if (partitionNumber > tabs.maxAllowedNewSessions) {
    return tabs.maxAllowedNewSessions
  }
  return partitionNumber
}
