import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import InputText from "../../../components/InputText";
import InputDate from "../../../components/InputDate";

import api from '../../../packages/api';

const Add = () => {
	let navigate = useNavigate();
	// checkbox logic (if promocode has no cancellation date, hide field and set false to form dataset)
	const [isNoCancellationDate, setIsNoCancellationDate] = useState(false);
	const onCancellationDateCheckboxChange = (newValue, setFieldValue) => {
		if(newValue) setFieldValue("dateEnd", false);
		else setFieldValue("dateEnd", "");
		setIsNoCancellationDate(newValue);
	}

	let promocodesRequest = (data) => {
		api.promocodes.add(data).then(result => {
			console.log("result", result.data);
			if (result.data.success) {
				navigate("/promo");
			}
		});
	}

	const onSubmit = (values, { setSubmitting }) => {
		console.log("values", values);
		promocodesRequest(values);
	}

	let initialValues = { promocode: '', price: '', dateEnd: '' };

	let validationSchema = Yup.object({
		promocode: Yup.string().required('Обязательно'),
		price: Yup.string().required('Обязательно'),
		dateEnd: !isNoCancellationDate && Yup.date().min(new Date(), "Слишком рано").required('Обязательно'),
	})

	return (
		<div className="PromoAdd">
			<div className="row my-5">
				<div className="col-12">
					<h1 className="mb-0">Создание нового промокода</h1>
				</div>
			</div>
			<div className="row mb-5">
				<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4">
					<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
						{({ errors, touched, setFieldValue, isSubmitting }) => (
							<Form>
								<div className="mb-3">
									<Field 
										name="promocode"
										component={InputText}
										label="Название промокода *" 
										helperText="Введите кодовое слово, которое будет использоваться как промокод" 
										id="promocode"
									/>
								</div>

								<div className="mb-3">
									<Field 
										name="price"
										component={InputText}
										label="Размер бонуса в $ *" 
										helperText="Целое число. Будет пересчитано в валюты пользователей" 
										id="price"
									/>
								</div>

								<div className="mb-3">
									{!isNoCancellationDate ? <>
										<Field 
											name="dateEnd"
											component={InputDate}
											label="Дата окончания" 
											helperText="После этого срока промокод нельзя будет применить" 
											id="dateEnd"
										/>
									</> : ""}
									<div className="form-check mt-2">
										<input className="form-check-input" type="checkbox" value={isNoCancellationDate} onChange={()=> onCancellationDateCheckboxChange(!isNoCancellationDate, setFieldValue)} id="flexCheckDefault" />
										<label className="form-check-label" htmlFor="flexCheckDefault">
											Без срока окончания
										</label>
									</div>
								</div>

								<div className="pt-3">
									<button type="submit" className="btn btn-primary w-100">Создать промокод</button>
								</div>
							</Form>
						)}
					</Formik>
					
				</div>
			</div>
		</div>
	);
}

export default Add;