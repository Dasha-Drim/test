import { useState } from 'react';
import {Link} from 'react-router-dom';

import Loader from '../../../../../../components/Loader';
import AddButton from '../../../../../../components/AddButton';
import DetachButtonMini from '../../../../../../components/DetachButtonMini';
import ConfirmModal from '../../../../../../utils/modal/ConfirmModal';
import InfoModal from '../../../../../../utils/modal/InfoModal';

import api from '../../../../../../packages/api';

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
		data.action = "move";
		api.managers.update(data).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Управляющий успешно откреплён</p>"});
				setIsModalOpen(true);
				let index = props.managers.findIndex(item => item.id == data.managerId);
				props.managers.splice(index, 1);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let confirmModalDataGeneral = {
		heading: "Подтверждение действия",
		text: "Уверены, что хотите открепить управляющего от этого подразделения?",
		buttonTextAgree: "Да, открепить",
		onAgree: onDeleteItem,
		onCancel: () => setIsConfirmModalOpen(false),
		data: null
	}

	let detachItem = (itemId) => {
		setIsConfirmModalOpen(true);
		confirmModalDataGeneral.data = itemId;
		setConfirmModalData(confirmModalDataGeneral);
	}

	return (
		<div className="ManagersSection">
			<h3 className="mb-3">Управляющие</h3>
			<div className="d-flex justify-content-between">
				{props.idFranchisee ? <AddButton to="attach-manager" state={{idFranchisee: props.idFranchisee, idFilial: props.idFilial}} name="Прикрепить управляющего" /> : ""}
			</div>
			<div className="table-responsive mt-3">
				<table className="table table-hover">
					<thead>
						<tr>
							<th scope="col">ФИО</th>
							<th scope="col">Действия</th>
						</tr>
					</thead>
					<tbody>
						{props.managers ? props.managers.map((item, key) =>
							<tr key={key}>
								<th scope="row">{item.fio}</th>
								<td>
									<DetachButtonMini onClick={() => detachItem({filialId: props.idFilial, managerId: item.id})} />
								</td>
							</tr>
						) :
							<tr>
								<td colSpan="2" className="text-center"><Loader /></td>
							</tr>
						}
						{props.managers && !props.managers.length ?
							<tr>
								<td colSpan="2" className="text-center">Ничего нет</td>
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