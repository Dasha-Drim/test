import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next'

// components
import API from '../utils/API';
import Header from "../blocks/Header/Header";
import Footer from "../blocks/Footer/Footer";
import InputPublic from '../atoms/InputPublic/InputPublic';
import ControllerInput from '../atoms/InputPublic/ControllerInput';

// graphic
import ArrayBack from './img/ArrayBack.svg';

import './RestorePassword.scss';

const RestorePassword = (props) => {

	const { t } = useTranslation();

	const { register: registerResetPassword, handleSubmit: handleSubmitResetPassword, errors: errorsResetPassword, control: controlResetPassword, setError: setErrorResetPassword, clearErrors: clearErrorsResetPassword} = useForm();
	const { register: registerResetPassword2, handleSubmit: handleSubmitResetPassword2, errors: errorsResetPassword2, control: controlResetPassword2, setError: setErrorResetPassword2, clearErrors: clearErrorsResetPassword2} = useForm();
	const { register: registerResetPassword3, handleSubmit: handleSubmitResetPassword3, errors: errorsResetPassword3, control: controlResetPassword3, setError: setErrorResetPassword3, clearErrors: clearErrorsResetPassword3} = useForm();

	const [continueRestorePassword, setContinueRestorePassword] = useState(0);

	let history = useHistory();

	// AUTH METHOD
	let auth = props.useAuth();
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(auth.userType !== "vizitor");
	// END OF AUTH METHOD

	const resetPasswordRequest = async (data) => {
		let userData = await API.post('/reset', data);
		return await userData.data;
	}

	let ResetPassword = (data) => {
		resetPasswordRequest(data).then(
			(result) => {
				console.log(result);
				console.log('result.success1', result.success)
				if (result.success) setContinueRestorePassword(1);
				else {
					setErrorResetPassword("wrongDataResetPassword", {
						type: "manual",
						message: "Invalid phone number entered"
					});
				}
			},
			(error) => {
				alert("System error: "+ error)
			})
	}

	let ResetPassword2 = (data) => {
		console.log('data', data);
		resetPasswordRequest({code: data.code}).then((result) => {
			console.log(result);
			console.log('result.success2', result.success)
			if (result.success) setContinueRestorePassword(2);
			else {
				console.log('wrongDataResetPassword', result)
				setErrorResetPassword2("wrongDataResetPassword", {
					type: "manual",
					message: "Incorrect code"
				});
			}
		},
		(error) => {
			alert("System error: "+ error)
		})
	}


	let ResetPassword3 = (data) => {
		resetPasswordRequest(data).then((result) => {
			console.log(result);
			console.log('result.success3', result.success)
			if(result.success) {
				auth.signin(() => {
					setUserIsLoggedIn(true);
					history.push('/lk');
				});  				
			}
			else {
				setErrorResetPassword3("wrongDataResetPassword", {
					type: "manual",
					message: "Password must be longer"
				});
			}
		},
		(error) => {
			alert("System error: "+ error)
		})
	}

	return (
		<div className="RestorePassword">
			<div className="container-fluid px-1">
				<div className="row m-0 px-md-4 pt-4 pb-5 justify-content-center">
					<div className="col-12 col-lg-11 offset-lg-1 mb-5">
						<Link to="/auth" className="d-flex align-items-center"><img src={ArrayBack} alt="" className="mr-2"/>{t('come_back')}</Link>
					</div>
					<div className={`col-12 col-sm-8 col-lg-6 RestorePassword__content justify-content-center ${!continueRestorePassword ? "d-flex" : "d-none"}`}>
						<div className="content__holder text-center py-5 py-sm-6 px-2 px-sm-4">
							<h2 className="mb-2">{t('restore_password_title')}</h2>
							<p className="mb-3">{t('restore_password_text_one')}</p>
							{errorsResetPassword.wrongDataResetPassword ? <span className="content__span mb-3">{t('restore_password_error_one')}</span> : ''}
							<form className="RestorePassword__form" onSubmit={handleSubmitResetPassword(ResetPassword)}>
								<div className="form__input-holder mb-2 text-left">
									<ControllerInput onChangeFun={() => clearErrorsResetPassword('wrongDataResetPassword')} control={controlResetPassword} refy={registerResetPassword({required: true, minLength: 7})} errors={errorsResetPassword} setError={setErrorResetPassword} clearErrors={clearErrorsResetPassword} name="login" label={t('restore_password_label_login')} />
								</div>
								<input type="submit" className="main-btn d-block w-100" value={t('restore_password_btn_one')} />
							</form>
						</div>
					</div>

					<div className={`col-12 col-sm-8 col-lg-6 RestorePassword__content justify-content-center ${(continueRestorePassword === 1) ? "d-flex" : "d-none"}`}>
						<div className="content__holder text-center py-6 px-4">
							<h2 className="mb-2">{t('restore_password_title')}</h2>
							{errorsResetPassword2.wrongDataResetPassword ? <span className="content__span mb-3">{t('restore_password_error_two')}</span> : ''}
							<form className="RestorePassword__form" onSubmit={handleSubmitResetPassword2(ResetPassword2)}>
								<div className="form__input-holder mb-2 text-left">
									<ControllerInput onChangeFun={() => clearErrorsResetPassword2('wrongDataResetPassword')} control={controlResetPassword2} refy={registerResetPassword2({required: true})} errors={errorsResetPassword2} setError={setErrorResetPassword2} clearErrors={clearErrorsResetPassword2} mask="999999" maskLength={6} name="code" label={t('restore_password_label_code')} />
								</div>
								<input type="submit" className="main-btn d-block w-100" value={t('restore_password_btn_two')} />
							</form>
						</div>
					</div>

					<div className={`col-12 col-sm-8 col-lg-6 RestorePassword__content justify-content-center ${(continueRestorePassword === 2) ? "d-flex" : "d-none"}`}>
						<div className="content__holder text-center py-6 px-4">
							<h2 className="mb-2">{t('restore_password_title')}</h2>
							<p className="mb-3">{t('restore_password_text_three')}</p>
							<form className="RestorePassword__form" onSubmit={handleSubmitResetPassword3(ResetPassword3)}>
								<div className="form__input-holder mb-2 text-left">
									<InputPublic refy={registerResetPassword3({required: true, minLength: 7})} onChange={() => clearErrorsResetPassword3('wrongDataResetPassword')} errors={errorsResetPassword3} name="password" type="password" label={t('restore_password_label_passwod')}/>
								</div>
								<input type="submit" className="main-btn d-block w-100" value={t('restore_password_btn_three')} />
							</form>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default RestorePassword;


