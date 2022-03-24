import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select'

import ConfirmModal from '../../../utils/modal/ConfirmModal';
import InfoModal from '../../../utils/modal/InfoModal';
import Loader from '../../../components/Loader';
import SearchFormComponent from './SearchFormComponent';
import DetailsButtonMini from '../../../components/DetailsButtonMini';
import ApproveButtonMini from '../../../components/ApproveButtonMini';
import RejectButtonMini from '../../../components/RejectButtonMini';

const Main = () => {
	let [payments, setPayments] = useState(null);

	let [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
	let [paymentDetailsModalData, setPaymentDetailsModalData] = useState(null);

	let [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	let [confirmModalData, setConfirmModalData] = useState(null);

	// APPROVE TRANSACTION
	let onTransactionApproved = (data) => {
		setIsConfirmModalOpen(false);
		// api
		alert("Транзакция успешно одобрена " + data);
	}

	let approveTransaction = (itemId) => {
		setIsConfirmModalOpen(true);
		let modalData = {
			heading: "Подтверждение действия",
			text: "Уверены, что хотите ПОДТВЕРДИТЬ транзакцию?",
			buttonTextAgree: "Да",
			onCancel: () => setIsConfirmModalOpen(false),
			data: itemId,
			onAgree: onTransactionApproved
		} 
		setConfirmModalData(modalData);
	}

	// CANCEL TRANSACTION
	let onTransactionCanceled = (data) => {
		setIsConfirmModalOpen(false);
		// api
		alert("Транзакция успешно заблокирована " + data);
	}

	let cancelTransaction = (itemId) => {
		setIsConfirmModalOpen(true);
		let modalData = {
			heading: "Подтверждение действия",
			text: "Уверены, что хотите ЗАПРЕТИТЬ транзакцию?",
			buttonTextAgree: "Да",
			onCancel: () => setIsConfirmModalOpen(false),
			data: itemId,
			onAgree: onTransactionCanceled
		} 
		setConfirmModalData(modalData);
	}


	// SHOW PAYMENT DETAILS
	let showPaymentDetails = (details) => {
		setIsPaymentDetailsModalOpen(true);
		let modalData = {
			content: 
				<>
					{Object.keys(details).map((item, key) =>
						<div key={key}>
							<span>{item} — {details[item]}</span>
						</div>
					)}
				</>,
			onCancel: () => setIsPaymentDetailsModalOpen(false),
		} 
		setPaymentDetailsModalData(modalData);
	}

	// PAYMENTS FROM SERVER
	let paymentsRequest = (params) => {
		// api
	}

	useEffect(() => {
		// paymentsRequest();
		let payments = [
			{
				id: "dsjhsd7832jd8932jds",
				accountName: "+79179001919",
				date: "29.09.2020 08:21 МСК",
				type: "Пополнение",
				status: "Успешно",
				paymentMethod: "PayKassa",
				amount: "236 $",
				details: {type: "paykassaPro", id: "12436853", system: "Litecoin", amount: "0.01785720", currency: "LTC"}
			}
		];
		setPayments(payments);
	}, [])

	let onSearchFormSubmit = (data) => {
		console.log("update table with new params", data);
		// data->params, paymentsRequest(params);
		// setPayments()
	}

	return (
		<div className="PaymentsMain">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Платежи</h1>
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12">
					
					<SearchFormComponent onSubmit={onSearchFormSubmit} />

					<div className="table-responsive">
						<table className="table table-hover">
							<thead>
								<tr>
									<th scope="col">ID платежа</th>
									<th scope="col">Аккаунт</th>
									<th scope="col">Дата</th>
									<th scope="col">Тип</th>
									<th scope="col">Статус</th>
									<th scope="col">Платёжная система</th>
									<th scope="col">Сумма</th>
									<th scope="col">Действия</th>
								</tr>
							</thead>
							<tbody>
								{payments ? payments.map((item, key) =>
									<tr key={key}>
										<th scope="row">{item.id}</th>
										<td><Link to={"/players/"+(item.id)}>{item.accountName}</Link></td>
										<td>{item.date}</td>
										<td>{item.type}</td>
										<td>{item.status}</td>
										<td>{item.paymentMethod}</td>
										<td>{item.amount}</td>
										<td>
											<DetailsButtonMini onClick={() => showPaymentDetails(item.details)} className="me-2" />
											<ApproveButtonMini className="me-2" onClick={() => approveTransaction(item.id)} />
											<RejectButtonMini onClick={() => cancelTransaction(item.id)} />
										</td>
									</tr>
								) : 
									<tr>
										<td colSpan="7" className="text-center">
											<Loader />
										</td>
									</tr>
								}
								{payments && !payments.length ? 
									<tr>
										<td colSpan="7" className="text-center">Ничего нет</td>
									</tr>
								: null}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<ConfirmModal isOpen={isConfirmModalOpen} {...confirmModalData} />
			<InfoModal isOpen={isPaymentDetailsModalOpen} {...paymentDetailsModalData} />
		</div>
	);
}

export default Main;