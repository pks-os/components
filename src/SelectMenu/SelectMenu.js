import React, {useRef, useState, useCallback, useEffect} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import sx from '../sx'
import {COMMON} from '../constants'
import theme from '../theme'
import {MenuContext} from './SelectMenuContext'
import SelectMenuDivider from './SelectMenuDivider'
import SelectMenuFilter from './SelectMenuFilter'
import SelectMenuFooter from './SelectMenuFooter'
import SelectMenuItem from './SelectMenuItem'
import SelectMenuList from './SelectMenuList'
import SelectMenuModal from './SelectMenuModal'
import SelectMenuTabs from './SelectMenuTabs'
import SelectMenuHeader from './SelectMenuHeader'
import SelectMenuTab from './SelectMenuTab'
import SelectMenuTabPanel from './SelectMenuTabPanel'
import SelectMenuLoadingAnimation from './SelectMenuLoadingAnimation'
import useKeyboardNav from './hooks/useKeyboardNav'

const wrapperStyles = `
  // Remove marker added by the display: list-item browser default
  > summary {
    list-style: none;
  }
  // Remove marker added by details polyfill
  > summary::before {
    display: none;
  }
  // Remove marker added by Chrome
  > summary::-webkit-details-marker {
    display: none;
  }
`

const StyledSelectMenu = styled.details`
  ${wrapperStyles}
  ${COMMON}
  ${sx};
`

// 'as' is spread out because we don't want users to be able to change the tag.
const SelectMenu = React.forwardRef(({children, initialTab, as, ...rest}, forwardedRef) => {
  const backupRef = useRef()
  const ref = forwardedRef ?? backupRef
  const [selectedTab, setSelectedTab] = useState(initialTab)
  const [open, setOpen] = useState(false)
  const menuProviderValues = {
    selectedTab,
    setSelectedTab,
    setOpen,
    open,
    initialTab
  }

  const onClickOutside = useCallback(
    event => {
      if (ref.current && !ref.current.contains(event.target)) {
        if (!event.defaultPrevented) {
          setOpen(false)
        }
      }
    },
    [ref, setOpen]
  )

  // handles the overlay behavior - closing the menu when clicking outside of it
  useEffect(() => {
    if (open) {
      document.addEventListener('click', onClickOutside)
      return () => {
        document.removeEventListener('click', onClickOutside)
      }
    }
  }, [open, onClickOutside])

  function toggle(event) {
    setOpen(event.target.open)
  }

  useKeyboardNav(ref, open, setOpen)

  return (
    <MenuContext.Provider value={menuProviderValues}>
      <StyledSelectMenu ref={ref} {...rest} open={open} onToggle={toggle}>
        {children}
      </StyledSelectMenu>
    </MenuContext.Provider>
  )
})

SelectMenu.displayName = 'SelectMenu'
SelectMenu.MenuContext = MenuContext
SelectMenu.List = SelectMenuList
SelectMenu.Divider = SelectMenuDivider
SelectMenu.Filter = SelectMenuFilter
SelectMenu.Footer = SelectMenuFooter
SelectMenu.Item = SelectMenuItem
SelectMenu.List = SelectMenuList
SelectMenu.Modal = SelectMenuModal
SelectMenu.Tabs = SelectMenuTabs
SelectMenu.Tab = SelectMenuTab
SelectMenu.TabPanel = SelectMenuTabPanel
SelectMenu.Header = SelectMenuHeader
SelectMenu.LoadingAnimation = SelectMenuLoadingAnimation

SelectMenu.defaultProps = {
  theme
}

SelectMenu.propTypes = {
  initialTab: PropTypes.string,
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default SelectMenu
