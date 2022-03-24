import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import InputSelect from '../../../../components/InputSelect';
import InputText from '../../../../components/InputText';
import InputDate from '../../../../components/InputDate';

const SearchFormComponent = (props) => {
	/* PROPS:
	props.onSubmit (function)
	*/

	const onSubmit = (values, { setSubmitting }) => {
			props.onSubmit(values);
			setSubmitting(false);
	}

	let initialValues = { id: '', paymentType: '', paymentStatus: '', paymentMethod: '', dateFrom: '', dateTo: '' };

	let validationSchema = Yup.object({
		id: Yup.string(),
		paymentType: Yup.string(),
		paymentStatus: Yup.string(),
		paymentMethod: Yup.string(),
		dateFrom: Yup.date(),
		dateTo: Yup.date(),
	})

	const transactionTypeOptions = [
		{ value: '', label: 'Можно выбрать' },
		{ value: 'deposit', label: 'Пополнение' },
		{ value: 'withdraw', label: 'Списание' },
	];

	const transactionStatusOptions = [
		{ value: '', label: 'Можно выбрать' },
		{ value: 'pending', label: 'Ожидает' },
		{ value: 'succeeded', label: 'Успешно' },
		{ value: 'canceled', label: 'Закрыт' },
	];

	const paymentMethodOptions = [
		{ value: '', label: 'Можно выбрать' },
		{ value: 'paykassapro', label: 'PayKassa' },
		{ value: 'interkassa', label: 'Interkassa' },
	];

	return (
		<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
			{({ errors, touched, setFieldValue, isSubmitting }) => (
				<Form className="row mb-4">
					<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 mb-3">
						<Field 
							name="id"
							component={InputText}
							label="ID платежа / ID покупателя" 
							id="id"
						/>
					</div>

					<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 mb-3">
						<Field 
							name="paymentType"
							component={InputSelect}
							label="Тип транзакции" 
							id="paymentType"
							options={transactionTypeOptions}
						/>
					</div>

					<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 mb-3">
						<Field 
							name="paymentStatus"
							component={InputSelect}
							label="Статус транзакции" 
							id="paymentStatus"
							options={transactionStatusOptions}
						/>
					</div>

					<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 mb-3">
						<Field 
							name="paymentMethod"
							component={InputSelect}
							label="Платежная система" 
							id="paymentMethod"
							options={paymentMethodOptions}
						/>
					</div>

					<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 mb-3">
						<Field 
							name="dateFrom"
							component={InputDate}
							label="Не ранее даты" 
							id="dateFrom"
						/>
					</div>

					<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 mb-3">
						<Field 
							name="dateTo"
							component={InputDate}
							label="Не позднее даты" 
							id="dateTo"
						/>
					</div>

					<div className="col-12 col-sm-10 col-md-8 col-lg-12 d-flex justify-content-between">
						<button className="btn btn-light" type="reset" disabled={isSubmitting}>Очистить</button>
						<button className="btn btn-primary" disabled={isSubmitting}>Применить</button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

export default SearchFormComponent;