import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import api from '../../../packages/api';
import { roleAdapter } from '../../../packages/storage';


import InputText from "../../../components/InputText";
import InputPassword from "../../../components/InputPassword";

const Main = (props) => {

	const auth = props.useAuth();
	const navigate = useNavigate();

	const onSubmit = (values, { setSubmitting }) => {
		api.authorization.login(values).then(result => {
			if (result.data.success) {
				auth.signin({login: values.login, role: result.data.role}, () => {
					navigate("/", { replace: true });
				})
				alert(JSON.stringify(values, null, 2));
			} else {
				alert(JSON.stringify(result.data));
			}
			setSubmitting(false);
		});
	}

	let initialValues = { login: '', password: '' };

	let validationSchema = Yup.object({
		login: Yup.string().required('Обязательно'),
		password: Yup.string().required('Обязательно'),	
	})

	return (
		<div className="AuthMain container">
			<div className="row my-5 justify-content-center">
				<div className="px-4 col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxxl-3">
					<h1 className="mb-4">Авторизация</h1>
					<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
						{({ errors, touched, setFieldValue, isSubmitting }) => (
							<Form>
								<div className="mb-3">
									<Field 
										name="login"
										component={InputText}
										label="Логин *" 
										id="login"
									/>
								</div>

								<div className="mb-3">
									<Field 
										name="password"
										component={InputPassword}
										label="Пароль *" 
										id="password"
									/>
								</div>

								<div className="pt-3">
									<button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>Войти</button>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
}

export default Main;