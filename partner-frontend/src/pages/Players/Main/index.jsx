import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import Dropdown from '../../../components/Dropdown';
import SearchForm from '../../../components/SearchForm';
import Loader from '../../../components/Loader';
import EditLinkMini from '../../../components/EditLinkMini';

import api from '../../../packages/api';

const Main = () => {
	const [players, setPlayers] = useState(null);

	let sortVariants = [
		{
			name: "По дате регистрации",
			action: () => updateTableWithSort("byDate")
		},
		{
			name: "По количеству бонусов",
			action: () => updateTableWithSort("byBonus")
		},
		{
			name: "По текущему балансу",
			action: () => updateTableWithSort("byBalance")
		},
		{
			name: "По худшей прибыльности",
			action: () => updateTableWithSort("byProfit")
		},
	];	

	let playersRequest = (params = null) => {
		api.players.getPlayers(params).then(result => {
			if (result.data.success) {
				setPlayers(result.data.users);
			}
		});
	}

	let onSearchFormSubmit = (data) => {
		playersRequest(data);
	}

	let updateTableWithSort = (sortMethod) => {
		playersRequest({sort: sortMethod});
	}

	useEffect(() => {
		playersRequest();
	}, [])

	return (
		<div className="PlayersMain">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Игроки</h1>
				</div>
			</div>
			<div className="users-filter row align-items-center justify-content-between">
				<div className="col-auto mb-4">
					<SearchForm onSubmit={onSearchFormSubmit} />
				</div>
				<div className="col-auto mb-4">
					<Dropdown name="Сортировка" variants={sortVariants} />
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12">
					<span>Показано {players ? players.length : ""} из {players ? players.length : ""}</span>
					<div className="table-responsive mt-3">
						<table className="table table-hover">
							<thead>
								<tr>
									<th scope="col">Аккаунт</th>
									<th scope="col">Валюта</th>
									<th scope="col">Текущий баланс</th>
									<th scope="col">Всего пополнений</th>
									<th scope="col">Всего снятий</th>
									<th scope="col">Бонусов получено</th>
									<th scope="col">Прибыльность</th>
									<th scope="col">Дата регистрации</th>
									<th scope="col">Действия</th>
								</tr>
							</thead>
							<tbody>
								{players ? players.map((item, key) =>
									<tr key={key}>
										<th scope="row">{item.account}</th>
										<td>{item.currency}</td>
										<td>{item.balance}</td>
										<td>{item.totalDeposits}</td>
										<td>{item.totalWithdraws}</td>
										<td>{item.totalBonuses}</td>
										<td>{item.profit}</td>
										<td>{DateTime.fromISO(item.registerDate).toFormat('dd.LL.yy')}</td>
										<td><EditLinkMini to="/players/edit" state={{idUser: item.idUser}} /></td>
									</tr>
								) :
									<tr>
										<td colSpan="9" className="text-center">
											<Loader />
										</td>
									</tr>
								}
								{players && !players.length ? 
									<tr>
										<td colSpan="7" className="text-center">Ничего нет</td>
									</tr>
								: null}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Main;