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
	const [max, setMax] = useState(15);

	let requestData = (period) => {
	    api.stats.visitorsNew({period: period}).then(result => {
	      setData(result.data.visitors)
	      setMax(result.data.max)
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
					<LineChart data={data} max={max} />
				</div>
			</div>
		</div>
	);
}

export default NewVisitorsWidget;