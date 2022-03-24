import { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';

import StatisticsSection from './StatisticsSection';
import ManagersSection from './ManagersSection';
import OperatorsSection from './OperatorsSection';
import PlayersSection from './PlayersSection';

import api from '../../../../../packages/api';

const FilialDetails = () => {
	let location = useLocation();
	let navigate = useNavigate();

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
		if (!idFilial) navigate("/franchisee");
		else filialRequest(idFilial);
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
						<button onClick={() => setCurrentTabId(0)} className={"list-group-item list-group-item-action "+(currentTabId === 0 ? "active" : "")} aria-current="true">
						Статистика
						</button>
						<button onClick={() => setCurrentTabId(1)} className={"list-group-item list-group-item-action "+(currentTabId === 1 ? "active" : "")}>Управляющие</button>
						<button onClick={() => setCurrentTabId(2)} className={"list-group-item list-group-item-action "+(currentTabId === 2 ? "active" : "")}>Операторы</button>
						<button onClick={() => setCurrentTabId(3)} className={"list-group-item list-group-item-action "+(currentTabId === 3 ? "active" : "")}>Игроки</button>
					</div>
				</div>

				{currentTabId === 0 ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<StatisticsSection {...filialData} />
					</div>
				: "" }

				{currentTabId === 1 ?
					<div className="col-12 col-md-7 col-xl-8 col-xxl-9">
						<ManagersSection {...filialData} />
					</div>
				: "" }

				{currentTabId === 2 ?
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