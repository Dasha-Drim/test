import './InputPublic.scss';

const InputPublic = (props) =>{
	let error = ( props.errors !== undefined && props.errors[props.name] ) ? 'no-valid' : '';
		
	return(
		<div className={`InputPublic ${error}`}>
			<label htmlFor={props.name}>{props.label}</label>
			<input id={props.name} ref={props.refy} type={props.type} name={props.name} defaultValue={props.value} onChange={props.updateInput ? (e) => props.updateInput(e.target.value) : (e) => console.log()}/>
		</div>
	)
}

export default InputPublic;
