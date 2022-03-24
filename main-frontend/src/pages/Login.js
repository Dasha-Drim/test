import { useState, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
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

import './Login.scss';

const Login = (props) => {

	const { t } = useTranslation();

	const { register: registerSignIn, handleSubmit: handleSubmitSignIn, errors: errorsSignIn, control: controlSignIn, setError: setErrorSignIn, clearErrors: clearErrorsSignIn} = useForm();

	const [typeUser, setTypeUser] = useState(null);
	const [stepAuth, setStepAuth] = useState(1);

	let history = useHistory();

	const signInRequest = async (data) => {
		let userData = await API.post('/auth/players', data);
		return await userData.data;
	};

	// AUTH METHOD
	let auth = props.useAuth();
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(auth.userType !== "vizitor");
	// END OF AUTH METHOD

	let SingIn = (data) => {
		//data.phone = String(data.phone.replace(/[^0-9+]+/g,""));
		signInRequest(data).then((result) => {
			console.log(result);
			if(result.success) {
				auth.signin(() => {
					setUserIsLoggedIn(true);
				});
			}
			else {
				setErrorSignIn("wrongDataSignIn", {
					type: "manual",
					message: "Incorrect username or password entered"
				});
			}
		},
		(error) => {
			alert("System error: "+ error)
		})
	}

	return (
		<div className="Login">
			{userIsLoggedIn ? <Redirect to="/lk" /> : ""}
			<div className="container-fluid px-1">
				<div className="row m-0 px-md-4 pt-4 pb-5 justify-content-center">
					<div className="col-12 col-lg-11 offset-lg-1 mb-5">
						<Link to="/auth" className="d-flex align-items-center"><img src={ArrayBack} alt="" className="mr-2"/>{t('come_back')}</Link>
					</div>

					<div className={`col-12 col-sm-8 col-lg-6 Login__content justify-content-center ${(stepAuth === 1) ? "d-flex" : "d-none"}`}>
						<div className="content__holder text-center py-5 py-sm-6 px-2 px-sm-4">
							<h2 className="mb-2">{t('login_title')}</h2>
							<p className="mb-3">{t('login_text')}</p>
            				<div className="button-holder mb-2 text-left">
				                <button onClick={(e)=>{setStepAuth(2); setTypeUser("online")}}>{t('online')}</button>
				            </div>
              				<div className="button-holder text-left">
                				<button onClick={(e)=>{setStepAuth(2); setTypeUser("offline")}}>{t('offline')}</button>
              				</div>
						</div>
					</div>
					<div className={`col-12 col-sm-8 col-lg-6 Login__content justify-content-center ${(stepAuth === 2) ? "d-flex" : "d-none"}`}>
						<div className="content__holder text-center py-5 py-sm-6 px-2 px-sm-4">
							<h2 className="mb-2">{t('login_title')}</h2>
							{
								(typeUser === "online") &&
								<p className="mb-3">{t('online_text')}</p>
							}
							{
								(typeUser === "offline") &&
								<p className="mb-3">{t('offline_text')}</p>
							}
							
            				{errorsSignIn.wrongDataSignIn ? <span className="content__span mb-3">{t('error_text')} <Link to="/restorepassword">{t('forgot_your_password_link')}</Link></span> : ''}
           					<form className="Login__form" onSubmit={handleSubmitSignIn(SingIn)}>
           					{
								(typeUser === "online") &&
								<>
								<div className="form__input-holder mb-2 text-left">
				                	<InputPublic updateInput={() => clearErrorsSignIn('wrongDataSignIn')} refy={registerSignIn({required: true})} name="login" label={t('label_input_login')} />
				              	</div>
              					<div className="form__input-holder text-left mb-2">
              						<InputPublic refy={registerSignIn({required: true, minLength: 7})} updateInput={() => clearErrorsSignIn('wrongDataSignIn')} errors={errorsSignIn} name="password" type="password" label={t('label_input_password')}/>
              					</div>
              					</>
							}
							{
								(typeUser === "offline") &&
								<div className="form__input-holder text-left mb-2">
              						<InputPublic refy={registerSignIn({required: true, minLength: 6})} updateInput={() => clearErrorsSignIn('wrongDataSignIn')} errors={errorsSignIn} name="code" type="code" label={t('label_input_code')}/>
              					</div>
							}
				              	
              					<input type="submit" className="main-btn d-block w-100" value={t('enter')} />
            				</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;

