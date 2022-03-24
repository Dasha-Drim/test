import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import AccordionItem from '../../../components/AccordionItem';
import Loader from '../../../components/Loader';

import api from '../../../packages/api';

const Main = () => {
	const [monitoringReport, setMonitoringReport] = useState(null);
	
	useEffect(() => {
		api.stats.monitoring().then(result => {
	      if (result.data.success) setMonitoringReport(result.data.info);
	    });
	}, [])

	return (
		<div className="MonitoringMain">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Мониторинг</h1>
				</div>
			</div>

			<div className="row">
				<div className="col-12">
					
					<div className="card mb-5">
						{monitoringReport ? 
							<> 
							{monitoringReport.status === "ok" ?
								<div className="card-header py-3 bg-success text-white">
									<span>Все системы функционируют</span>
								</div>
							: 
								<div className="card-header py-3 bg-secondary text-white">
									<span>Есть некоторые проблемы</span>
								</div>
							}
							</>
						: ""}
					</div>

					<div className="accordion" id="accordionExample">
						{monitoringReport ? monitoringReport.details.map((item, key) =>
							<AccordionItem key={key} title={item.name} status={item.status}>
								<div>
								{item.info.map((itemInfo, keyInfo) =>
									<div key={keyInfo} className="row justify-content-between mb-2">
										<span className="col-12 col-sm-auto">{itemInfo.text}</span>
										<span className="col-12 col-sm-auto">{DateTime.fromISO(itemInfo.date).toFormat('dd.LL.yy TT')}</span>
									</div>
								)}
								</div>
							</AccordionItem>
						) : 
							<Loader />
						}
					</div>

				</div>
			</div>
		</div>
	);
}

export default Main;