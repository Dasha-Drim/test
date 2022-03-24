import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import DataSection from './DataSection';
import BalanceSection from './BalanceSection';
import HistorySection from './HistorySection';
import StatisticsSection from './StatisticsSection';

import api from '../../../packages/api';

const Edit = () => {
	let location = useLocation();
	let navigate = useNavigate();

	const [playerData, setPlayerData] = useState(null);
	const [currentTabId, setCurrentTabId] = useState(0);
	
	let [idUser] = useState(location.state.idUser);

	let changeTab = (currentTabId) => setCurrentTabId(currentTabId);

	let playersRequest = (params) => {
		api.players.getPlayersId(params).then(result => {
			if (result.data.success) setPlayerData(result.data.user);
		});
	}

	useEffect(() => {
		if (!idUser) navigate("/players");

		playersRequest(idUser);		
	}, []);

	return (
		<div className="PlayersEdit">
			<div className="row my-5">
			{
				playerData ?
				<div className="col-12">
					<h1 className="mb-0">Аккаунт {playerData.accountInfo.value}</h1>
				</div> :
				""
			}
				
			</div>
			<div className="row mb-5">
				<div className="col-12 col-md-5 col-xl-4 col-xxl-3 mb-4">
					<div className="list-group">
						<button onClick={() => setCurrentTabId(0)} className={"list-group-item list-group-item-action "+(currentTabId === 0 ? "active" : "")} aria-current="true">
						Данные аккаунта
						</button>
						<button onClick={() => setCurrentTabId(1)} className={"list-group-item list-group-item-action "+(currentTabId === 1 ? "active" : "")}>Баланс</button>
						<button onClick={() => setCurrentTabId(2)} className={"list-group-item list-group-item-action "+(currentTabId === 2 ? "active" : "")}>История операций</button>
						<button onClick={() => setCurrentTabId(3)} className={"list-group-item list-group-item-action "+(currentTabId === 3 ? "active" : "")}>Статистика игрока</button>
					</div>
				</div>

				{currentTabId === 0 ?
					<div className="col-12 col-md-7 col-xl-6 col-xxl-4">
						<DataSection {...playerData} />
					</div>
				: "" }

				{currentTabId === 1 ?
					<div className="col-12 col-md-7 col-xl-6 col-xxl-4">
						<BalanceSection {...playerData} />
					</div>
				: "" }

				{currentTabId === 2 ?
					<div className="col-12 col-md-7 col-xl-6 col-xxl-4">
						<HistorySection {...playerData} />
					</div>
				: ""}

				{currentTabId === 3 ?
					<div className="col-12 col-md-7 col-xl-6 col-xxl-4">
						<StatisticsSection {...playerData} />
					</div>
				: ""}

			</div>
		</div>
	);
}

export default Edit;