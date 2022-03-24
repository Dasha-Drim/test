import { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import InputText from "../../../../../../../components/InputText";

import api from '../../../../../../../packages/api';
import InfoModal from '../../../../../../../utils/modal/InfoModal';

const Add = () => {
	let location = useLocation();
	let navigate = useNavigate();

	let [idFilial] = useState((location.state && location.state.idFilial) ? location.state.idFilial : null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
		navigate("/filial", { state: {idFilial: idFilial, tab: 2}});
	}

	const onSubmit = (values, { setSubmitting }) => {
		values.filialId = idFilial;
		api.operators.add(values).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Оператор успешно создан <br/>Логин: " + result.data.login + "<br/>Пароль: " + result.data.password + "</p>"});
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
		if (!idFilial) navigate("/");
	}, [])

	return (
		<div className="FranchiseFilialOperatorsAdd">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-1">Создание нового оператора</h1>
					<p>Оператор будет закреплён за этим подразделением</p>
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4">
					<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
						{({ errors, touched, setFieldValue, isSubmitting }) => (
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