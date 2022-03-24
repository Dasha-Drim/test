import { useState, useEffect } from 'react';
import Select from 'react-select';

import api from '../../packages/api';

import PieChart from '../../components/PieChart';

const VisitorsCountryWidget = () => {

  const selectOptions = [
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'season', label: 'Квартал' },
    { value: 'all', label: 'Всё время' },
  ];

  const [data, setData] = useState(null);

  let requestData = (period) => {
    api.stats.country({period: period}).then(result => {
      setData(result.data.country)
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
          <h2 className="mb-0">Посетители по странам</h2>
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
          <PieChart data={data} />
        </div>
      </div>
    </div>
  );
}

export default VisitorsCountryWidget;