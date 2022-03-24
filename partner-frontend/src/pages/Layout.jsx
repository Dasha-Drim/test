import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {Link, Outlet} from 'react-router-dom';

const Layout = (props) => {
	/* PROPS:
	props.useAuth
	*/

	return (
		<div className="container-fluid px-0">
			<div className="row m-0">
				<div className="d-lg-block col-12 col-lg-2 px-0">
					<Sidebar />
				</div>
				<div className="col-12 col-lg-10">
					<div className="px-3">
						<Header breadcrumbs={props.breadcrumbs} useAuth={props.useAuth} />
						<Outlet/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Layout;