import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Loader from '../../../../components/Loader';
import InputDate from "../../../../components/InputDate";
import InfoModal from '../../../../utils/modal/InfoModal';

import api from '../../../../packages/api';

const StatisticsSection = (props) => {
	
	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
	}

	const onSubmit = (values, { setSubmitting }) => {
		values.franchiseeId = props.id;
		api.franchisee.doc(values).then(result => {
			setSubmitting(false);
			if (result.data.success) {
				setModalData({content: "<p>Показатели франчайзи: <br/>Поступления: " + result.data.receipt + " " + props.currency +"<br/>Снятия: " + result.data.withdrawal + " " + props.currency +" <br/>Комиссия: <b>" + result.data.comission +" " + props.currency + "</b></p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	let initialValues = { dateFrom: '', dateTo: '' };

	let validationSchema = Yup.object({
		dateFrom: Yup.string().required('Обязательно'),
		dateTo: Yup.string().required('Обязательно'),
	})

	return (
		<div className="StatisticsSection">
			<h3 className="mb-3">Отчётность</h3>

			<div className="card mb-5">
				{props.percent ?
					<div className="card-header py-3 d-flex justify-content-between">
						<span>Комиссионный процент</span>
						<span>{props.percent}</span>
					</div>
					:
					<div className="card-header py-3 text-center">
						<Loader />
					</div>
				}
			</div>
			
			<p>Чтобы посмотреть показатели франчайзи, выберите период</p>
			<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
				{({ errors, touched, setFieldValue, values }) => (
					<Form>
						<div className="mb-3">
							<Field 
								name="dateFrom"
								component={InputDate}
								label="От какого числа *"
								id="dateFrom"
							/>
						</div>

						<div className="mb-3">
							<Field 
								name="dateTo"
								component={InputDate}
								label="До какого числа *"
								id="dateTo"
							/>
						</div>

						<div className="pt-3">
							<button type="submit" className="btn btn-primary w-100">Сгенерировать отчёт</button>
						</div>
					</Form>
				)}
			</Formik>
			<InfoModal isOpen={isModalOpen} onCancel={() => closeModal()} {...modalData} />
		</div>
	);
}

export default StatisticsSection;