import React from 'react'
import PropTypes from 'prop-types'
import _ from './RangeSlider.module.sass'

/**
 * Renders a numerical slider
 */
const RangeSlider = props => {
  const {
    id,
    items,
    selectedItem,
    getValue,
    format,
    onChange,
    className
  } = props

  const values = items.map(getValue).sort()
  const step = values[1] - values[0]

  if (!values.every((value) => value % step === 0)) return <p className={_.help}>
    Damit der Range Slider funktioniert müssen die Tab-Title eine Zahlenfolge bilden,
    bei der zwei aufeinander folgende Zahlen immer den gleichen Abstand zueinander haben,
    z.B. 2000/2010/2020/2030 mit jeweils 10 Jahren Abstand.
  </p>

  const findItem = (value) => items.find(item => getValue(item) == value);

  return (
    <div className={className}>
      <input
        id={id}
        type="range"
        min={values[0]}
        max={values[values.length - 1]}
        step={step}
        value={getValue(selectedItem)}
        onChange={(e) => onChange(findItem(e.target.value))}
      />
      {format(selectedItem)}
    </div>
  )
}

RangeSlider.propTypes = {
  /** needs to be unique in the document */
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  /** An array of objects or values */
  items: PropTypes.array.isRequired,
  selectedItem: PropTypes.any.isRequired,
  /** takes the tab value and should return its label
   *  (anything that can be rendered by react)
   */
  /** takes a tab and returns the value used for the slider */
  getValue: PropTypes.func,
  format: PropTypes.func,
  /** select handler */
  onChange: PropTypes.func
}

RangeSlider.defaultProps = {
  onChange: () => {},
  format: value => value,
  getValue: value => +value,
  className: ''
}

export default RangeSlider
