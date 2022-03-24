import {Link} from 'react-router-dom';

import DetachIcon from './DetachIcon';

const DetachButtonMini = (props) => {
	/* PROPS:
	all props
	*/

	return (
		<button {...props}><DetachIcon /></button>
	);
}

export default DetachButtonMini;