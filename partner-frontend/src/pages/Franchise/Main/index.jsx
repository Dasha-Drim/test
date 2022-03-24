import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

import ConfirmModal from '../../../utils/modal/ConfirmModal';
import InfoModal from '../../../utils/modal/InfoModal';
import TrashButtonMini from '../../../components/TrashButtonMini';
import DetailsLinkMini from '../../../components/DetailsLinkMini';
import AddButton from '../../../components/AddButton';
import Loader from '../../../components/Loader';

import api from '../../../packages/api';

const Main = () => {
	let [franchisee, setFranchisee] = useState(null);

	let [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	let [confirmModalData, setConfirmModalData] = useState(null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let franchiseeRequest = () => {
		api.franchisee.get().then(result => {
			if (result.data.success) setFranchisee(result.data.franchisee);
		});
	}

	let closeModal = () => {
		setIsModalOpen(false);
		franchiseeRequest();
	}

	let onDeleteItem = (data) => {
		setIsConfirmModalOpen(false);
		api.franchisee.remove({id: data}).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Франчайзи успешно удалён</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let confirmModalDataGeneral = {
		heading: "Подтверждение действия",
		text: "Уверены, что хотите удалить франчайзи? Франчайзи удаляется вместе с управляющими и операторами безвозвратно",
		buttonTextAgree: "Да, удалить",
		onAgree: onDeleteItem,
		onCancel: () => setIsConfirmModalOpen(false),
		data: null
	}

	let deleteItem = (itemId) => {
		setIsConfirmModalOpen(true);
		confirmModalDataGeneral.data = itemId;
		setConfirmModalData(confirmModalDataGeneral);
	}

	useEffect(() => {
		franchiseeRequest();
	}, [])

	return (
		<div className="FranchiseMain">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Франчайзи</h1>
				</div>
			</div>
			<div className="row mb-4">
				<div className="col-12 d-flex align-items-center">
					<AddButton to="add" name="Создать нового франчайзи" />
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12">
					<div className="table-responsive mt-3">
						<table className="table table-hover">
							<thead>
								<tr>
									<th scope="col">Владелец</th>
									<th scope="col">Комиссионый процент</th>
									<th scope="col">Валюта</th>
									<th scope="col">Действия</th>
								</tr>
							</thead>
							<tbody>
								{franchisee ? franchisee.map((item, key) =>
									<tr key={key}>
										<th scope="row">{item.fio}</th>
										<td>{item.percent}%</td>
										<td>{item.currency}</td>
										<td>
											<DetailsLinkMini to="/franchisee/details" state={{idFranchisee: item.id}} className="me-2" />
											<TrashButtonMini onClick={() => deleteItem(item.id)} />
										</td>
									</tr>
								) :
									<tr>
										<td colSpan="4" className="text-center">
											<Loader />
										</td>
									</tr>
								}
								{franchisee && !franchisee.length ?
									<tr>
										<td colSpan="4" className="text-center">Ничего нет</td>
									</tr>
								: null }
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