import { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import api from '../../../../../../../packages/api';
import InputText from "../../../../../../../components/InputText";
import InfoModal from '../../../../../../../utils/modal/InfoModal';

const Register = () => {
	let location = useLocation();
	let navigate = useNavigate();

	let [idFilial] = useState((location.state && location.state.idFilial) ? location.state.idFilial : null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
		navigate("/");
	}

	const onSubmit = (values, { setSubmitting }) => {
		console.log("values", values);
		values.filialId = idFilial;
		api.players.add(values).then(result => {
			console.log("resulttt", result.data);
			if (result.data.success) {
				navigate("/players/" + result.data.id, {state: {idUser: result.data.id}});
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let initialValues = { phone: '' };

	let validationSchema = Yup.object({
		phone: Yup.string().required('Обязательно'),
	})

	useEffect(() => {
		if (!idFilial) navigate("/");
	}, [])

	return (
		<div className="FranchiseFilialPlayerRegister">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-1">Регистрация гостя</h1>
					<p>Если аккаунт есть, будет открыта страница аккаунта. Если нет - создан новый</p>
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4">
					<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
						{({ errors, touched, setFieldValue, isSubmitting }) => (
							<Form>
								<div className="mb-3">
									<Field 
										name="phone"
										component={InputText}
										label="Телефон *" 
										id="phone"
										helperText="Пример: +79123456789"
									/>
								</div>

								<div className="pt-3">
									<button type="submit" className="btn btn-primary w-100">Создать игрока</button>
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

export default Register;