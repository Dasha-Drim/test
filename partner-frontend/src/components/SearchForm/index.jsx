import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import InputText from "../InputText";

const SearchForm = (props) => {
	/* PROPS:
	props.onSubmit
	*/
	const onSubmit = (values, { setSubmitting }) => {
			props.onSubmit(values);
	}

	let initialValues = { search: '' };

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit} >
				{({ errors, touched, setFieldValue, isSubmitting }) => (
					<Form  className="d-flex align-items-center">
						<Field 
							name="search"
							component={InputText}
							id="search"
						/>
						<button type="submit" className="ms-2 btn btn-secondary">Поиск</button>
					</Form>
				)}
		</Formik>
	);
}

export default SearchForm;