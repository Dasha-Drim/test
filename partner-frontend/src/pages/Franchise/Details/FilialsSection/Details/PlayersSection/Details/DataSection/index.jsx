import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Loader from "../../../../../../../../components/Loader";
import InputText from "../../../../../../../../components/InputText";
import InputDate from "../../../../../../../../components/InputDate";
import InputSelect from "../../../../../../../../components/InputSelect";
import InputFile from "../../../../../../../../components/InputFile";
import InfoModal from '../../../../../../../../utils/modal/InfoModal';

import api from '../../../../../../../../packages/api';

const DataSection = (props) => {
	/* PROPS:
	props.accountInfo
	*/
	const [maxBithDate, setMaxBithDate] = useState(new Date);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
	}

	const onSubmit = (values, { setSubmitting }) => {
		let formData = new FormData();
    	for (let key in values) formData.append(key, values[key]);
    	formData.append("action", "passport");
    	formData.append("idUser", props.idUser);
    	api.players.put(formData).then(result => {
			setSubmitting(false);
			if (result.data.success) {
				setModalData({content: "<p>Пасспорт успешно обновлён</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	const onSubmitStatus = (values, { setSubmitting }) => {
		let formData = new FormData();
    	formData.append("action", values.active);
    	formData.append("idUser", props.idUser);
    	api.players.put(formData).then(result => {
			if (result.data.success) {
				if (values.active === "activate") setModalData({content: "<p>Пользователь активирован <br/>Код доступа: <b>" + result.data.code + "</b></p>"});
				if (values.active === "deactivate") setModalData({content: "<p>Пользователь больше не активен</p>"});
				setIsModalOpen(true);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
			setSubmitting(false)
		});

	}
	
	let validationSchema = Yup.object({
		lastName: Yup.string().required('Обязательно'),
		firstName: Yup.string().required('Обязательно'),
		middleName: Yup.string(),
		birthday: Yup.date().max(maxBithDate, "Слишком рано").required('Обязательно'),
		number: Yup.string().required('Обязательно'),
		passportPhoto: Yup.mixed().required('Обязательно'),
	})

	let validationSchemaStatus = Yup.object({
		active: Yup.string().required('Обязательно'),
	})

	let accountStatusOptions = [
		{ value: 'activate', label: 'Активен' },
		{ value: 'deactivate', label: 'Не активен' },
	];

	useEffect(() => {
		let date = new Date();
		let maxDate = new Date();
		maxDate.setFullYear(date.getFullYear()-18);
		setMaxBithDate(maxDate);
	}, [])

	return (
		<div className="DataSection">
			<h3 className="mb-3">Данные аккаунта</h3>

			<div className="card mb-5">
				{props.accountInfo && props.accountInfo.type && props.accountInfo.value ?
					<div className="card-header py-3 d-flex justify-content-between">
						<span>{props.accountInfo.type}</span>
						<span>{props.accountInfo.value}</span>
					</div>
				:
					<div className="card-header py-3 d-flex justify-content-center">
						<Loader />
					</div>
				}
			</div>
			{props.active  ?
			<Formik initialValues={{active: props.active}} validationSchema={validationSchemaStatus} onSubmit={onSubmitStatus} >
				{({ errors, touched, setFieldValue, isSubmitting }) => (
					<Form>
						<div className="mb-3">
							<Field 
								name="active"
								component={InputSelect}
								label="Статус аккаунта" 
								id="active"
								options={accountStatusOptions}
							/>
						</div>

						<div className="mb-5">
							<button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>Обновить статус</button>
						</div>
					</Form>
				)}
			</Formik>
			:
			<div className="card-header py-3 d-flex justify-content-center">
				<Loader />
			</div>
			}

			{props.passport  ?
				<Formik initialValues={{lastName: props.passport.surname, firstName: props.passport.name, middleName: props.passport.middleName, birthday: props.passport.dateBirth, number: props.passport.number, passportPhoto: props.passport.passportPhoto}} validationSchema={validationSchema} onSubmit={onSubmit} >
				{({ errors, touched, setFieldValue, isSubmitting }) => (
					<Form>
						<div className="mb-3">
							<Field 
								name="lastName"
								component={InputText}
								label="Фамилия *"
								id="lastName"
							/>
						</div>
						<div className="mb-3">
							<Field 
								name="firstName"
								component={InputText}
								label="Имя *"
								id="firstName"
							/>
						</div>
						<div className="mb-3">
							<Field 
								name="middleName"
								component={InputText}
								label="Отчество "
								id="middleName"
							/>
						</div>
						<div className="mb-3">
							<Field 
								name="birthday"
								component={InputDate}
								label="Дата рождения *"
								id="birthday"
							/>
						</div>
						<div className="mb-3">
							<Field 
								name="number"
								component={InputText}
								label="Номер документа *"
								id="number"
							/>
						</div>
						<div className="mb-3">
							<Field 
								name="passportPhoto"
								component={InputFile}
								label="Скан паспорта *" 
								id="passportPhoto"
								filePath={props.passport.passportPhoto}
							/>
						</div>
						<div className="pt-3">
							<button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>Обновить информацию</button>
						</div>
					</Form>
				)}
			</Formik>
			
			:
			<div className="card-header py-3 d-flex justify-content-center">
				<Loader />
			</div>
			}
			<InfoModal isOpen={isModalOpen} onCancel={() => closeModal()} {...modalData} />
			
		</div>
	);
}

export default DataSection;