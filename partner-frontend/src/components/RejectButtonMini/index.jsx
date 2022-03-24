import {Link} from 'react-router-dom';

import ThumbsDownIcon from './ThumbsDownIcon';

const RejectButtonMini = (props) => {
	/* PROPS:
	all props
	*/

	return (
		<button {...props}><ThumbsDownIcon /></button>
	);
}

export default RejectButtonMini;