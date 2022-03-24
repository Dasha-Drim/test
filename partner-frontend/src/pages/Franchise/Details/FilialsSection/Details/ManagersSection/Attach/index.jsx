import { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Loader from "../../../../../../../components/Loader";
import InputSelect from "../../../../../../../components/InputSelect";
import InfoModal from '../../../../../../../utils/modal/InfoModal';

import api from '../../../../../../../packages/api';

const Add = () => {
	let location = useLocation();
	let navigate = useNavigate();
	const [managersList, setManagersList] = useState(null);

	let [idFranchisee] = useState((location.state && location.state.idFranchisee) ? location.state.idFranchisee : null);
	let [idFilial] = useState((location.state && location.state.idFilial) ? location.state.idFilial : null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
		navigate("/filial", { state: {idFilial: idFilial, tab: 1}});
	}

	let managersRequest = (params) => {
		api.managers.get(params).then(result => {
			if (result.data.success) setManagersList(result.data.managers);
		});
	}

	const onSubmit = (values, { setSubmitting }) => {
		values.action = "add";
		values.filialId = idFilial;
		api.managers.update(values).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Оператор успешно прикреплен к филиалу</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let initialValues = { managerId: '' };

	let validationSchema = Yup.object({
		managerId: Yup.string().required('Обязательно'),
	})

	useEffect(() => {		
		if (!idFranchisee && !idFilial) navigate("/");
		else managersRequest({idFranchisee: idFranchisee});
	}, [])

	return (
		<div className="FranchiseFilialManagersAttach">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-1">Прикрепление управляющего</h1>
					<p>Тут можно прикреплять уже существующих управляющих. Чтобы создать нового вернитесь на страницу франчайзи.</p>
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4">
					{managersList ?
						<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
							{({ errors, touched, setFieldValue, isSubmitting }) => (
								<Form>
									<div className="mb-3">
										<Field 
											name="managerId"
											component={InputSelect}
											label="ФИО *" 
											id="managerId"
											options={managersList}
										/>
									</div>

									<div className="pt-3">
										<button type="submit" className="btn btn-primary w-100">Прикрепить управляющего</button>
									</div>
								</Form>
							)}
						</Formik>
					:
						<div><Loader /></div>
					}
				</div>
			</div>
			<InfoModal isOpen={isModalOpen} onCancel={() => closeModal()} {...modalData} />
		</div>
	);
}

export default Add;