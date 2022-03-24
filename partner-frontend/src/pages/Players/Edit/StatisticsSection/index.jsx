import Loader from '../../../../components/Loader';

const StatisticsSection = (props) => {
	/* PROPS:
	props.profit
	props.totalDeposits
	props.totalWithdraws
	*/
	let statistics = (props.profit !== false) && (props.totalDeposits !== false) && (props.totalWithdraws !== false) ? 
		[
			{
				name: "Прибыльность",
				value: props.profit
			},
			{
				name: "Суммарно пополнений",
				value: props.totalDeposits
			},
			{
				name: "Суммарно выводов",
				value: props.totalWithdraws
			} 
		] : null;
	return (
		<div className="StatisticsSection">
			<h3 className="mb-3">Статистика игрока</h3>
			{statistics ? statistics.map((item, key) =>
				<div className="card mb-3">
					<div class="card-header py-3 d-flex justify-content-between">
						<span>{item.name}</span>
						<span>{item.value}</span>
					</div>
				</div>
			) :
				<div>
					<Loader />
				</div>
			}
		</div>
	);
}

export default StatisticsSection;