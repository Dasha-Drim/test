import Loader from '../../../../../../../../components/Loader';

const HistorySection = (props) => {
	/* PROPS:
	props.history (array of objects)
	*/
	return (
		<div className="HistorySection">
			<h3 className="mb-3">История операций</h3>
			{props.history ? props.history.map((item, key) =>
				<div className="card mb-4">
					<div class="card-header d-flex justify-content-between">
						<span>{item.type}</span>
						<span>{item.amount} {item.currency}</span>
					</div>
					<div className="card-body">
						<span className="d-block">Платёжная система: {item.paymentMethod}</span>
						<span className="d-block">Статус: {item.status}</span>
					</div>
					<div className="card-footer">
						<span>{item.date}</span>
					</div>
				</div>
			) : 
				<div>
					<Loader />
				</div>
			}
			{props.history && !props.history.length ? 
				<span>Ничего нет</span>
			: null}
		</div>
	);
}

export default HistorySection;