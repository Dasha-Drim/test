import { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';

const Main = () => {

	const [paymentMethods, setPaymentMethods] = useState(null);

	useEffect(() => {
		// api
		let paymentMethods = [
			{
				balance: "0.00",
				currency: "RUB",
				deposit_available: true,
				name: "Paykassa Pro",
				type: "paykassapro",
				url: "https://paykassa.pro",
				withdrawal_available: true
			},
			{
				balance: "1.24",
				currency: "ETH",
				deposit_available: true,
				name: "Paykassa Pro",
				type: "paykassapro",
				url: "https://paykassa.pro",
				withdrawal_available: true
			},
			{
				balance: "0.122324",
				currency: "BTC",
				deposit_available: true,
				name: "Paykassa Pro",
				type: "paykassapro",
				url: "https://paykassa.pro",
				withdrawal_available: true
			},
			{
				balance: "392733",
				currency: "USD",
				deposit_available: true,
				name: "Интеркасса",
				type: "interkassa",
				url: "https://interkassa.com",
				withdrawal_available: true
			}
		];
		setPaymentMethods(paymentMethods);
	}, [])

	return (
		<div className="BalanceMain">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Балансы платёжных систем</h1>
				</div>
			</div>
			<div className="row mb-5">
				{paymentMethods ? paymentMethods.map((item, key) =>
					<div key={key} className="col-12 col-sm-6 col-md-4 col-xl-3 col-xxxl-2 mb-5">
						<div className="card">
							<div className="card-header">
								<span>{item.name}</span>
							</div>
							<div className="card-body">
								<span className="d-block mb-3">Баланс: {item.balance} {item.currency}</span>
								<a href={item.url} target="_blank" className="btn btn-secondary d-block">
									Пополнить
								</a>
							</div>
						</div>
					</div>
				) : <div className="col-12"><Loader /></div>}
			</div>
		</div>
	);
}

export default Main;