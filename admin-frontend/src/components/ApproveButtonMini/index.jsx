import {Link} from 'react-router-dom';

import ThumbsUpIcon from './ThumbsUpIcon';

const ApproveButtonMini = (props) => {
	/* PROPS:
	all props
	*/

	return (
		<button {...props}><ThumbsUpIcon /></button>
	);
}

export default ApproveButtonMini;