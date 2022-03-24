import {Link} from 'react-router-dom';
import { useState, useEffect } from 'react';

import Loader from '../../../../../../components/Loader';
import SearchForm from '../../../../../../components/SearchForm';
import AddButton from '../../../../../../components/AddButton';
import DetailsLinkMini from '../../../../../../components/DetailsLinkMini';

import api from '../../../../../../packages/api';

const PlayersSection = (props) => {
	/* PROPS:
	props.players
	*/

	let [players, setPlayers] = useState(null)

	let playersRequest = (params = null) => {
		api.players.getOffline(params).then(result => {
			if (result.data.success) setPlayers(result.data.users);
		});
	}

	let onSearchSubmit = (values) => {
		playersRequest(values);
	}

	useEffect(() => {
		setPlayers(props.players);
	}, [props])

	return (
		<div className="PlayersSection">
			<h3 className="mb-3">Игроки</h3>
			<div className="d-flex justify-content-between">
				<SearchForm onSubmit={onSearchSubmit} />
			</div>
			<div className="table-responsive mt-3">
				<table className="table table-hover">
					<thead>
						<tr>
							<th scope="col">Код доступа</th>
							<th scope="col">Телефон</th>
							<th scope="col">В подразделении</th>
							<th scope="col">Действия</th>
						</tr>
					</thead>
					<tbody>
						{players ? players.map((item, key) =>
							<tr key={key}>
								<th scope="row">{item.code}</th>
								<td>{item.phone}</td>
								<td>{item.isActive ? "Да" : "Нет"}</td>
								<td></td>
							</tr>
						) :
							<tr>
								<td colSpan="4" className="text-center"><Loader /></td>
							</tr>
						}
						{players && !players.length ?
							<tr>
								<td colSpan="4" className="text-center">Ничего нет</td>
							</tr>
						: null}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default PlayersSection;