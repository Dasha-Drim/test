import { useState, useEffect } from 'react';
import './Input.scss';

function Input(props){
	let error = ( props.errors !== undefined && props.errors[props.name] ) ? 'no-valid' : '';
	let [value, setValue] = useState("");
	useEffect(() => {
		setValue(props.value);
	}, [props.value])
	
	let onChangeHandler = (e) => {
		setValue(e.value);
		if(props.onChange) props.onChange();
	}
	return(
		<div className={`Input ${error}`}>
			<label htmlFor={props.name}>{props.label}</label>
			<input id={props.name} ref={props.refy} type={props.type} name={props.name} value={value} onChange={onChangeHandler} disabled={props.disabled}/>
		</div>
	)
}

export default Input;
