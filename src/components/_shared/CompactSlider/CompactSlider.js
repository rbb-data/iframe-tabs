import React from 'react'
import PropTypes from 'prop-types'
import _ from './CompactSlider.module.sass'

/**
 * Renders selectable Tabs next to each other
 */
const CompactSlider = props => {
  const {
    id,
    tabs,
    selectedTab,
    getValue,
    format,
    onChange,
    className
  } = props

  const values = tabs.map(getValue).sort()
  const step = values[1] - values[0]

  if (!values.every((value) => value % step === 0)) return <p className={_.help}>
    Damit der Range Slider funktioniert müssen die Tab-Title eine Zahlenfolge bilden,
    bei der zwei aufeinander folgende Zahlen immer den gleichen Abstand zueinander haben,
    z.B. 2000/2010/2020/2030 mit jeweils 10 Jahren Abstand.
  </p>

  const findTab = (value) => tabs.find(tab => getValue(tab) == value);

  return (
    <div className={className}>
      <input
        id={id}
        type="range"
        min={values[0]}
        max={values[values.length - 1]}
        step={step}
        value={getValue(selectedTab)}
        onChange={(e) => onChange(findTab(e.target.value))}
      />
      {format(selectedTab)}
    </div>
  )
}

CompactSlider.propTypes = {
  /** needs to be uniqe in the document */
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  /** An array of objects like this: { value: 0, display: 'tab1' } */
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.any.isRequired,
  /** takes the tab value and should return its label
   *  (anything that can be renderd by react)
   */
  /** takes a tab and returns the value used for the slider */
  getValue: PropTypes.func,
  format: PropTypes.func,
  /** select handler */
  onChange: PropTypes.func
}

CompactSlider.defaultProps = {
  onChange: () => {},
  format: value => value,
  getValue: value => +value,
  className: ''
}

export default CompactSlider
