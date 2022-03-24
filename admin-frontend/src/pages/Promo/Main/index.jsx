import {useState, useEffect} from 'react';

import ConfirmModal from '../../../utils/modal/ConfirmModal';
import AddButton from '../../../components/AddButton';
import TrashButtonMini from '../../../components/TrashButtonMini';
import Loader from '../../../components/Loader';
import InfoModal from '../../../utils/modal/InfoModal';

import api from '../../../packages/api';

const Main = () => {
	let [promocodes, setPromocodes] = useState(null);

	let [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	let [confirmModalData, setConfirmModalData] = useState(null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
	}

	let promocodesRequest = () => {
		api.promocodes.get().then(result => {
			if (result.data.success) {
				setPromocodes(result.data.promocodes);
			}
		});
	}

	let onDeleteItem = (data) => {
		setIsConfirmModalOpen(false);
		api.promocodes.remove({promocode: data}).then(result => {
			if (result.data.success) {
				promocodesRequest();
				setModalData({content: "<p>Промокод успешно удалён</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let confirmModalDataGeneral = {
		heading: "Подтверждение действия",
		text: "Уверены, что хотите удалить промокод?",
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
		promocodesRequest();
	}, [])

	return (
		<div className="PromoMain">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Промокоды</h1>
				</div>
			</div>
			<div className="row mb-4">
				<div className="col-12">
					<AddButton to="add" name="Добавить новый" />
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12">
					<div className="table-responsive mt-3">
						<table className="table table-hover">
							<thead>
								<tr>
									<th scope="col">Промокод</th>
									<th scope="col">Размер бонуса</th>
									<th scope="col">Количество применений</th>
									<th scope="col">Действует до</th>
									<th scope="col">Действия</th>
								</tr>
							</thead>
							<tbody>
								{promocodes ? promocodes.map((item, key) =>
									<tr key={key}>
										<th scope="row">{item.promocode}</th>
										<td>{item.price}</td>
										<td>{item.count}</td>
										<td>{item.dateEnd}</td>
										<td><TrashButtonMini onClick={() => deleteItem(item.promocode)} /></td>
									</tr>
								) :
									<tr>
										<td colSpan="5" className="text-center">
											<Loader />
										</td>
									</tr>
								}
								{promocodes && !promocodes.length ? 
									<tr>
										<td colSpan="5" className="text-center">Пока нет промокодов</td>
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