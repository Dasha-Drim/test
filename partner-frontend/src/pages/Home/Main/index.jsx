import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

import GeneralStatistics from '../../../dataComponents/GeneralStatistics';
import VisitorsWidget from '../../../dataComponents/VisitorsWidget';
import NewVisitorsWidget from '../../../dataComponents/NewVisitorsWidget';
import VisitorsCountryWidget from '../../../dataComponents/VisitorsCountryWidget';
import Loader from '../../../components/Loader';

import api from '../../../packages/api';

const Home = () => {

	const [stats, setStats] = useState(null);

	let dataRequest = () => {
		api.stats.get().then(result => {
			if (result.data.success) setStats(result.data.stats);
		});
	}

	useEffect(() => {
		dataRequest();
	}, [])

	return (
		<div className="HomeMain">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Панель управления</h1>
				</div>
			</div>
			<div className="row">
				{
					stats 
					? 
					stats.map((item, key) =>
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
					)
					: 
					<div>
						<Loader />
					</div>
				}
				
			</div>

			<div className="row">
				<div className="col-12 col-lg-6 col-xxl-4 mb-5">
					<VisitorsWidget />
				</div>

				<div className="col-12 col-lg-6 col-xxl-4 mb-5">
					<NewVisitorsWidget />
				</div>

				<div className="col-12 col-xl-6 col-xxl-4 mb-5">
					<VisitorsCountryWidget />
				</div>
			</div>
		</div>
	);
}

export default Home;