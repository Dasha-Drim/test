import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Loader from '../../../../components/Loader';
import InputDate from "../../../../components/InputDate";

const StatisticsSection = (props) => {
	/* PROPS:
	props.balance
	props.accountCurrency
	*/

	const onSubmit = (values, { setSubmitting }) => {
		console.log("values", values);
		setTimeout(() => {
			alert(JSON.stringify(values, null, 2));
			setSubmitting(false);
		}, 400);
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
		</div>
	);
}

export default StatisticsSection;