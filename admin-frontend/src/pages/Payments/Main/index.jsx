import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { DateTime } from 'luxon';

import ConfirmModal from '../../../utils/modal/ConfirmModal';
import InfoModal from '../../../utils/modal/InfoModal';
import Loader from '../../../components/Loader';
import SearchFormComponent from './SearchFormComponent';
import DetailsButtonMini from '../../../components/DetailsButtonMini';
import ApproveButtonMini from '../../../components/ApproveButtonMini';
import RejectButtonMini from '../../../components/RejectButtonMini';

import api from '../../../packages/api';


const Main = () => {
	let [payments, setPayments] = useState(null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
	}

	let [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	let [confirmModalData, setConfirmModalData] = useState(null);

	// APPROVE TRANSACTION
	let onTransactionApproved = (data) => {
		
		// api payment_id
		api.payments.postUnconfirm({"payment_id": data}).then(result => {
			setIsConfirmModalOpen(false);
			if (result.data.success) {
				setModalData({content: "<p>Транзакция успешно одобрена</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
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
		
		// api payment_id
		api.payments.postUnconfirm({"payment_id": data}).then(result => {
			setIsConfirmModalOpen(false);
			if (result.data.success) {
				setModalData({content: "<p>Транзакция успешно заблокирована</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
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
		let content = "<p>";
		for (let key in details) {
			if (typeof details[key] === 'object') {
				for (let keyTwo in details[key]) {
					content = content + keyTwo + " — " + details[key][keyTwo] + "<br/>";
				}
			} else {
				content = content + key + " — " + details[key] + "<br/>";
			}
		}
		content += "</p>";
		setModalData({content: content});
		setIsModalOpen(true);
	}

	// PAYMENTS FROM SERVER
	let paymentsRequest = (params = null) => {
		api.payments.get(params).then(result => {
			if (result.data.items) setPayments(result.data.items);
		});
	}

	useEffect(() => {
		paymentsRequest();
	}, [])

	let onSearchFormSubmit = (data) => {
		paymentsRequest(data);
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
										<td>{DateTime.fromISO(item["created_at"]).toFormat('dd.LL.yy')}</td>
										<td>{item.type === "deposit" ? "Пополнение" : "Снятие"}</td>
										<td>{item.status === "canceled" ? "Отменён" : item.status === "succeeded" ? "Успешно" : "В процессе"}</td>
										<td>{(item["payment_method"] && item["payment_method"].type) ? item["payment_method"].type : ""}</td>
										<td>{item.amount.value}</td>
										<td>
											<DetailsButtonMini onClick={() => showPaymentDetails(item)} className="me-2" />
											{(item.type === "withdraw" && item.status === "pending") &&
												<>
												<ApproveButtonMini className="me-2" onClick={() => approveTransaction(item.id)} />
												<RejectButtonMini onClick={() => cancelTransaction(item.id)} />
												</>
											}
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
			<InfoModal isOpen={isModalOpen} onCancel={() => closeModal()} {...modalData} />
		</div>
	);
}

export default Main;