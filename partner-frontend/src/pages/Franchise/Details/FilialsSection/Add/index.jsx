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

	let [idFranchisee] = useState((location.state && location.state.idFranchisee) ? location.state.idFranchisee : null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);	
		navigate("/", { state: {tab: 1}});
	}

	const onSubmit = (values, { setSubmitting }) => {
		values.id = idFranchisee;
		api.filials.add(values).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Филиал успешно создан</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let initialValues = { name: '' };

	let validationSchema = Yup.object({
		name: Yup.string().required('Обязательно'),
	})

	useEffect(() => {
		if (!idFranchisee) navigate("/");
	}, [])

	return (
		<div className="FranchiseFilialAdd">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Создание нового подразделения</h1>
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4">
					<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
						{({ errors, touched, setFieldValue }) => (
							<Form>
								<div className="mb-3">
									<Field 
										name="name"
										component={InputText}
										label="Название *" 
										id="name"
									/>
								</div>

								<div className="pt-3">
									<button type="submit" className="btn btn-primary w-100">Создать подразделение</button>
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