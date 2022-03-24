import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import InfoModal from '../../../utils/modal/InfoModal';
import InputText from "../../../components/InputText";
import InputSelect from "../../../components/InputSelect";

import api from '../../../packages/api';

const Add = () => {
	
	let navigate = useNavigate();

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {navigate("/franchisee")}

	const onSubmit = (values, { setSubmitting }) => {
		api.franchisee.add(values).then(result => {
			if (result.data.success) {
				setModalData({content: "<p>Франчайзи успешно создан. </br/> Логин: " + result.data.login + "<br/>Пароль: " + result.data.password + "</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let initialValues = { fio: '', percent: '', currency: 'RUB' };

	let validationSchema = Yup.object({
		fio: Yup.string().required('Обязательно'),
		percent: Yup.string().required('Обязательно'),
		currency: Yup.string().required('Обязательно'),
	})

	let currencyOptions = [
		{label: "РУБ", value: "RUB"},
		{label: "ТНГ", value: "KZT"},
		{label: "USD", value: "USD"},
		{label: "EUR", value: "EUR"},
	];

	return (
		<div className="FranchiseAdd">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Создание нового франчайзи</h1>
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

								<div className="mb-3">
									<Field 
										name="percent"
										component={InputText}
										label="Комиссионный процент *" 
										helperText="Целое число (без знака %). На основе этого процента будет рассчитываться прибыль в статистике" 
										id="percent"
									/>
								</div>

								<div className="mb-3">
									<Field 
										name="currency"
										component={InputSelect}
										label="Выберите валюту *" 
										helperText="Деятельность всего франчайзи должна будет осуществляться в этой валюте" 
										id="currency"
										options={currencyOptions}
									/>
								</div>

								<div className="pt-3">
									<button type="submit" className="btn btn-primary w-100">Создать франчайзи</button>
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