import {useState, useEffect} from 'react';
import SelectPlugin from 'react-select';

import './Select.scss';



function Select(props){
  const [value, setReactSelect] = useState(props.value);

  useEffect(() => {
    props.setValue(props.name, props.value);
    setReactSelect(props.value);
  }, [props.value])

  const handleMultiChange = (selectedOption) => {
    props.setValue(props.name, selectedOption);
    setReactSelect(selectedOption); 
  };

  return(
    <div className="Select">
      <label for={props.name}>{props.label}</label>
      <SelectPlugin
        value={value}
        options={props.options}
        onChange={handleMultiChange}
        id={props.name}
        name={props.name}
        isSearchable={false}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  )
}

export default Select;