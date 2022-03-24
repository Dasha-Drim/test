import { Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import {useState, useEffect} from "react";

import './Input.scss';



function ControllerInput(props){
  const [value, setValue] = useState("");

  useEffect(() => {
    if(value.length == 0) props.clearErrors(props.name+"-m");
    (props.value) && setValue(props.value)
  }, [])

	let error = ( props.errors !== undefined && (props.errors[props.name] || props.errors[props.name+'-m']) ) ? 'no-valid' : '';
  return(
    <div className={`Input ${error}`}>
      <label htmlFor={props.name}>{props.label}</label>
      <InputMask
        defaultValue={value}
        mask={props.mask}
        name={props.name}
        onChange={(e) => {
          setValue(String(e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;: '",.<>\{\}\[\]\\\/]/gi, '')));
          props.clearErrors(props.name+"-m");
          if(props.onChangeFun) props.onChangeFun();
        }}
        onBlur={(e) => {
          console.log("value", value);
          setValue(String(e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')));
          if (value.length < props.maskLength) props.setError(props.name+"-m", { shouldFocus: true });
          else props.clearErrors(props.name+"-m");
        }}
        ref={props.refy}
      />
    </div>
  )
}

export default ControllerInput;