import Select from 'react-select';

const InputSelect = ({ field, form: { touched, errors, setFieldValue }, ...props }) => {
	/* PROPS:
	onChange (function)
	onBlur (function)
	label (string)
	name (string)
	id (string)
	helperText (string)
	error (object)
	options (!important)
	*/
	return (
		<>
		<div className="d-flex justify-content-between">
			<label htmlFor={props.id} className="form-label">{props.label}</label>
			{touched[field.name] && errors[field.name] && <span className="text-danger">{errors[field.name]}</span>}
		</div>
		<Select
			className="basic-single"
			classNamePrefix="select"
			value={props.options ? props.options.find(option => option.value === field.value) : ''}
			isDisabled={false}
			isLoading={false}
			isClearable={false}
			isRtl={false}
			isSearchable={false}
			id={props.id}
			options={props.options}
			name={field.name}
			onBlur={field.onBlur}
			onChange={(option) => setFieldValue(field.name, option.value)}
		/>
		{props.helperText ? <div id={props.id+"Help"} className="form-text">{props.helperText}</div> : "" }
		</>
	);
}

export default InputSelect;