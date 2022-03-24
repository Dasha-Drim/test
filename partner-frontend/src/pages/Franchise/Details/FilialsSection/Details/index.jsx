import { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';

import StatisticsSection from './StatisticsSection';
import ManagersSection from './ManagersSection';
import OperatorsSection from './OperatorsSection';
import PlayersSection from './PlayersSection';

import api from '../../../../../packages/api';
import { roleAdapter } from '../../../../../packages/storage';

const FilialDetails = (props) => {
	let location = useLocation();
	let navigate = useNavigate();
	let [role, setRole] = useState(null)

	const [filialData, setFilialData] = useState(null);
	const [currentTabId, setCurrentTabId] = useState((location.state && location.state.tab) ? location.state.tab : 0);

	let changeTab = (currentTabId) => {
		setCurrentTabId(currentTabId);
	}

	let [idFilial] = useState((location.state && location.state.idFilial) ? location.state.idFilial : null);

	let filialRequest = (id) => {
		api.filials.getId(id).then(result => {
			if (result.data.success) {
				setFilialData(result.data.filial);
			}
		});
	}

	useEffect(() => {
		roleAdapter.getRole().then(result => {
      		setRole(result);
      		if (result === "operator") {
      			filialRequest(0);
      			setCurrentTabId(3);
      		} else {
      			if (!idFilial) navigate("/");
				else filialRequest(idFilial);
      		}
    	})
    	console.log("props", props)
	}, [])
	

	return (
		<div className="FranchiseFilialDetails">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Филиал {filialData ? filialData.name : ""}</h1>
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12 col-md-5 col-xl-4 col-xxl-3 mb-4">
					<div className="list-group">
						{role !== "operator" && <button onClick={() => setCurrentTabId(0)} className={"list-group-item list-group-item-action "+(currentTabId === 0 ? "active" : "")} aria-current="true">
						Статистика
						</button>}
						{role === "franchisee" && <button onClick={() => setCurrentTabId(1)} className={"list-group-item list-group-item-action "+(currentTabId === 1 ? "active" : "")}>Управляющие</button>}
						{role !== "operator" && <button onClick={() => setCurrentTabId(2)} className={"list-group-item list-group-item-action "+(currentTabId === 2 ? "active" : "")}>Операторы</button>}
						<button onClick={() => setCurrentTabId(3)} className={"list-group-item list-group-item-action "+(currentTabId === 3 ? "active" : "")}>Игроки</button>
					</div>
				</div>

				{((role !== "operator") && (currentTabId === 0)) ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<StatisticsSection {...filialData} />
					</div>
				: "" }

				{((role === "franchisee") && (currentTabId === 1)) ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<ManagersSection {...filialData} />
					</div>
				: "" }

				{((role !== "operator") && (currentTabId === 2)) ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<OperatorsSection {...filialData} />
					</div>
				: "" }

				{currentTabId === 3 ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<PlayersSection {...filialData} />
					</div>
				: "" }

			</div>
		</div>
	);
}

export default FilialDetails;