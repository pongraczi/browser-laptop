/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const {StyleSheet, css} = require('aphrodite/no-important')

// Components
const ReduxComponent = require('../../reduxComponent')

// State
const titleState = require('../../../../common/state/tabContentState/titleState')
const frameStateUtil = require('../../../../../js/state/frameStateUtil')
const tabUIState = require('../../../../common/state/tabUIState')
const tabState = require('../../../../common/state/tabState')

// Utils
const {isWindows, isDarwin} = require('../../../../common/lib/platformUtil')

// Styles
const {fontSize} = require('../../styles/global')

class TabTitle extends React.Component {
  mergeProps (state, ownProps) {
    const currentWindow = state.get('currentWindow')
    const frameKey = ownProps.frameKey
    const tabId = frameStateUtil.getTabIdByFrameKey(currentWindow, frameKey)

    const props = {}
    props.isWindows = isWindows()
    props.isDarwin = isDarwin()
    props.isPinned = tabState.isTabPinned(state, tabId)
    props.showTabTitle = titleState.showTabTitle(currentWindow, frameKey)
    props.displayTitle = titleState.getDisplayTitle(currentWindow, frameKey)
    props.showReducedTabTitle = titleState.reduceTitleWidth(currentWindow, frameKey)
    props.addExtraGutter = tabUIState.addExtraGutterToTitle(currentWindow, frameKey)
    props.isTextWhite = tabUIState.checkIfTextColorBlackOrWhite(currentWindow, frameKey, 'white')
    return props
  }

  render () {
    if (this.props.isPinned || !this.props.showTabTitle) {
      return null
    }

    return <div data-test-id='tabTitle'
      className={css(
        styles.tab__title,
        this.props.addExtraGutter && styles.tab__title_extraGutter,
        this.props.showReducedTabTitle && styles.tab__title_reducedSize,
        (this.props.isDarwin && this.props.isTextWhite) && styles.tab__title_bold,
        // Windows specific style
        this.props.isWindows && styles.tab__title_windows
      )}>
      {this.props.displayTitle}
    </div>
  }
}

module.exports = ReduxComponent.connect(TabTitle)

const styles = StyleSheet.create({
  tab__title: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: 1,
    userSelect: 'none',
    fontSize: fontSize.tabTitle,
    lineHeight: '1.6',
    minWidth: 0 // see https://stackoverflow.com/a/36247448/4902448
  },

  tab__title_reducedSize: {
    overflow: 'hidden',
    marginRight: '24px'
  },

  tab__title_bold: {
    fontWeight: '400'
  },

  tab__title_windows: {
    fontWeight: '500',
    fontSize: fontSize.tabTitle
  },

  tab__title_extraGutter: {
    margin: '0 6px'
  }
})
