import {Link} from 'react-router-dom';

import SearchIcon from './SearchIcon';

const DetailsLinkMini = (props) => {
	/* PROPS:
	all props
	*/

	return (
		<Link {...props}><SearchIcon /></Link>
	);
}

export default DetailsLinkMini;