import {Link} from 'react-router-dom';

import EditIcon from './EditIcon';

const EditLinkMini = (props) => {
	/* PROPS:
	all props
	*/

	return (
		<Link {...props}><EditIcon /></Link>
	);
}

export default EditLinkMini;