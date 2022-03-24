import './Input.scss';

function Controller(props){
	let error = ( props.errors !== undefined && props.errors[props.name] ) ? 'no-valid' : '';
  return(
    <div className={`Input ${error}`}>
      <label htmlFor={props.name}>{props.label}</label>
      <Controller
          as={InputMask}
          control={control}
          mask="999.999.999-99"
          name={props.name}
          defaultValue={props.value}
        />
    </div>
  )
}

export default Controller;