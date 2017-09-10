/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const Immutable = require('immutable')
const ReduxComponent = require('../../reduxComponent')

const {StyleSheet, css} = require('aphrodite/no-important')
const globalStyles = require('../../styles/global')

const frameStateUtil = require('../../../../../js/state/frameStateUtil')
const tabUIState = require('../../../../common/state/tabUIState')
const tabState = require('../../../../common/state/tabState')

class TabEndContainer extends React.Component {
  mergeProps (state, ownProps) {
    const currentWindow = state.get('currentWindow')
    const frame = frameStateUtil.getFrameByKey(currentWindow, ownProps.frameKey) || Immutable.Map()
    const frameKey = ownProps.frameKey
    const tabId = frame.get('tabId', tabState.TAB_ID_NONE)

    const props = {}
    props.children = ownProps.children
    props.isPinnedTab = tabState.isTabPinned(state, tabId)
    props.isHover = frameStateUtil.getTabHoverState(currentWindow, frameKey)
    props.centerEndIcons = tabUIState.centerEndIcons(currentWindow, frameKey)
    props.showTabEndIcon = tabUIState.showTabEndIcon(currentWindow, frameKey)
    props.backgroundColor = tabUIState.getTabEndIconBackgroundColor(currentWindow, frameKey)

    return props
  }

  render () {
    const perPageStyles = StyleSheet.create({
      tab__endIcons_color: {
        backgroundImage: `linear-gradient(to left, ${this.props.backgroundColor} 10%, transparent 90%)`
      },

      ':hover': {
        backgroundImage: 'none'
      }
    })

    return (
      <div className={css(
        styles.tab__endIcons,
        !this.props.isPinnedTab && styles.tab__endIcons_color,
        !this.props.isPinnedTab && perPageStyles.tab__endIcons_color,
        !this.props.isPinnedTab && this.props.isHover && styles.tab__endIcons_color_hover,
        this.props.centerEndIcons && styles.tab__endIcons_centered
      )}>
        {this.props.children}
      </div>
    )
  }
}

const styles = StyleSheet.create({
  tab__endIcons: {
    boxSizing: 'border-box',
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    padding: globalStyles.spacing.defaultTabPadding,
    zIndex: globalStyles.zindex.zindexTabs,
    backgroundRepeat: 'no-repeat'
  },

  // if tab is being hovered,
  // do not show the endIcons gradient
  tab__endIcons_color_hover: {
    backgroundImage: 'none'
  },

  tab__endIcons_centered: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    margin: 'auto',
    width: '100%',
    height: '100%'
  }
})

module.exports = ReduxComponent.connect(TabEndContainer)
