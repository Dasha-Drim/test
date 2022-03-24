import { useState, useEffect } from 'react';

import api from '../../packages/api';

const GeneralStatistics = () => {

	const [statistics, setStatistics] = useState(null);

	useEffect(() => {
		//console.log(api.authorization.login({login: "Vasya", password: "123321"}));
		setStatistics([
			{name: "Всего аккаунтов", value: "456"},
			{name: "Игроков онлайн", value: "122"},
			{name: "На балансах", value: "397373 $"},
			{name: "Всего пополнений", value: "2382728 $"},
			{name: "Всего выводов", value: "28272 $"},
		]);
	}, [])

	return (
		<>
		{statistics && statistics.map((item, key) =>
			<div key={key} className="col-12 col-sm-6 col-md-4 col-xl-3 col-xxxl-2 mb-5">
				<div className="card text-center">
					<div className="card-body">
						<span>{item.value}</span>
					</div>
					<div className="card-footer">
						<span>{item.name}</span>
					</div>
				</div>
			</div>
		)}
		</>
	);
}

export default GeneralStatistics;