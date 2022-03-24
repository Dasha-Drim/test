import {Link} from 'react-router-dom';

import SearchIcon from './SearchIcon';

const DetailsButtonMini = (props) => {
	/* PROPS:
	all props
	*/

	return (
		<button {...props}><SearchIcon /></button>
	);
}

export default DetailsButtonMini;