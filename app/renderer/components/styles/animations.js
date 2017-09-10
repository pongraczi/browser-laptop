/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const spinKeyframes = {
  'from': {
    transform: 'rotate(0deg)'
  },
  'to': {
    transform: 'rotate(360deg)'
  }
}

const opacityKeyrames = (start, end) => ({
  'from': {
    opacity: start
  },
  'to': {
    opacity: end
  }
})

const widthChangeKeyframes = (start, end) => ({
  'from': {
    width: start
  },
  'to': {
    width: end
  }
})

module.exports = {
  spinKeyframes,
  opacityKeyrames,
  widthChangeKeyframes
}
