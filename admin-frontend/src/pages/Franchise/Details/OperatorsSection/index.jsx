import { useState } from 'react';

import Loader from '../../../../components/Loader';
import AddButton from '../../../../components/AddButton';
import TrashButtonMini from '../../../../components/TrashButtonMini';
import ConfirmModal from '../../../../utils/modal/ConfirmModal';
import InfoModal from '../../../../utils/modal/InfoModal';

import api from '../../../../packages/api';

const OperatorsSection = (props) => {
	/* PROPS:
	props.operators
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
		api.operators.remove({id: data}).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Оператор успешно удалён</p>"});
				setIsModalOpen(true);
				let index = props.operators.findIndex(item => item.id == data);
				props.operators.splice(index, 1);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let confirmModalDataGeneral = {
		heading: "Подтверждение действия",
		text: "Уверены, что хотите удалить оператора?",
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
			<h3 className="mb-3">Операторы</h3>

			<p>Операторы создаются внутри подразделений. Здесь можно увидеть список всех операторов всех подразделений</p>

			<div className="table-responsive mt-3">
				<table className="table table-hover">
					<thead>
						<tr>
							<th scope="col">ФИО</th>
							<th scope="col">Подразделение</th>
							<th scope="col">Действия</th>
						</tr>
					</thead>
					<tbody>
						{props.operators ? props.operators.map((item, key) =>
							<tr key={key}>
								<th scope="row">{item.fio}</th>
								<td>{item.filial}</td>
								<td>
									<TrashButtonMini onClick={() => deleteItem(item.id)} />
								</td>
							</tr>
						) :
							<tr>
								<td colSpan="3" className="text-center"><Loader /></td>
							</tr>
						}
						{props.operators && !props.operators.length ?
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

export default OperatorsSection;