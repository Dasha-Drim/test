import Loader from '../../../../components/Loader';
import { DateTime } from 'luxon';

const HistorySection = (props) => {
	/* PROPS:
	props.history (array of objects)
	*/
	return (
		<div className="HistorySection">
			<h3 className="mb-3">История операций</h3>
			{props.history ? props.history.map((item, key) =>
				<div className="card mb-4" key={key}>
					<div className="card-header d-flex justify-content-between">
						<span>{(item.type === "up") ? "Пополнение" : "Снятие"}</span>
						<span>{item.amount} {item.currency}</span>
					</div>
					<div className="card-body">
						<span className="d-block">Платёжная система: {(item.method === "cash") ? "Администрация" : item.paymentMethod}</span>
						<span className="d-block">Статус: {(item.method === "cash") ? "Успешно" : item.status}</span>
					</div>
					<div className="card-footer">
						<span>{DateTime.fromISO(item.dateTime).toFormat('dd.LL.yy')}</span>
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