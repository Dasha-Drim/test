import { useState, useEffect } from 'react';
import Select from 'react-select';

import api from '../../packages/api';

import LineChart from '../../components/LineChart';

const NewVisitorsWidget = () => {

	const selectOptions = [
		{ value: 'week', label: 'Неделя' },
		{ value: 'month', label: 'Месяц' },
		{ value: 'season', label: 'Квартал' },
		{ value: 'all', label: 'Всё время' },
	];

	const [data, setData] = useState(null);

	/*let requestData = (period) => {
		console.log("period", period);
		//console.log(api.authorization.login({login: "Vasya", password: "123321"}));
		return [
			{ date: '10.01.2022', value: 3 },
			{ date: '11.01.2022', value: 4 },
			{ date: '12.01.2022', value: 3.5 },
			{ date: '13.01.2022', value: 5 },
			{ date: '14.01.2022', value: 4.9 },
			{ date: '15.01.2022', value: 6 },
			{ date: '16.01.2022', value: 7 },
			{ date: '17.01.2022', value: 9 },
			{ date: '18.01.2022', value: 11 },
		];
	}

	let onChangePeriod = (selected) => {
		setData(requestData(selected.value));
	}

	useEffect(() => {
		setData(requestData(selectOptions[0].value));
	}, [])*/

	let requestData = (period) => {
	    api.stats.visitorsNew({period: period}).then(result => {
	      setData(result.data.visitors)
	    });
	  }

	  let onChangePeriod = (selected) => {
	    requestData(selected.value);
	  }

	  useEffect(() => {
	    requestData(selectOptions[0].value);
	  }, [])

	return (
		<div className="card h-100">
			<div className="card-body h-100">
				<div className="mb-4 d-flex justify-content-between align-items-center">
					<h2 className="mb-0">Новые посетители</h2>
					<Select
						className="basic-single"
						classNamePrefix="select"
						defaultValue={selectOptions[0]}
						isDisabled={false}
						isLoading={false}
						isClearable={false}
						isRtl={false}
						isSearchable={false}
						onChange={onChangePeriod}
						options={selectOptions}
					/>
				</div>
				<div>
					<LineChart data={data} />
				</div>
			</div>
		</div>
	);
}

export default NewVisitorsWidget;