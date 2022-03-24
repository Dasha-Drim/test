import Loader from '../../../../../../components/Loader';

const StatisticsSection = (props) => {
	/* PROPS:
	props.statistics
	*/

	return (
		<div className="StatisticsSection">
			<h3 className="mb-3">Статистика</h3>
			<div className="row text-center">
				{props.statistics ? props.statistics.map((item, key) =>
					<div key={key} className="col-12 col-sm-6 col-xl-4 col-xxxl-3 mb-5">
						<div className="card">
							<div className="card-body">
								<span>{item.value}</span>
							</div>
							<div className="card-footer">
								<span>{item.name}</span>
							</div>
						</div>
					</div>
				) :
					<div className="col-12 text-start">
						<Loader />
					</div>
				}
			</div>
		</div>
	);
}

export default StatisticsSection;