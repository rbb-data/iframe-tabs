import React from 'react'
import PropTypes from 'prop-types'
import styles from './TabBar.module.sass'

/**
 * Renders selectable Tabs next to each other
 */
const TabBar = props => {
  const {
    id,
    tabs,
    title,
    selectedTab,
    format,
    color,
    onChange,
    className,
    disabled
  } = props

  return (
    <div className={`${styles.radioFilter} ${className}`}>
      <ul title={title}>
        {tabs.map((tab, i) => (
          <li
            className={`${tab === selectedTab ? styles.active : ''} ${disabled(tab) ? styles.disabled : ''}`}
            key={`${id}-${i}`}
          >
            <input
              id={`${id}-${i}`}
              type='radio'
              name={id}
              value={i}
              checked={tab === selectedTab}
              onChange={() => onChange(tab)}
              disabled={disabled(tab)}
            />

            <label htmlFor={`${id}-${i}`}>
              <span
                className={styles.slant}
                style={{ backgroundColor: color(tab) }}
              />
              {format(tab)}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

TabBar.propTypes = {
  /** needs to be uniqe in the document */
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  /** An array of objects like this: { value: 0, display: 'tab1' } */
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.any.isRequired,
  /** takes the tab value and should return its label
   *  (anything that can be renderd by react)
   */
  format: PropTypes.func,
  /** takes the tab value and should return its background color */
  color: PropTypes.func,
  /** select handler */
  onChange: PropTypes.func,
  disabled: PropTypes.func
}

TabBar.defaultProps = {
  onChange: () => {},
  format: value => value,
  color: () => null,
  className: '',
  disabled: () => false
}

export default TabBar
