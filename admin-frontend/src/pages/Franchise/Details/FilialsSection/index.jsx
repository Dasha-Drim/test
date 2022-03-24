import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import Loader from '../../../../components/Loader';
import AddButton from '../../../../components/AddButton';
import DetailsLinkMini from '../../../../components/DetailsLinkMini';
import TrashButtonMini from '../../../../components/TrashButtonMini';
import ConfirmModal from '../../../../utils/modal/ConfirmModal';
import InfoModal from '../../../../utils/modal/InfoModal';

import api from '../../../../packages/api';

const FilialsSection = (props) => {
	/* PROPS:
	props.filials
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
		api.filials.remove({id: data}).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Филиал успешно удалён</p>"});
				setIsModalOpen(true);
				let index = props.filials.findIndex(item => item.idFilial == data);
				props.filials.splice(index, 1);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
		
	}

	let confirmModalDataGeneral = {
		heading: "Подтверждение действия",
		text: "Уверены, что хотите удалить филиал?",
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
		console.log("props", props.id);
	}, [props])

	return (
		<div className="FilialsSection">
			<h3 className="mb-3">Подразделения</h3>
			
			{props.id ? <AddButton to="add-filial" state={{idFranchisee: props.id}} name="Создать подразделение" /> : ""}

			<div className="table-responsive mt-3">
				<table className="table table-hover">
					<thead>
						<tr>
							<th scope="col">Название</th>
							<th scope="col">Пополнения</th>
							<th scope="col">Выплаты</th>
							<th scope="col">П-В</th>
							<th scope="col">Действия</th>
						</tr>
					</thead>
					<tbody>
						{props.filials ? props.filials.map((item, key) =>
							<tr key={key}>
								<th scope="row">{item.name}</th>
								<td>{item.deposits}</td>
								<td>{item.withdraws}</td>
								<td>{item.profit}</td>
								<td>
									<DetailsLinkMini to="/franchisee/details/filial" state={{idFilial: item.idFilial, breadcrump: "Филиал " + item.name}} className="me-2" />
									<TrashButtonMini onClick={() => deleteItem(item.idFilial)} />
								</td>
							</tr>
						) :
							<tr>
								<td colSpan="5" className="text-center"><Loader /></td>
							</tr>
						}
						{props.filials && !props.filials.length ?
							<tr>
								<td colSpan="5" className="text-center">Ничего нет</td>
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

export default FilialsSection;