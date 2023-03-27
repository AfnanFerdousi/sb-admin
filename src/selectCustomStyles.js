import { gray, primary_orange } from './colors'
/* eslint-disable */

export const selectCustomStyles = {
  control: (provided, { isFocused }) => ({
    ...provided,
    borderRadius: '5px',
    height: '50px',
    // padding: 4,
    // paddingTop: '-8px',
    // paddingBottom: '-8px',
    marginTop: 'auto',
    marginBottom: 'auto',
    display: 'flex',
    color: '#374253',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    border: isFocused ? '1px solid #ff8b67' : '1px solid #e3e1e1',
    outline: isFocused ? '1px solid #ff8b67' : '',
    '&:hover': {
      border: isFocused ? '1px solid #ff8b67' : '',
      outline: isFocused ? '1px solid #ff8b67' : '',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 0,
  }),
  option: (provided, { data, isDisabled, isFocused, isSelected }) => ({
    ...provided,
    // height: '50px',
    backgroundColor: isFocused ? 'rgba(242, 97, 51, 0.15)' : undefined,
    color: isFocused ? primary_orange : gray,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: gray,
    // height: '50px',
  }),
  valueContainer: (provided, state) => ({
    ...provided,
  }),

  input: (provided, state) => ({
    ...provided,
    // height: '50px',
  }),
  indicatorSeparator: (state) => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    // height: '50px',
  }),
}
