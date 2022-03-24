import {forwardRef} from 'react';

const InputDate = ({ field, form: { touched, errors }, ...props }) => {
	/* PROPS:
	onChange (function)
	onBlur (function)
	label (string)
	name (string)
	id (string)
	helperText (string)
	error (object)
	*/
	return (
		<>
			<div className="d-flex justify-content-between">
				<label htmlFor={props.id} className="form-label">{props.label}</label>
				{touched[field.name] && errors[field.name] && <span className="text-danger">{errors[field.name]}</span>}
			</div>
			<input {...field} type="date" className="form-control" id={props.id} aria-describedby={props.id+"Help"} />
			{props.helperText ? <div id={props.id+"Help"} className="form-text">{props.helperText}</div> : "" }
		</>
	);
}

export default InputDate;