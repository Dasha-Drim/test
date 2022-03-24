import {Link} from 'react-router-dom';

import PlusIcon from './PlusIcon';

const AddButton = (props) => {
	/* PROPS:
	props.to (string) - link to page
	props.name (string)
	*/

	return (
		<Link to={props.to} state={(props.state) ? props.state : null} className="btn btn-secondary d-inline-flex align-items-center">
			<PlusIcon />
			<span className="ms-2">{props.name}</span>
		</Link>
	);
}

export default AddButton;