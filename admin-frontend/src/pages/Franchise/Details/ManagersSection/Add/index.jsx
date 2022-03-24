import { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import InputText from "../../../../../components/InputText";
import InfoModal from '../../../../../utils/modal/InfoModal';

import api from '../../../../../packages/api';

const Add = () => {
	let location = useLocation();
	let navigate = useNavigate();

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let [idFranchisee] = useState((location.state && location.state.idFranchisee) ? location.state.idFranchisee : null);

	let closeModal = () => {
		setIsModalOpen(false);
		navigate("/franchisee/details", { state: {idFranchisee: idFranchisee, tab: 2}});
	}

	const onSubmit = (values, { setSubmitting }) => {
		values.id = idFranchisee;
		api.managers.add(values).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Управляющий успешно создан <br/>Логин: " + result.data.login + "<br/>Пароль: " + result.data.password + "</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let initialValues = { fio: '' };

	let validationSchema = Yup.object({
		fio: Yup.string().required('Обязательно'),
	})

	useEffect(() => {
		if (!idFranchisee) navigate("/franchisee");
	}, [])

	return (
		<div className="FranchiseManagersAdd">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Создание нового управляющего</h1>
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4">
					<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
						{({ errors, touched, setFieldValue }) => (
							<Form>
								<div className="mb-3">
									<Field 
										name="fio"
										component={InputText}
										label="ФИО *" 
										id="fio"
									/>
								</div>

								<div className="pt-3">
									<button type="submit" className="btn btn-primary w-100">Создать управляющего</button>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
			<InfoModal isOpen={isModalOpen} onCancel={() => closeModal()} {...modalData} />
		</div>
	);
}

export default Add;