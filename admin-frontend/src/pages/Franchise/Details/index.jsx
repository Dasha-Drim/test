import { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';

import ManagersSection from './ManagersSection';
import OperatorsSection from './OperatorsSection';
import StatisticsSection from './StatisticsSection';
import FilialsSection from './FilialsSection';

import api from '../../../packages/api';

const Edit = () => {
	let location = useLocation();
	let navigate = useNavigate();

	const [franchiseeDetails, setFranchiseeDetails] = useState(null);
	const [currentTabId, setCurrentTabId] = useState((location.state && location.state.tab) ? location.state.tab : 0);

	let [idFranchisee] = useState((location.state && location.state.idFranchisee) ? location.state.idFranchisee : null);

	let changeTab = (currentTabId) => setCurrentTabId(currentTabId);

	let franchiseeRequest = (id) => {
		api.franchisee.getId(id).then(result => {
			if (result.data.success) setFranchiseeDetails(result.data);
		});
	}

	useEffect(() => {
		console.log("location", location)
		if (!idFranchisee) navigate("/franchisee");
		else franchiseeRequest(idFranchisee);		
	}, [])

	return (
		<div className="FranchiseDetails">
			<div className="row my-5">
				{
					franchiseeDetails ?
					<div className="col-12">
						<h1 className="mb-0">Франчайзи {franchiseeDetails.fio}</h1>
					</div>
					:
					""
				}
			</div>
			<div className="row mb-5">
				<div className="col-12 col-md-5 col-xl-4 col-xxl-3 mb-4">
					<div className="list-group">
						<button onClick={() => setCurrentTabId(0)} className={"list-group-item list-group-item-action "+(currentTabId === 0 ? "active" : "")} aria-current="true">
						Отчётность
						</button>
						<button onClick={() => setCurrentTabId(1)} className={"list-group-item list-group-item-action "+(currentTabId === 1 ? "active" : "")}>Подразделения</button>
						<button onClick={() => setCurrentTabId(2)} className={"list-group-item list-group-item-action "+(currentTabId === 2 ? "active" : "")}>Управляющие</button>
						<button onClick={() => setCurrentTabId(3)} className={"list-group-item list-group-item-action "+(currentTabId === 3 ? "active" : "")}>Операторы</button>
					</div>
				</div>


				{currentTabId === 0 ?
					<div className="col-12 col-md-7 col-xl-6 col-xxl-4">
						<StatisticsSection {...franchiseeDetails} />
					</div>
				: "" }

				{currentTabId === 1 ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<FilialsSection {...franchiseeDetails} />
					</div>
				: "" }

				{currentTabId === 2 ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<ManagersSection {...franchiseeDetails} />
					</div>
				: "" }

				{currentTabId === 3 ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<OperatorsSection {...franchiseeDetails} />
					</div>
				: "" }


			</div>
		</div>
	);
}

export default Edit;