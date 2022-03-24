import {forwardRef} from 'react';

const InputMoney = ({ field, form: { touched, errors }, ...props }) => {
	/* PROPS:
	onChange (function)
	onBlur (function)
	label (string)
	name (string)
	id (string)
	helperText (string)
	error (object)
	currency (string)
	*/
	return (
		<>
			<div className="d-flex justify-content-between">
				<label htmlFor={props.id} className="form-label">{props.label}</label>
				{touched[field.name] && errors[field.name] && <span className="text-danger">{errors[field.name]}</span>}
			</div>
			<div className="input-group">
				<span className="input-group-text">{props.currency}</span>
				<input {...field} type="text" className="form-control" id={props.id} aria-describedby={props.id+"Help"} />
				<span className="input-group-text">.00</span>
			</div>
			{props.helperText ? <div id={props.id+"Help"} className="form-text">{props.helperText}</div> : "" }
		</>
	);
}

export default InputMoney;