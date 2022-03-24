import {Link} from 'react-router-dom';

import TrashIcon from './TrashIcon';

const TrashButtonMini = (props) => {
	/* PROPS:
	all props
	*/

	return (
		<button {...props}><TrashIcon /></button>
	);
}

export default TrashButtonMini;