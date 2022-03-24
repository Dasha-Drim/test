import { Link } from 'react-router-dom';

const InputFile = ({ field, form: { touched, errors, setFieldValue }, ...props }) => {
	/* PROPS:
	onChange (function)
	onBlur (function)
	label (string)
	name (string)
	id (string)
	helperText (string)
	error (object)
	filePath (string, optional)
	*/
	return (
		<>
			<div className="d-flex justify-content-between">
				<label htmlFor={props.id} className="form-label">{props.label}</label>
				{touched[field.name] && errors[field.name] && <span className="text-danger">{errors[field.name]}</span>}
			</div>
			<div className="input-group">
				<input 
					type="file"
					className="form-control" 
					aria-describedby={props.id+"Help"}
					id={props.id}
					name={field.name}
					onBlur={field.onBlur}
					onChange={(event) => setFieldValue(field.name, event.currentTarget.files[0])}
				/>
				{props.helperText ? <div id={props.id+"Help"} className="form-text">{props.helperText}</div> : "" }
				{props.filePath ? <a href={props.filePath} target="_blank" className="btn btn-outline-secondary" id="button-addon2">Посмотреть</a> : "" }
			</div>
		</>
	);
}

export default InputFile