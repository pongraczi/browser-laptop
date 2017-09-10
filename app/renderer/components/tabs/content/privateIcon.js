/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const {StyleSheet, css} = require('aphrodite/no-important')

// Components
const ReduxComponent = require('../../reduxComponent')
const TabIcon = require('./tabIcon')

// State
const frameStateUtil = require('../../../../../js/state/frameStateUtil')
const tabUIState = require('../../../../common/state/tabUIState')
const tabState = require('../../../../common/state/tabState')

// Styles
const {theme} = require('../../styles/theme')
const privateSvg = require('../../../../extensions/brave/img/tabs/private.svg')

class PrivateIcon extends React.Component {
  mergeProps (state, ownProps) {
    const currentWindow = state.get('currentWindow')
    const frameKey = ownProps.frameKey
    const tabId = frameStateUtil.getTabIdByFrameKey(currentWindow, frameKey)

    const props = {}
    props.isPinned = tabState.isTabPinned(state, tabId)
    props.isActive = frameStateUtil.isFrameKeyActive(currentWindow, frameKey)
    props.showPrivateIcon = tabUIState.showTabEndIcon(currentWindow, frameKey)

    return props
  }

  render () {
    if (this.props.isPinned || !this.props.showPrivateIcon) {
      return null
    }

    const privateProps = StyleSheet.create({
      private__icon_color: {
        backgroundColor: this.props.isActive
          ? theme.tab.content.icon.private.background.active
          : theme.tab.content.icon.private.background.notActive
      }
    })

    return <TabIcon
      data-test-id='privateIcon'
      className={css(styles.private__icon, privateProps.private__icon_color)}
    />
  }
}

module.exports = ReduxComponent.connect(PrivateIcon)

const styles = StyleSheet.create({
  private__icon: {
    boxSizing: 'border-box',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskImage: `url(${privateSvg})`,
    WebkitMaskSize: '15px',
    width: '100%',
    height: '100%'
  }
})
