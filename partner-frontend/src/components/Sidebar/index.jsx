import {NavLink, Link} from 'react-router-dom';


import HomeIcon from './HomeIcon';
import PlayersIcon from './PlayersIcon';
import PromocodesIcon from './PromocodesIcon';
import PaymentsIcon from './PaymentsIcon';
import BalanceIcon from './BalanceIcon';
import FranchiseIcon from './FranchiseIcon';
import MonitoringIcon from './MonitoringIcon';

import './index.scss';

const Sidebar = () => {
	let navigation = [
		{
			icon: HomeIcon,
			name: "Главная",
			link: "/"
		},
	];

	return (
		<div className="Sidebar text-start py-2">
			<div className="pb-5 px-3 d-none d-lg-inline">
				<Link to="/" className="logo display-1">RealLoto admin</Link>
			</div>
			<nav className="Sidebar-nav d-flex justify-content-center d-lg-block">
				{navigation.map((item, key) =>
					<NavLink key={key} className={({ isActive }) => "Sidebar-nav__item d-flex justify-content-center justify-content-lg-start align-items-center py-1 px-1 px-lg-3 "+(isActive ? "active" : "")} to={item.link} title={item.name}><item.icon /><span className="d-none d-lg-inline ms-2">{item.name}</span></NavLink>
				)}
			</nav>
		</div>
	);
}

export default Sidebar;