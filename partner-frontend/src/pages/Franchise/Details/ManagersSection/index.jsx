import { useState } from 'react';

import Loader from '../../../../components/Loader';
import AddButton from '../../../../components/AddButton';
import TrashButtonMini from '../../../../components/TrashButtonMini';
import ConfirmModal from '../../../../utils/modal/ConfirmModal';
import InfoModal from '../../../../utils/modal/InfoModal';

import api from '../../../../packages/api';

const ManagersSection = (props) => {
	/* PROPS:
	props.managers
	*/

	let [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	let [confirmModalData, setConfirmModalData] = useState(null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
	}

	let onDeleteItem = (data) => {
		setIsConfirmModalOpen(false);
		api.managers.remove({id: data}).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Управляющий успешно удалён</p>"});
				setIsModalOpen(true);
				let index = props.managers.findIndex(item => item.idAdmin == data);
				props.managers.splice(index, 1);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let confirmModalDataGeneral = {
		heading: "Подтверждение действия",
		text: "Уверены, что хотите удалить управляющего?",
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

	return (
		<div className="ManagersSection">
			<h3 className="mb-3">Управляющие</h3>
			
			{props.id ? <AddButton to="add-manager" state={{idFranchisee: props.id}} name="Создать управляющего" /> : ""}

			<div className="table-responsive mt-3">
				<table className="table table-hover">
					<thead>
						<tr>
							<th scope="col">ФИО</th>
							<th scope="col">Список подразделений</th>
							<th scope="col">Действия</th>
						</tr>
					</thead>
					<tbody>
						{props.managers ? props.managers.map((item, key) =>
							<tr key={key}>
								<th scope="row">{item.fio}</th>
								<td>
									{item.filials.length ?
										<ul>
											{item.filials.map((filialItem, filialKey) =>
												<li key={filialKey}>{filialItem}</li>
											)}
										</ul>
									: "Не привязан ни к одному" }
								</td>
								<td>
									<TrashButtonMini onClick={() => deleteItem(item.idAdmin)} />
								</td>
							</tr>
						) :
							<tr>
								<td colSpan="3" className="text-center"><Loader /></td>
							</tr>
						}
						{props.managers && !props.managers.length ?
							<tr>
								<td colSpan="3" className="text-center">Ничего нет</td>
							</tr>
						: null}
					</tbody>
				</table>
			</div>

			<ConfirmModal isOpen={isConfirmModalOpen} {...confirmModalData} />
			<InfoModal isOpen={isModalOpen} onCancel={() => closeModal()} {...modalData} />
		</div>
	);
}

export default ManagersSection;